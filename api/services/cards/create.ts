import { supabaseAdmin } from '../../configs/supabase'
import { CreateCardPayload } from '../../interfaces/card'
import log from './log'
import recentCount from './recent-count'
import validateChannel from './validate-channel'

export default async function (payload: CreateCardPayload) {

    const identifier = payload.user_id || payload.device_id
    const recentCards = await recentCount(identifier)
    if (recentCards > 10) { // Adjust limit as needed
        const error: any = new Error('Rate limit exceeded')
        error.code = 'RATE_LIMIT'
        throw error
    }

    const channel_id = payload.channel_id || null  // Temporary, later from payload or user profile
    // if (channel_id) {
    //     const isValidChannel = await validateChannel(channel_id, payload.user_id)
    //     if (!isValidChannel) {
    //         const error: any = new Error('Invalid or inaccessible channel')
    //         error.code = 'INVALID_CHANNEL'
    //         throw error
    //     }
    // }

    const insertPayload: any = {
        ...payload,
        device_id: payload.user_id ? null : payload.device_id,
        channel_id,
        visibility: channel_id ? 'public' : 'private', // later add premium, etc
    }
    Object.keys(insertPayload).forEach(key =>
        insertPayload[key] === undefined && delete insertPayload[key]
    )

    const { data, error } = await supabaseAdmin
        .from('cards')
        .insert(insertPayload)
        .select('id, content_version, created_at')
        .single()

    if (error) {
        console.error('Error creating card:', error)
        // Handle specific Supabase errors
        if (error.code === '23505') { // Unique violation
            throw new Error('Duplicate card detected')
        }
        if (error.code === '23503') { // Foreign key violation
            throw new Error('Invalid reference in card data')
        }
        throw new Error(error.message)
    }

    await log({
        event_type: 'card_created',
        card_id: data.id,
        user_id: payload.user_id,
        device_id: payload.device_id,
        channel_id
    })
    
    return {
        id: data.id,
        content_version: data.content_version,
        created_at: data.created_at
    }
}