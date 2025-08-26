"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../schemas/card");
const services_1 = require("../services");
function post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const parse = card_1.createCardBodySchema.safeParse(req.body);
        if (!parse.success) {
            const msg = parse.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        const { front, back, device_id, client_created_at } = parse.data;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        if (!userId && !device_id) {
            return res.status(400).json({ error: 'device_id is required when not logged in' });
        }
        try {
            const result = yield services_1.default.cards.create({
                userId,
                front,
                back,
                deviceId: device_id,
                clientCreatedAt: client_created_at
            });
            return res.json(result); // { cardId }
        }
        catch (err) {
            // Avoid leaking internals
            return res.status(500).json({ error: err.message || 'Failed to create card' });
        }
    });
}
function search(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const parse = card_1.searchCardSchema.safeParse(req.body);
        if (!parse.success) {
            const msg = parse.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        const { q } = parse.data;
        // const userId = (req as any).user?.id || null
        // if (!userId && !device_id) {
        //     return res.status(400).json({ error: 'device_id is required when not logged in' })
        // }
        try {
            const result = yield services_1.default.search.searchSimilarCards(q);
            return res.json(result); // { cardId }
        }
        catch (err) {
            // Avoid leaking internals
            return res.status(500).json({ error: err.message || 'Failed to create card' });
        }
    });
}
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const parsed = card_1.listCardsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        const { limit, before, q, device_id, source, due_only } = parsed.data;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        if (!userId && !device_id) {
            return res.status(400).json({ error: 'device_id is required when not logged in' });
        }
        try {
            const rows = yield services_1.default.cards.list({
                userId,
                deviceId: device_id,
                limit,
                before,
                q,
                source,
                dueOnly: due_only !== null && due_only !== void 0 ? due_only : false
            });
            res.json({ items: rows, count: rows.length });
        }
        catch (e) {
            res.status(500).json({ error: e.message || 'Failed to load cards' });
        }
    });
}
exports.default = {
    post,
    list,
    search
};
