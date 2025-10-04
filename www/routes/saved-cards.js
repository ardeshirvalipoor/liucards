"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlers_1 = require("../handlers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
router.post('/', middlewares_1.default.auth.requireUserOrDevice, handlers_1.default.savedCards.save);
router.delete('/:id', middlewares_1.default.auth.requireUserOrDevice, handlers_1.default.savedCards.unsave);
exports.default = router;
