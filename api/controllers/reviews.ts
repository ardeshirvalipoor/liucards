import type { Request, Response } from 'express'
import { z } from 'zod'
import services from '../services'
import { getQueueQuerySchema, submitReviewBodySchema } from '../schemas/review'

 async function getQueue(req: Request, res: Response) {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: 'Login required' })

  const parsed = getQueueQuerySchema.safeParse(req.query)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid query' })
  const { limit, include_new } = parsed.data

  try {
    const queue = await services.reviews.getQueue(userId, limit, include_new ?? true)
    res.json({ queue, count: queue.length })
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Failed to load queue' })
  }
}

 async function post(req: Request, res: Response) {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: 'Login required' })

  const parsed = submitReviewBodySchema.safeParse(req.body)
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => e.message).join(', ')
    return res.status(400).json({ error: msg })
  }

  try {
    const next = await services.reviews.submit(userId, parsed.data)
    res.json({ ok: true, next })
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Review failed' })
  }
}

export default {
  getQueue,
  post
}