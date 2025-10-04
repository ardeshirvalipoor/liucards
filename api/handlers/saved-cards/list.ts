import type { Request, Response } from 'express';
import services from '../../services';
import { saveCardBodySchema } from '../../schemas/saved-card';

export default async function saveCardHandler(req: Request, res: Response) {
    const user_id = req.user?.id || null;
    const device_id = req.user?.device_id || null;
    
    // Parse and validate request body
    const parsed = saveCardBodySchema.safeParse(req.body);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }

    try {
        const result = await services.savedCards.save({
            userId: user_id,
            deviceId: device_id,
            cardId: parsed.data.card_id,
            followUpdates: parsed.data.follow_updates
        });

        return res.status(201).json({
            saved_card_id: result.saved_card_id,
            source_kind: result.source_kind,
            source_version: result.source_version,
            message: 'Card saved successfully'
        });
    } catch (err: any) {
        console.error('Save card failed:', err);

        // Handle specific error cases
        if (err.message === 'Card not found') {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        if (err.message === 'Cannot save private card you do not own') {
            return res.status(403).json({ error: 'Cannot save private card you do not own' });
        }

        if (err.message === 'Either user_id or device_id is required') {
            return res.status(400).json({ error: 'Authentication required' });
        }

        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: 'Card already saved' });
        }

        return res.status(500).json({
            error: err.message || 'Failed to save card'
        });
    }
}