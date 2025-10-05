import type { Request, Response } from 'express'
import services from '../../services'

export default async function (req: Request, res: Response) {
    const user_id = req.user?.id || null
    const device_id = req.user?.device_id || null
    const cardId = req.params.id

    console.log('Remove card request:', { user_id, device_id, cardId });
    
    if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' })
    }

    try {
        const result = await services.cards.edit({
            id: cardId,
            user_id,
            device_id,
            deleted_at: new Date().toISOString(),
        })
        
        return res.json({ 
            message: 'Card removed successfully',
            id: result.id 
        })
    } catch (err: any) {
        console.error('Card removal failed:', err)
        
        if (err.code === 'NOT_FOUND_OR_UNAUTHORIZED') {
            return res.status(404).json({ 
                error: 'Card not found or unauthorized' 
            })
        }
        
        return res.status(500).json({ 
            error: err.message || 'Failed to remove card' 
        })
    }
}