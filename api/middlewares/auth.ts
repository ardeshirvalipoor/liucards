import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../configs/supabase'
import { validate as isUuid } from "uuid"
import { User } from '@supabase/supabase-js';

declare module "express-serve-static-core" {
	interface Request {
		user: (User & { device_id?: string }) | { device_id?: string, id?: undefined }
	}
}
async function required(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization || ''
	const token = auth.match(/^Bearer\s+(.+)$/i)?.[1] || null
	if (!token) return res.status(401).json({ error: 'Missing Bearer token' })

	const { data, error } = await supabaseAdmin.auth.getUser(token)
	if (error || !data?.user) {
		return res.status(401).json({ error: 'Invalid token' })
	}
	req.user = data.user

	next()
}


export async function requireUserOrDevice(req: Request, res: Response, next: NextFunction) {
	try {

		const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
		if (token) {
			const { data } = await supabaseAdmin.auth.getUser(token)
			req.user = data.user
		}

		const deviceId = req.header('x-device-id')

		if (!req.user && !deviceId) {
			return res.status(400).json({ error: 'user id or x-device-id header is required' })
		}

		if (!req.user && deviceId && !isUuid(deviceId)) {
			return res.status(400).json({ error: 'Invalid x-device-id format' })
		}

		req.user = req.user || {}
		req.user.device_id = deviceId
		next()

	} catch (err) {
		console.error('requireUserOrDevice error:', err)
		return res.status(500).json({ error: 'Internal server error' })
	}
}


export default {
	required,
	requireUserOrDevice
}