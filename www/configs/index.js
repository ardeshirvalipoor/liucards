"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const jwt_1 = require("./jwt");
exports.default = {
    db: db_1.default,
    jwt: jwt_1.default,
};
