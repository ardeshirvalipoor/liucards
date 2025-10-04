import type { Request, Response } from 'express';
import { unsaveCardParamsSchema } from '../../schemas/saved-card';
import services from '../../services';

export default async function (req: Request, res: Response) {
    const user_id = req.user?.id || null;
    const device_id = req.user?.device_id || null;
    
    // Validate params
    const parsed = unsaveCardParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }

    try {
        const result = await services.savedCards.unsave({
            userId: user_id,
            deviceId: device_id,
            cardId: parsed.data.id
        });

        return res.status(200).json({
            message: 'Card unsaved successfully',
            removed: result.removed
        });
    } catch (err: any) {
        console.error('Unsave card failed:', err);

        if (err.message === 'Saved card not found') {
            return res.status(404).json({ error: 'Saved card not found' });
        }

        return res.status(500).json({
            error: err.message || 'Failed to unsave card'
        });
    }
}
