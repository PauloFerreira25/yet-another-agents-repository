import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { list } from '../../src/commands/list.js'

const makeConfig = (agents: Record<string, { source: string; ref: string; agent: string; rules: string[] }>) =>
  JSON.stringify({ agents }, null, 2)

describe('list local', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'yaar-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('shows message when no config exists', async () => {
    await list('local')

    expect(console.log).toHaveBeenCalledWith('No agents installed. Run: yaar add <agent>')
  })

  it('shows message when agents list is empty', async () => {
    writeFileSync(join(tmpDir, '.yaar.json'), JSON.stringify({ agents: {} }))

    await list('local')

    expect(console.log).toHaveBeenCalledWith('No agents installed.')
  })

  it('lists installed agents with their source and ref', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({
        'temperament/paulo': { source: 'owner/repo', ref: 'main', agent: '.claude/agents/temperament/paulo.md', rules: [] },
        'backend/aws-lambda-typescript': {
          source: 'owner/repo',
          ref: 'main',
          agent: '.claude/agents/backend/aws-lambda-typescript.md',
          rules: ['.ia/rules/common/how-to-think.md'],
        },
      })
    )

    await list('local')

    expect(console.log).toHaveBeenCalledWith('Installed agents:')
    expect(console.log).toHaveBeenCalledWith('  - temperament/paulo (owner/repo@main)')
    expect(console.log).toHaveBeenCalledWith('  - backend/aws-lambda-typescript (owner/repo@main)')
  })

  it('shows each agent with its own source when agents come from different repositories', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({
        'core/base-agent': { source: 'org-a/agents', ref: 'main', agent: '.claude/agents/core/base-agent.md', rules: [] },
        'core/custom-agent': { source: 'org-b/agents', ref: 'v2', agent: '.claude/agents/core/custom-agent.md', rules: [] },
      })
    )

    await list('local')

    expect(console.log).toHaveBeenCalledWith('  - core/base-agent (org-a/agents@main)')
    expect(console.log).toHaveBeenCalledWith('  - core/custom-agent (org-b/agents@v2)')
  })
})
