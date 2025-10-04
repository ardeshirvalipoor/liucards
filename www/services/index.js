"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = require("./cards");
const reviews_1 = require("./reviews");
const saved_cards_1 = require("./saved-cards");
const search_1 = require("./search");
const study_sessions_1 = require("./study-sessions");
exports.default = {
    cards: cards_1.default,
    reviews: reviews_1.default,
    studySessions: study_sessions_1.default,
    search: search_1.default,
    savedCards: saved_cards_1.default
};
