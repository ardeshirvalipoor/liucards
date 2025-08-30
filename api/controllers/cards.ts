import type { Request, Response } from 'express'
import services from '../services'
import { createCardBodySchema, editCardBodySchema, listCardsQuerySchema, searchCardSchema } from '../schemas/card'


async function post(req: Request, res: Response) {
    console.log('in post:', req.body);

    const parse = createCardBodySchema.safeParse(req.body)
    if (!parse.success) {
        console.log('parse error:', parse.error);
        const msg = parse.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { front, back, device_id, client_created_at, front_audio_url, back_audio_url } = parse.data

    const userId = (req as any).user?.id || null
    if (!userId && !device_id) {
        return res.status(400).json({ error: 'device_id is required when not logged in' })
    }
    console.log('calling service');

    try {
        const result = await services.cards.create({
            userId,
            front,
            back,
            front_audio_url,
            back_audio_url,
            deviceId: device_id,
            clientCreatedAt: client_created_at
        })
        return res.json(result) // { cardId }
    } catch (err: any) {
        // Avoid leaking internals
        return res.status(500).json({ error: err.message || 'Failed to create card' })
    }
}

async function edit(req: Request, res: Response) {
    const parse = editCardBodySchema.safeParse(req.body)
    if (!parse.success) {
        const msg = parse.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { front, back, device_id } = parse.data

    const userId = (req as any).user?.id || null
    if (!userId && !device_id) {
        return res.status(400).json({ error: 'device_id is required when not logged in' })
    }

// todo: check Idor
    try {
        const result = await services.cards.edit({
            userId,
            deviceId: device_id,
            cardId: req.params.id,
            front,
            back
        })
        return res.json(result) // { cardId, content_version }
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Failed to edit card' })
    }
}

async function search(req: Request, res: Response) {
    const parse = searchCardSchema.safeParse(req.body)
    if (!parse.success) {
        const msg = parse.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { q } = parse.data

    try {
        const result = await services.search.searchSimilarCards(q)
        return res.json(result) // { cardId }
    } catch (err: any) {
        // Avoid leaking internals
        return res.status(500).json({ error: err.message || 'Failed to search cards' })
    }
}

async function list(req: Request, res: Response) {
    const parsed = listCardsQuerySchema.safeParse(req.query)
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ')
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
    edit,
    list,
    search
}