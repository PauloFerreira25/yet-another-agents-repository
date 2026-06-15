import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { tmpdir } from 'os'
import { update } from '../../src/commands/update.js'

const makeConfig = (agents: Record<string, { agent: string; rules: string[]; entrypoint?: boolean }>) => {
  const withSource = Object.fromEntries(
    Object.entries(agents).map(([k, v]) => [k, { source: 'owner/repo', ref: 'main', ...v }])
  )
  return JSON.stringify({ agents: withSource }, null, 2)
}

const agentWithRules = (rules: string[]) => {
  const rows = rules.map(r => `| rule | Before anything | ${r} | | |`).join('\n')
  return `---\nname: test\ndescription: test\ntools: Read\nmodel: sonnet\n---\n\nSystem prompt.\n\n## Rules\n\n| Name | Scope | File | Required | Category |\n|---|---|---|---|---|\n${rows}\n`
}

const agentWithoutRules = () =>
  `---\nname: test\ndescription: test\ntools: Read\nmodel: sonnet\n---\n\nSystem prompt.\n`

describe('update', () => {
  let tmpDir: string
  let fetchFileMock: ReturnType<typeof vi.fn>
  let createFetcherMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'yaar-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    fetchFileMock = vi.fn().mockImplementation(
      async (_remotePath: string, localPath: string) => {
        const fullPath = resolve(tmpDir, localPath)
        mkdirSync(dirname(fullPath), { recursive: true })
        writeFileSync(fullPath, agentWithoutRules(), 'utf-8')
      }
    )

    createFetcherMock = vi.fn().mockResolvedValue(fetchFileMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('logs "No agents installed." when config is empty', async () => {
    writeFileSync(join(tmpDir, '.yaar.json'), makeConfig({}))

    await update(undefined, { createFetcher: createFetcherMock })

    expect(console.log).toHaveBeenCalledWith('No agents installed.')
    expect(createFetcherMock).not.toHaveBeenCalled()
  })

  it('logs error and continues when a named agent is not installed', async () => {
    writeFileSync(join(tmpDir, '.yaar.json'), makeConfig({}))

    await update('core/missing', { createFetcher: createFetcherMock })

    expect(console.error).toHaveBeenCalledWith('Agent "core/missing" is not installed.')
    expect(createFetcherMock).not.toHaveBeenCalled()
  })

  it('re-downloads the agent file', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [] } })
    )

    await update(undefined, { createFetcher: createFetcherMock })

    expect(createFetcherMock).toHaveBeenCalledWith('owner/repo', 'main')
    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/agents/core/agent.md',
      '.claude/agents/core/agent.md'
    )
  })

  it('downloads rules referenced in the new agent content', async () => {
    const ruleA = '.ia/rules/common/rule-a.md'
    const ruleB = '.ia/rules/common/rule-b.md'

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [] } })
    )

    fetchFileMock.mockImplementation(
      async (_remotePath: string, localPath: string) => {
        const fullPath = resolve(tmpDir, localPath)
        mkdirSync(dirname(fullPath), { recursive: true })
        if (localPath === '.claude/agents/core/agent.md') {
          writeFileSync(fullPath, agentWithRules([ruleA, ruleB]), 'utf-8')
        } else {
          writeFileSync(fullPath, '# rule content', 'utf-8')
        }
      }
    )

    await update(undefined, { createFetcher: createFetcherMock })

    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/.ia/rules/common/rule-a.md',
      ruleA
    )
    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/.ia/rules/common/rule-b.md',
      ruleB
    )

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['core/agent'].rules).toEqual([ruleA, ruleB])
  })

  it('deletes orphaned rules no longer referenced in the new agent content', async () => {
    const oldRule = '.ia/rules/common/old-rule.md'
    const newRule = '.ia/rules/common/new-rule.md'

    mkdirSync(join(tmpDir, '.ia/rules/common'), { recursive: true })
    writeFileSync(join(tmpDir, oldRule), '# old rule')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [oldRule] } })
    )

    fetchFileMock.mockImplementation(
      async (_remotePath: string, localPath: string) => {
        const fullPath = resolve(tmpDir, localPath)
        mkdirSync(dirname(fullPath), { recursive: true })
        if (localPath === '.claude/agents/core/agent.md') {
          writeFileSync(fullPath, agentWithRules([newRule]), 'utf-8')
        } else {
          writeFileSync(fullPath, '# rule content', 'utf-8')
        }
      }
    )

    await update(undefined, { createFetcher: createFetcherMock })

    expect(existsSync(join(tmpDir, oldRule))).toBe(false)
    expect(existsSync(join(tmpDir, newRule))).toBe(true)

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['core/agent'].rules).toEqual([newRule])
  })

  it('does not throw when an orphaned rule file is already missing from disk', async () => {
    const ghostRule = '.ia/rules/common/ghost.md'

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [ghostRule] } })
    )

    await expect(update(undefined, { createFetcher: createFetcherMock })).resolves.toBeUndefined()
  })

  it('preserves entrypoint flag after update', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [], entrypoint: true } })
    )

    await update(undefined, { createFetcher: createFetcherMock })

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['core/agent'].entrypoint).toBe(true)
  })

  it('does not add entrypoint flag when it was not set', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/agent': { agent: '.claude/agents/core/agent.md', rules: [] } })
    )

    await update(undefined, { createFetcher: createFetcherMock })

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['core/agent'].entrypoint).toBeUndefined()
  })

  it('updates only the named agent when agentName is specified', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({
        'core/agent-a': { agent: '.claude/agents/core/agent-a.md', rules: [] },
        'core/agent-b': { agent: '.claude/agents/core/agent-b.md', rules: [] },
      })
    )

    await update('core/agent-a', { createFetcher: createFetcherMock })

    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/agents/core/agent-a.md',
      '.claude/agents/core/agent-a.md'
    )
    expect(fetchFileMock).not.toHaveBeenCalledWith(
      'agents-src/agents/core/agent-b.md',
      expect.anything()
    )
  })

  it('updates all agents when agentName is omitted', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({
        'core/agent-a': { agent: '.claude/agents/core/agent-a.md', rules: [] },
        'core/agent-b': { agent: '.claude/agents/core/agent-b.md', rules: [] },
      })
    )

    await update(undefined, { createFetcher: createFetcherMock })

    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/agents/core/agent-a.md',
      '.claude/agents/core/agent-a.md'
    )
    expect(fetchFileMock).toHaveBeenCalledWith(
      'agents-src/agents/core/agent-b.md',
      '.claude/agents/core/agent-b.md'
    )
  })
})
