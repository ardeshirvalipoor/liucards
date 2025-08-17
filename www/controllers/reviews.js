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
const services_1 = require("../services");
const review_1 = require("../schemas/review");
function getQueue(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Login required' });
        const parsed = review_1.getQueueQuerySchema.safeParse(req.query);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid query' });
        const { limit, include_new } = parsed.data;
        try {
            const queue = yield services_1.default.reviews.getQueue(userId, limit, include_new !== null && include_new !== void 0 ? include_new : true);
            res.json({ queue, count: queue.length });
        }
        catch (e) {
            res.status(500).json({ error: e.message || 'Failed to load queue' });
        }
    });
}
function post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Login required' });
        const parsed = review_1.submitReviewBodySchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        try {
            const next = yield services_1.default.reviews.submit(userId, parsed.data);
            res.json({ ok: true, next });
        }
        catch (e) {
            res.status(500).json({ error: e.message || 'Review failed' });
        }
    });
}
exports.default = {
    getQueue,
    post
};
