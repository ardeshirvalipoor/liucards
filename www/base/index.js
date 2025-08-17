"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const services_1 = require("./services");
const utils_1 = require("./utils");
const middlewares_1 = require("./middlewares");
// import interfaces from './interfaces'
// import helpers from './helpers'
// import types from './types'
exports.base = {
    services: services_1.default,
    middlewares: middlewares_1.default,
    utils: utils_1.default,
};
