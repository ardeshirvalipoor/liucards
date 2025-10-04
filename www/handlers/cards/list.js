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
exports.default = list;
const card_1 = require("../../schemas/card");
const services_1 = require("../../services");
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const parsed = card_1.listCardsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        const { limit, before, source, due_only } = parsed.data;
        console.log('req.user', req.user);
        try {
            const rows = yield services_1.default.cards.list({
                user_id: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null,
                device_id: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null,
                limit,
                before,
                source,
                dueOnly: due_only !== null && due_only !== void 0 ? due_only : false
            });
            res.json({ items: rows, count: rows.cards.length });
        }
        catch (e) {
            res.status(500).json({ error: e.message || 'Failed to load cards' });
        }
    });
}
