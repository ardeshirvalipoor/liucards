"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapState = mapState;
exports.mapRating = mapRating;
exports.toFsrsCard = toFsrsCard;
exports.nextWithFsrs = nextWithFsrs;
const ts_fsrs_1 = require("ts-fsrs");
/** Single FSRS instance with fuzzing enabled */
const params = (0, ts_fsrs_1.generatorParameters)({ enable_fuzz: true });
const F = (0, ts_fsrs_1.fsrs)(params);
/** Map our string state to FSRS State enum */
function mapState(s) {
    switch (s) {
        case 'learning': return ts_fsrs_1.State.Learning;
        case 'review': return ts_fsrs_1.State.Review;
        case 'relearning': return ts_fsrs_1.State.Relearning;
        case 'new':
        default: return ts_fsrs_1.State.New;
    }
}
/** Map 0..3 to FSRS Rating enum */
function mapRating(r) {
    return [ts_fsrs_1.Rating.Again, ts_fsrs_1.Rating.Hard, ts_fsrs_1.Rating.Good, ts_fsrs_1.Rating.Easy][r];
}
/** Convert saved_cards row to FSRS Card shape */
function toFsrsCard(sc) {
    var _a, _b, _c, _d, _e;
    return {
        due: new Date(sc.due_at),
        stability: (_a = sc.stability) !== null && _a !== void 0 ? _a : 0,
        difficulty: (_b = sc.difficulty) !== null && _b !== void 0 ? _b : 0,
        elapsed_days: Math.max(0, Math.floor((Date.now() - (sc.last_reviewed_at ? Date.parse(sc.last_reviewed_at) : Date.now())) / 86400000)),
        scheduled_days: (_c = sc.interval_days) !== null && _c !== void 0 ? _c : 0,
        reps: (_d = sc.reps) !== null && _d !== void 0 ? _d : 0,
        lapses: (_e = sc.lapses) !== null && _e !== void 0 ? _e : 0,
        state: mapState(sc.state),
        last_review: sc.last_reviewed_at ? new Date(sc.last_reviewed_at) : undefined,
        learning_steps: []
    };
}
function nextWithFsrs(scRow, rating) {
    const card = toFsrsCard(scRow);
    const now = new Date();
    const rec = F.next(card, now, mapRating(rating));
    // rec.card has updated stability/difficulty/due/scheduled_days/reps/lapses/state
    return rec;
}
