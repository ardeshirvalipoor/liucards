"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = require("../configs");
const base_1 = require("../base");
exports.default = base_1.base.services.mongodb(configs_1.default.db.MONGODB_URI, configs_1.default.db.DB_NAME);
