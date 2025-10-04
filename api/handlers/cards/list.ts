import { listCardsQuerySchema } from "../../schemas/card"
import type { Request, Response } from 'express'
import services from "../../services"


export default async function list(req: Request, res: Response) {
    const parsed = listCardsQuerySchema.safeParse(req.query)
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { limit, before, source, due_only } = parsed.data

    console.log('req.user', req.user);
    
    try {
        const rows = await services.cards.list({
            user_id: req.user?.id || null,
            device_id: req.user?.device_id || null,
            limit,
            before,
            source,
            dueOnly: due_only ?? false
        })
        res.json({ items: rows, count: rows.cards.length })
    } catch (e: any) {
        res.status(500).json({ error: e.message || 'Failed to load cards' })
    }
}
