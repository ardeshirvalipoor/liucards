import { fsrs, generatorParameters, Rating, State } from 'ts-fsrs'

/** Single FSRS instance with fuzzing enabled */
const params = generatorParameters({ enable_fuzz: true })
const F = fsrs(params)

/** Map our string state to FSRS State enum */
export function mapState(s: string | null | undefined): State {
	switch (s) {
		case 'learning': return State.Learning
		case 'review': return State.Review
		case 'relearning': return State.Relearning
		case 'new':
		default: return State.New
	}
}

/** Map 0..3 to FSRS Rating enum */
export function mapRating(r: 0 | 1 | 2 | 3): Rating {
	return [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy][r]
}

/** Convert saved_cards row to FSRS Card shape */
export function toFsrsCard(sc: {
	due_at: string
	stability: number | null
	difficulty: number | null
	interval_days: number
	reps: number
	lapses: number
	state: string
	last_reviewed_at: string | null
}) {
	return {
		due: new Date(sc.due_at),
		stability: sc.stability ?? 0,
		difficulty: sc.difficulty ?? 0,
		elapsed_days: Math.max(0, Math.floor((Date.now() - (sc.last_reviewed_at ? Date.parse(sc.last_reviewed_at) : Date.now())) / 86400000)),
		scheduled_days: sc.interval_days ?? 0,
		reps: sc.reps ?? 0,
		lapses: sc.lapses ?? 0,
		state: mapState(sc.state),
		last_review: sc.last_reviewed_at ? new Date(sc.last_reviewed_at) : undefined,
		learning_steps: []
	}
}

export function nextWithFsrs(scRow: any, rating: 0 | 1 | 2 | 3) {
	const card = toFsrsCard(scRow)
	const now = new Date()
	const rec = F.next(card, now, mapRating(rating))
	// rec.card has updated stability/difficulty/due/scheduled_days/reps/lapses/state
	return rec
}
