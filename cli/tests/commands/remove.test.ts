import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { remove } from '../../src/commands/remove.js'

const makeConfig = (agents: Record<string, { agent: string; rules: string[]; entrypoint?: boolean }>) => {
  const withSource = Object.fromEntries(
    Object.entries(agents).map(([k, v]) => [k, { source: 'owner/repo', ref: 'main', ...v }])
  )
  return JSON.stringify({ agents: withSource }, null, 2)
}

describe('remove', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'yaar-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('errors when agent is not installed', async () => {
    writeFileSync(join(tmpDir, '.yaar.json'), makeConfig({}))

    await expect(remove('nonexistent/agent')).rejects.toThrow('Agent "nonexistent/agent" is not installed.')
  })

  it('deletes agent file and rules from filesystem', async () => {
    const agentFile = '.claude/agents/test/agent.md'
    const ruleFile = '.ai/rules/common/how-to-think.md'

    mkdirSync(join(tmpDir, '.claude/agents/test'), { recursive: true })
    mkdirSync(join(tmpDir, '.ai/rules/common'), { recursive: true })
    writeFileSync(join(tmpDir, agentFile), 'content')
    writeFileSync(join(tmpDir, ruleFile), 'content')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { agent: agentFile, rules: [ruleFile] } })
    )

    await remove('test/agent')

    expect(existsSync(join(tmpDir, agentFile))).toBe(false)
    expect(existsSync(join(tmpDir, ruleFile))).toBe(false)
  })

  it('removes agent entry from .yaar.json', async () => {
    const agentFile = '.claude/agents/test/agent.md'
    mkdirSync(join(tmpDir, '.claude/agents/test'), { recursive: true })
    writeFileSync(join(tmpDir, agentFile), 'content')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { agent: agentFile, rules: [] } })
    )

    await remove('test/agent')

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['test/agent']).toBeUndefined()
  })

  it('does not throw when tracked files are already missing', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { agent: '.claude/agents/test/agent.md', rules: ['.ai/rules/common/how-to-think.md'] } })
    )

    await expect(remove('test/agent')).resolves.toBeUndefined()
  })

  it('removes entrypoint block from CLAUDE.md', async () => {
    const agentFile = '.claude/agents/core/master-of-puppets.md'
    mkdirSync(join(tmpDir, '.claude/agents/core'), { recursive: true })
    writeFileSync(join(tmpDir, agentFile), 'content')

    const block = `Read the agent below and become it — follow its instructions for every task:\n\n@${agentFile}`
    writeFileSync(join(tmpDir, 'CLAUDE.md'), block + '\n')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'core/master-of-puppets': { agent: agentFile, rules: [], entrypoint: true } })
    )

    await remove('core/master-of-puppets')

    const claudeMd = readFileSync(join(tmpDir, 'CLAUDE.md'), 'utf-8')
    expect(claudeMd).not.toContain(`@${agentFile}`)
    expect(claudeMd).not.toContain('Read the agent below')
  })
})
