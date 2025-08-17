import { z } from 'zod'

export const getQueueQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(200).default(50),
	include_new: z
		.union([z.literal('true'), z.literal('false')])
		.optional()
		.transform(v => v === 'true'),
})

export type GetQueueQuery = z.infer<typeof getQueueQuerySchema>

export const submitReviewBodySchema = z.object({
	saved_card_id: z.uuid(),
	rating: z.number().int().min(0).max(3),           // 0 again, 1 hard, 2 good, 3 easy
	duration_ms: z.number().int().min(0).optional(),  // optional UX metric
	client_reviewed_at: z.iso.datetime().optional(),

	// Optional signals for future ML (all optional)
	correct: z.boolean().optional(),
	confidence: z.number().int().min(0).max(3).optional(),
	think_time_ms: z.number().int().min(0).optional(),
	hint_count: z.number().int().min(0).optional(),
	revealed_back: z.boolean().optional(),
	session_id: z.uuid().optional(),
	answer_text: z.string().max(2000).optional(),
})
export type SubmitReviewBody = z.infer<typeof submitReviewBodySchema>
