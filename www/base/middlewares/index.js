"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("./authenticate");
const authorize_1 = require("./authorize");
exports.default = {
    authorize: authorize_1.default,
    authenticate: authenticate_1.default,
};
