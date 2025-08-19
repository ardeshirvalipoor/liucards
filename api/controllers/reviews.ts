import type { Request, Response } from 'express'
import services from '../services'
import { getQueueQuerySchema, submitReviewBodySchema } from '../schemas/review'

async function getQueue(req: Request, res: Response) {
	const userId = (req as any).user?.id

	const parsed = getQueueQuerySchema.safeParse(req.query)
	if (!parsed.success) return res.status(400).json({ error: 'Invalid query' })

	const { limit, device_id } = parsed.data

	let identifier: string
	let isDeviceId = false

	if (userId) {
		identifier = userId
	} else {
		if (!device_id) return res.status(401).json({ error: 'Device ID or login required' })
		identifier = device_id
		isDeviceId = true
	}

	try {
		const queue = await services.reviews.getQueue(identifier, limit, isDeviceId)
		res.json({ queue, count: queue.length })
	} catch (e: any) {
		res.status(500).json({ error: e.message || 'Failed to load queue' })
	}
}

async function post(req: Request, res: Response) {
	const userId = (req as any).user?.id

	const parsed = submitReviewBodySchema.safeParse(req.body)
	if (!parsed.success) {
		const msg = parsed.error.issues.map(e => e.message).join(', ')
		return res.status(400).json({ error: msg })
	}

	let identifier: string
	let isDeviceId = false

	if (userId) {
		identifier = userId
	} else {
		const device_id = parsed.data.device_id
		if (!device_id) return res.status(401).json({ error: 'Device ID or login required' })
		identifier = device_id
		isDeviceId = true
	}

	try {
		const next = await services.reviews.submit(identifier, parsed.data, isDeviceId)
		res.json({ ok: true, next })
	} catch (e: any) {
		res.status(500).json({ error: e.message || 'Review failed' })
	}
}

export default {
	getQueue,
	post
}