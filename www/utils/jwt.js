"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const configs_1 = require("../configs");
exports.default = {
    generateToken(user) {
        return jwt.sign(user, configs_1.default.jwt.SECRET, {
            expiresIn: 10080
        });
    }
};
