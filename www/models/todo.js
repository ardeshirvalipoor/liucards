"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function todo(title) {
    return {
        title: title,
        isDone: false,
        at: new Date().toISOString()
    };
}
exports.default = {
    todo
};
