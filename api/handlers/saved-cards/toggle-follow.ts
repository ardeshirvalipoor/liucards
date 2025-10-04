import type { Request, Response } from 'express';
import services from '../../services';
import { toggleFollowUpdatesBodySchema } from '../../schemas/saved-card';

export default async function toggleFollowUpdatesHandler(req: Request, res: Response) {
    const user_id = req.user?.id || null;
    const device_id = req.user?.device_id || null;

    const parsed = toggleFollowUpdatesBodySchema.safeParse(req.body);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }

    try {
        const result = await services.savedCards.toggleFollowUpdates({
            userId: user_id,
            deviceId: device_id,
            cardId: parsed.data.card_id,
            followUpdates: parsed.data.follow_updates
        });

        return res.json({ 
            saved_card_id: result.saved_card_id,
            follow_updates: result.follow_updates,
            message: `Follow updates ${result.follow_updates ? 'enabled' : 'disabled'}`
        });
    } catch (err: any) {
        console.error('Toggle follow updates failed:', err);
        
        if (err.message === 'Saved card not found') {
            return res.status(404).json({ error: 'Saved card not found' });
        }

        return res.status(500).json({
            error: 'Failed to toggle follow updates'
        });
    }
}