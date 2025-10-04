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
const card_1 = require("../../schemas/card");
const services_1 = require("../../services");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = card_1.searchCardSchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        const { q } = parsed.data;
        try {
            const result = yield services_1.default.search.searchSimilarCards(q);
            return res.json(result); // { cardId }
        }
        catch (err) {
            // Avoid leaking internals
            return res.status(500).json({ error: err.message || 'Failed to search cards' });
        }
    });
}
