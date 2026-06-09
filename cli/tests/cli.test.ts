import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createProgram } from '../src/cli.js'

describe('CLI', () => {
  let addMock: ReturnType<typeof vi.fn>
  let removeMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    addMock = vi.fn().mockResolvedValue(undefined)
    removeMock = vi.fn().mockResolvedValue(undefined)
  })

  describe('add', () => {
    it('calls add() once for a single agent', async () => {
      await createProgram({ add: addMock }).parseAsync(['node', 'yaar', 'add', 'backend/agent-a'])

      expect(addMock).toHaveBeenCalledOnce()
      expect(addMock).toHaveBeenCalledWith('backend/agent-a', expect.any(Object))
    })

    it('calls add() for each agent when multiple are given', async () => {
      await createProgram({ add: addMock }).parseAsync([
        'node', 'yaar', 'add',
        'core/master-of-puppets', 'backend/aws-lambda-typescript', 'temperament/paulo',
      ])

      expect(addMock).toHaveBeenCalledTimes(3)
      expect(addMock).toHaveBeenCalledWith('core/master-of-puppets', expect.any(Object))
      expect(addMock).toHaveBeenCalledWith('backend/aws-lambda-typescript', expect.any(Object))
      expect(addMock).toHaveBeenCalledWith('temperament/paulo', expect.any(Object))
    })
  })

  describe('remove', () => {
    it('calls remove() once for a single agent', async () => {
      await createProgram({ remove: removeMock }).parseAsync(['node', 'yaar', 'remove', 'backend/agent-a'])

      expect(removeMock).toHaveBeenCalledOnce()
      expect(removeMock).toHaveBeenCalledWith('backend/agent-a')
    })

    it('calls remove() for each agent when multiple are given', async () => {
      await createProgram({ remove: removeMock }).parseAsync([
        'node', 'yaar', 'remove',
        'core/master-of-puppets', 'backend/aws-lambda-typescript',
      ])

      expect(removeMock).toHaveBeenCalledTimes(2)
      expect(removeMock).toHaveBeenCalledWith('core/master-of-puppets')
      expect(removeMock).toHaveBeenCalledWith('backend/aws-lambda-typescript')
    })
  })
})
