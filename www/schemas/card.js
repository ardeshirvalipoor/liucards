"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCardSchema = exports.listCardsQuerySchema = exports.createCardBodySchema = void 0;
const zod_1 = require("zod");
exports.createCardBodySchema = zod_1.z.object({
    front: zod_1.z.string({ error: 'Invalid or missing front format' }).min(1, 'front is required').max(10000),
    back: zod_1.z.string({ error: 'Invalid or missing back format' }).min(1, 'back is required').max(10000),
    device_id: zod_1.z.uuid().optional(), // top-level; stricter, or use z.guid() if you need leniency
    client_created_at: zod_1.z.iso.datetime({ error: 'Invalid or missing client_created_at format' }), // top-level datetime validator
});
exports.listCardsQuerySchema = zod_1.z.object({
    // common
    limit: zod_1.z.coerce.number().int().min(1).max(200).default(50),
    before: zod_1.z.iso.datetime().optional(), // pagination cursor (created_at or updated_at)
    q: zod_1.z.string().max(200).optional(), // simple text search on front/back (ILIKE)
    // when NOT logged in
    device_id: zod_1.z.uuid().optional(), // required if not logged in
    // logged-in only filters (optional)
    source: zod_1.z.enum(['all', 'self', 'channel']).default('all'),
    due_only: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false')])
        .optional()
        .transform(v => v === 'true')
});
exports.searchCardSchema = zod_1.z.object({
    q: zod_1.z.string().min(1).max(200)
});
