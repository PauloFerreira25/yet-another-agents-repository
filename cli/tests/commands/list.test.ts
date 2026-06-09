import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { list } from '../../src/commands/list.js'

const makeConfig = (agents: Record<string, { files: string[] }>) =>
  JSON.stringify({ source: 'owner/repo', ref: 'main', agents }, null, 2)

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
    writeFileSync(join(tmpDir, '.yaar.json'), makeConfig({}))

    await list('local')

    expect(console.log).toHaveBeenCalledWith('No agents installed.')
  })

  it('lists installed agents', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({
        'temperament/paulo': { files: ['.claude/agents/temperament/paulo.md'] },
        'backend/aws-lambda-typescript': {
          files: ['.claude/agents/backend/aws-lambda-typescript.md'],
        },
      })
    )

    await list('local')

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('owner/repo@main'))
    expect(console.log).toHaveBeenCalledWith('  - temperament/paulo')
    expect(console.log).toHaveBeenCalledWith('  - backend/aws-lambda-typescript')
  })
})
