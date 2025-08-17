"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMongoStyle = convertToMongoStyle;
const mongodb_1 = require("mongodb");
function convertToMongoStyle(query) {
    Object.keys(query).forEach(key => {
        if (typeof query[key] === 'object') {
            convertToMongoStyle(query[key]);
        }
        if (['gte', 'lte', 'gt', 'lt', 'in', 'nin', 'ne'].includes(key)) {
            const newKey = '$' + key;
            query[newKey] = query[key];
            delete query[key];
        }
        if (key.endsWith('_id') && typeof query[key] === 'string' && query[key]) {
            query[key] = new mongodb_1.ObjectId(query[key]);
        }
    });
    return query;
}
