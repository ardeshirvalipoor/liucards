import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../configs/supabase'

// Strict: 401 if missing/invalid token
async function required(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization || ''
	const m = auth.match(/^Bearer\s+(.+)$/i)
	if (!m) return res.status(401).json({ error: 'Missing Bearer token' })

	const token = m[1]
	const { data, error } = await supabaseAdmin.auth.getUser(token)
	if (error || !data?.user) {
		return res.status(401).json({ error: 'Invalid token' })
	}
	(req as any).user = data.user
	next()
}

// Lenient: attaches req.user if token is valid; continues otherwise
async function optional(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization || ''
	const m = auth.match(/^Bearer\s+(.+)$/i)
	if (!m) return next()
	const token = m[1]
	const { data } = await supabaseAdmin.auth.getUser(token)
	console.log('in optional', data, token);

	if (data?.user) (req as any).user = data.user
	next()
}

export default {
	required,
	optional
}