import type { Request, Response } from 'express';
import services from '../../services';
import { checkSavedParamsSchema } from '../../schemas/saved-card';

export default async function checkSavedHandler(req: Request, res: Response) {
    const user_id = req.user?.id || null;
    const device_id = req.user?.device_id || null;

    const parsed = checkSavedParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }

    try {
        const result = await services.savedCards.check({
            userId: user_id,
            deviceId: device_id,
            cardId: parsed.data.id
        });

        return res.json({ 
            card_id: parsed.data.id,
            is_saved: result.is_saved,
            follow_updates: result.follow_updates,
            source_version: result.source_version,
            current_version: result.current_version,
            has_updates: result.has_updates
        });
    } catch (err: any) {
        console.error('Check saved status failed:', err);
        return res.status(500).json({
            error: 'Failed to check saved status'
        });
    }
}