"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = (key, value = '', options = {}) => {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }
    console.log(key, value);
};
exports.default = {
    log
};
