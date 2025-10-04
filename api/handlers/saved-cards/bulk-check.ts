import type { Request, Response } from 'express';
import services from '../../services';
import { bulkCheckSavedBodySchema } from '../../schemas/saved-card';

export default async function bulkCheckSavedHandler(req: Request, res: Response) {
    const user_id = req.user?.id || null;
    const device_id = req.user?.device_id || null;

    const parsed = bulkCheckSavedBodySchema.safeParse(req.body);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }

    try {
        const result = await services.savedCards.bulkCheckSaved({
            userId: user_id,
            deviceId: device_id,
            cardIds: parsed.data.card_ids
        });

        return res.json({ 
            saved_cards: result
        });
    } catch (err: any) {
        console.error('Bulk check saved status failed:', err);
        return res.status(500).json({
            error: 'Failed to bulk check saved status'
        });
    }
}