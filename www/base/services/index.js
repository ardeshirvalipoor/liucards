"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const mongodb_1 = require("./mongodb");
exports.default = {
    auth: auth_1.default,
    mongodb: mongodb_1.default
};
