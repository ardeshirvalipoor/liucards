"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReviewBodySchema = exports.getQueueQuerySchema = void 0;
const zod_1 = require("zod");
exports.getQueueQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().min(1).max(200).default(50),
    include_new: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false')])
        .optional()
        .transform(v => v === 'true'),
});
exports.submitReviewBodySchema = zod_1.z.object({
    saved_card_id: zod_1.z.uuid(),
    rating: zod_1.z.number().int().min(0).max(3), // 0 again, 1 hard, 2 good, 3 easy
    duration_ms: zod_1.z.number().int().min(0).optional(), // optional UX metric
    client_reviewed_at: zod_1.z.iso.datetime().optional(),
    // Optional signals for future ML (all optional)
    correct: zod_1.z.boolean().optional(),
    confidence: zod_1.z.number().int().min(0).max(3).optional(),
    think_time_ms: zod_1.z.number().int().min(0).optional(),
    hint_count: zod_1.z.number().int().min(0).optional(),
    revealed_back: zod_1.z.boolean().optional(),
    session_id: zod_1.z.uuid().optional(),
    answer_text: zod_1.z.string().max(2000).optional(),
});
