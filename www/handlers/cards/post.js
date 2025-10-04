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
exports.default = default_1;
const services_1 = require("../../services");
const card_1 = require("../../schemas/card");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user_id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const device_id = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null;
        const parsed = card_1.createCardBodySchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        try {
            const result = yield services_1.default.cards.create(Object.assign(Object.assign({}, parsed.data), { user_id, device_id }));
            return res.json(result);
        }
        catch (err) {
            console.error('Card creation failed:', err);
            if (err.code === 'RATE_LIMIT') {
                return res.status(429).json({
                    error: 'Too many cards created. Please try again later.'
                });
            }
            if (err.code === 'INVALID_CHANNEL') {
                return res.status(400).json({
                    error: 'Invalid channel specified'
                });
            }
            return res.status(500).json({
                error: err.message || 'Failed to create card'
            });
        }
    });
}
