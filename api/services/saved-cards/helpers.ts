
const getAuthFilter = (userId: string | null, deviceId?: string | null) => {
    if (userId) {
        return { column: 'user_id', value: userId }
    }
    return { column: 'device_id', value: deviceId }
}

const determineSourceKind = (
    card: any, 
    userId: string | null, 
    deviceId?: string | null
): 'self' | 'channel' | 'community' => {
    if (card.channel_id) {
        return 'channel'
    }
    if ((card.user_id === userId) || (card.device_id === deviceId)) {
        return 'self';
    }
    return 'community'
}

const checkCardAccess = (
    card: any,
    userId: string | null,
    deviceId?: string | null
): void => {
    const isOwner = (card.user_id === userId) || (card.device_id === deviceId);
    const isPublic = card.visibility === 'public'
    const isFromChannel = !!card.channel_id
    
    if (!isOwner && !isPublic && !isFromChannel) {
        throw new Error('Cannot save private card you do not own');
    }
}

export default {
    getAuthFilter,
    determineSourceKind,
    checkCardAccess
}