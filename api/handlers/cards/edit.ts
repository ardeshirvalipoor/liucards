import type { Request, Response } from 'express'
import services from '../../services'
import { createCardBodySchema, editCardBodySchema, listCardsQuerySchema, searchCardSchema } from '../../schemas/card'


export default async function (req: Request, res: Response) {
    const user_id = req.user?.id || null
    const device_id = req.user?.device_id || null
    const parsed = editCardBodySchema.safeParse(req.body)
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ')
        return res.status(400).json({ error: msg })
    }
    // todo: check Idor
    // todo: check parsed.data.id matches req.params.id
    
    if (parsed.data.id !== req.params.id) {
        return res.status(400).json({ 
            error: 'Card ID mismatch in request' 
        })
    }
    try {
        const result = await services.cards.edit({ ...parsed.data, user_id, device_id, id: req.params.id })
        return res.json(result) // { cardId, content_version }
    } catch (err: any) {
        console.error('Card edit failed:', err)
        
        // Return more specific error messages based on error type
        if (err.code === 'CARD_NOT_FOUND') {
            return res.status(404).json({ error: 'Card not found' })
        }
        if (err.code === 'CONCURRENT_EDIT') {
            return res.status(409).json({ 
                error: 'Card was modified by another user. Please refresh and try again.' 
            })
        }
        
        return res.status(500).json({ 
            error: err.message || 'Failed to edit card' 
        })
    }
}
