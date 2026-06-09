import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { remove } from '../../src/commands/remove.js'

const makeConfig = (agents: Record<string, { files: string[] }>) =>
  JSON.stringify({ source: 'owner/repo', ref: 'main', agents }, null, 2)

describe('remove', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'yaar-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('errors when agent is not installed', async () => {
    writeFileSync(join(tmpDir, '.yaar.json'), makeConfig({}))

    await remove('nonexistent/agent')

    expect(console.error).toHaveBeenCalledWith('Agent "nonexistent/agent" is not installed.')
    expect(process.exit).toHaveBeenCalledWith(1)
  })

  it('deletes tracked files from filesystem', async () => {
    const agentFile = '.claude/agents/test/agent.md'
    const fullPath = join(tmpDir, agentFile)
    mkdirSync(join(tmpDir, '.claude/agents/test'), { recursive: true })
    writeFileSync(fullPath, 'content')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { files: [agentFile] } })
    )

    await remove('test/agent')

    expect(existsSync(fullPath)).toBe(false)
  })

  it('removes agent entry from .yaar.json', async () => {
    const agentFile = '.claude/agents/test/agent.md'
    mkdirSync(join(tmpDir, '.claude/agents/test'), { recursive: true })
    writeFileSync(join(tmpDir, agentFile), 'content')

    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { files: [agentFile] } })
    )

    await remove('test/agent')

    const config = JSON.parse(readFileSync(join(tmpDir, '.yaar.json'), 'utf-8'))
    expect(config.agents['test/agent']).toBeUndefined()
  })

  it('does not throw when tracked file is already missing', async () => {
    writeFileSync(
      join(tmpDir, '.yaar.json'),
      makeConfig({ 'test/agent': { files: ['.claude/agents/test/agent.md'] } })
    )

    await expect(remove('test/agent')).resolves.toBeUndefined()
  })
})
