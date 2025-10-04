import { z } from 'zod';

export const saveCardBodySchema = z.object({
    card_id: z.uuid({ message: 'Invalid card_id format, must be a UUID' }),
    follow_updates: z.boolean().optional().default(false),
});

export type SaveCardBody = z.infer<typeof saveCardBodySchema>;

export const unsaveCardParamsSchema = z.object({
    id: z.uuid({ message: 'Invalid card_id format, must be a UUID' })
});

export type UnsaveCardParams = z.infer<typeof unsaveCardParamsSchema>;

export const checkSavedParamsSchema = z.object({
    id: z.uuid({ message: 'Invalid card_id format, must be a UUID' })
});

export type CheckSavedParams = z.infer<typeof checkSavedParamsSchema>;

export const bulkCheckSavedBodySchema = z.object({
    card_ids: z.array(z.uuid()).min(1).max(100, 'Maximum 100 cards per request')
});

export type BulkCheckSavedBody = z.infer<typeof bulkCheckSavedBodySchema>;

export const toggleFollowUpdatesBodySchema = z.object({
    card_id: z.uuid({ message: 'Invalid card_id format, must be a UUID' }),
    follow_updates: z.boolean()
});

export type ToggleFollowUpdatesBody = z.infer<typeof toggleFollowUpdatesBodySchema>;
