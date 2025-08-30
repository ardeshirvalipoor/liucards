import { z } from 'zod';

export const createCardBodySchema = z.object({
	front: z.string({ error: 'Invalid or missing front format' }).min(1, 'front is required').max(10000),
	back: z.string({ error: 'Invalid or missing back format' }).min(1, 'back is required').max(10000),
	front_audio_url: z.any().optional(),
	back_audio_url: z.any().optional(),
	device_id: z.uuid().optional(),              // top-level; stricter, or use z.guid() if you need leniency
	client_created_at: z.iso.datetime({ error: 'Invalid or missing client_created_at format' }),           // top-level datetime validator
});

export type CreateCardBody = z.infer<typeof createCardBodySchema>;


export const editCardBodySchema = z.object({
	front: z.string({ message: 'Invalid or missing front format' }).min(1, { message: 'front is required' }).max(10000, { message: 'front exceeds maximum length of 10000' }),
	back: z.string({ message: 'Invalid or missing back format' }).min(1, { message: 'back is required' }).max(10000, { message: 'back exceeds maximum length of 10000' }),
	front_audio_url: z.string({ message: 'Invalid front_audio_url format' }).optional().or(z.literal('')),
	back_audio_url: z.string({ message: 'Invalid back_audio_url format' }).optional().or(z.literal('')),
	device_id: z.uuid({ message: 'Invalid device_id format, must be a UUID' }).optional(),
});

export type EditCardBody = z.infer<typeof editCardBodySchema>;

export const listCardsQuerySchema = z.object({
	// common
	limit: z.coerce.number().int().min(1).max(200).default(50),
	before: z.iso.datetime().optional(),      // pagination cursor (created_at or updated_at)
	q: z.string().max(200).optional(),             // simple text search on front/back (ILIKE)

	// when NOT logged in
	device_id: z.uuid().optional(),       // required if not logged in

	// logged-in only filters (optional)
	source: z.enum(['all', 'self', 'channel']).default('all'),
	due_only: z
		.union([z.literal('true'), z.literal('false')])
		.optional()
		.transform(v => v === 'true')
})

export type ListCardsQuery = z.infer<typeof listCardsQuerySchema>

export const searchCardSchema = z.object({
	q: z.string().min(1).max(200)
})

export type SearchCard = z.infer<typeof searchCardSchema>
