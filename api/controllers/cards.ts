import type { Request, Response } from 'express'
import { createCardBodySchema, listCardsQuerySchema } from '../schemas/card'
import services from '../services'


async function post(req: Request, res: Response) {
    const parse = createCardBodySchema.safeParse(req.body)
    if (!parse.success) {
        const msg = parse.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { front, back, device_id, client_created_at } = parse.data

    const userId = (req as any).user?.id || null
    if (!userId && !device_id) {
        return res.status(400).json({ error: 'device_id is required when not logged in' })
    }

    try {
        const result = await services.cards.create({
            userId,
            front,
            back,
            deviceId: device_id,
            clientCreatedAt: client_created_at
        })
        return res.json(result) // { cardId }
    } catch (err: any) {
        // Avoid leaking internals
        return res.status(500).json({ error: err.message || 'Failed to create card' })
    }
}


async function list(req: Request, res: Response) {
    const parsed = listCardsQuerySchema.safeParse(req.query)
    if (!parsed.success) {
        const msg = parsed.error.errors.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { limit, before, q, device_id, source, due_only } = parsed.data

    const userId = (req as any).user?.id ?? null
    if (!userId && !device_id) {
        return res.status(400).json({ error: 'device_id is required when not logged in' })
    }

    try {
        const rows = await services.cards.list({
            userId,
            deviceId: device_id,
            limit,
            before,
            q,
            source,
            dueOnly: due_only ?? false
        })
        res.json({ items: rows, count: rows.length })
    } catch (e: any) {
        res.status(500).json({ error: e.message || 'Failed to load cards' })
    }
}

export default {
    post,
    list
}