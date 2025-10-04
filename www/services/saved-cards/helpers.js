"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAuthFilter = (userId, deviceId) => {
    if (userId) {
        return { column: 'user_id', value: userId };
    }
    return { column: 'device_id', value: deviceId };
};
const determineSourceKind = (card, userId, deviceId) => {
    if (card.channel_id) {
        return 'channel';
    }
    if ((card.user_id === userId) || (card.device_id === deviceId)) {
        return 'self';
    }
    return 'community';
};
const checkCardAccess = (card, userId, deviceId) => {
    const isOwner = (card.user_id === userId) || (card.device_id === deviceId);
    const isPublic = card.visibility === 'public';
    const isFromChannel = !!card.channel_id;
    if (!isOwner && !isPublic && !isFromChannel) {
        throw new Error('Cannot save private card you do not own');
    }
};
exports.default = {
    getAuthFilter,
    determineSourceKind,
    checkCardAccess
};
