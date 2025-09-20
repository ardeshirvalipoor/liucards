import type { Request, Response } from 'express'
import services from '../services'
import { endSessionBodySchema, startSessionBodySchema } from '../schemas/review-session';

async function start(req: Request, res: Response) {
	const userId = (req as any).user?.id;

	const parsed = startSessionBodySchema.safeParse(req.body);
	if (!parsed.success) {
		const msg = parsed.error.issues.map(e => e.message).join(', ');
		return res.status(400).json({ error: msg });
	}

	let identifier: string;
	let isDeviceId = false;

	if (userId) {
		identifier = userId;
	} else {
		const device_id = parsed.data.device_id;
		if (!device_id) return res.status(401).json({ error: 'Device ID or login required' });
		identifier = device_id;
		isDeviceId = true;
	}

	try {
		const sessionId = await services.studySessions.startSession(identifier, parsed.data.device_type, isDeviceId);
		res.json({ session_id: sessionId });
	} catch (e: any) {
		res.status(500).json({ error: e.message || 'Failed to start session' });
	}
}

async function end(req: Request, res: Response) {
	const userId = (req as any).user?.id;

	const parsed = endSessionBodySchema.safeParse(req.body);
	if (!parsed.success) {
		const msg = parsed.error.issues.map(e => e.message).join(', ');
		return res.status(400).json({ error: msg });
	}

	let identifier: string;
	let isDeviceId = false;

	if (userId) {
		identifier = userId;
	} else {
		const device_id = parsed.data.device_id;
		if (!device_id) return res.status(401).json({ error: 'Device ID or login required' });
		identifier = device_id;
		isDeviceId = true;
	}

	try {
		await services.studySessions.endSession(identifier, parsed.data, isDeviceId);
		res.json({ ok: true });
	} catch (e: any) {
		res.status(500).json({ error: e.message || 'Failed to end session' });
	}
}

export default {
	start,
	end
}