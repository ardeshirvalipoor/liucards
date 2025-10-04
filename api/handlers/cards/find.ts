import type { Request, Response } from 'express'
import { searchCardSchema } from "../../schemas/card"
import services from '../../services'

export default async function (req: Request, res: Response) {
    const parsed = searchCardSchema.safeParse(req.body)
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    const { q } = parsed.data

    try {
        const result = await services.search.searchSimilarCards(q)
        return res.json(result) // { cardId }
    } catch (err: any) {
        // Avoid leaking internals
        return res.status(500).json({ error: err.message || 'Failed to search cards' })
    }
}