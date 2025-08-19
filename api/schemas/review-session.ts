import { z } from 'zod'

export const startSessionBodySchema = z.object({
	device_type: z.string().min(1),  // e.g., 'web', 'ios'
	device_id: z.string().optional(),  // For anonymous
})

export type StartSessionBody = z.infer<typeof startSessionBodySchema>

export const endSessionBodySchema = z.object({
	session_id: z.uuid(),
	cards_studied: z.number().int().min(0),
	cards_correct: z.number().int().min(0),
	total_time_ms: z.number().int().min(0).optional(),
	device_id: z.string().optional(),  // For anonymous
})

export type EndSessionBody = z.infer<typeof endSessionBodySchema>