
import type { Request, Response } from 'express'
import services from '../../services'
import { createCardBodySchema } from '../../schemas/card'

export default async function (req: Request, res: Response) {
    const user_id = req.user?.id || null
    const device_id = req.user?.device_id || null
    const parsed = createCardBodySchema.safeParse(req.body)
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    try {
        const result = await services.cards.create({ ...parsed.data, user_id, device_id })
        return res.json(result)
    } catch (err: any) {
        console.error('Card creation failed:', err)

        if (err.code === 'RATE_LIMIT') {
            return res.status(429).json({
                error: 'Too many cards created. Please try again later.'
            })
        }
        if (err.code === 'INVALID_CHANNEL') {
            return res.status(400).json({
                error: 'Invalid channel specified'
            })
        }

        return res.status(500).json({
            error: err.message || 'Failed to create card'
        })
    }
}
