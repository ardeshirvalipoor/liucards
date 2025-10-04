import { supabaseAdmin } from '../../configs/supabase'
import { ListCardsParams, SavedCardRow } from '../../interfaces/card'

export default async function listCards(params: ListCardsParams) {
    const { 
        user_id, 
        device_id, 
        limit, 
        before, 
        dueOnly = false,
        includeArchived = false 
    } = params


    if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100')
    }

    try {
        let query = supabaseAdmin
            .from('saved_cards')
            .select(`
                id,
                card_id,
                state,
                interval_days,
                ease,
                stability,
                difficulty,
                reps,
                lapses,
                due_at,
                last_reviewed_at,
                updated_at,
                source_kind,
                source_version,
                user_id,
                device_id,
                cards!inner (
                    id,
                    front,
                    back,
                    created_at,
                    updated_at,
                    content_version,
                    front_audio_url,
                    back_audio_url,
                    visibility,
                    user_id,
                    device_id,
                    deleted_at
                )
            `)

        if (user_id) {
            query = query.eq('user_id', user_id)
        } else if (device_id) {
            query = query.eq('device_id', device_id)
        }

        if (!includeArchived) {
            query = query.is('cards.deleted_at', null)
        }

        if (dueOnly) {
            const now = new Date().toISOString()
            query = query.lte('due_at', now)
        }

        if (before) {
            const [timestamp, cursorId] = before.split(',')
            if (cursorId) {
                query = query.or(`updated_at.lt.${timestamp},and(updated_at.eq.${timestamp},id.lt.${cursorId})`)
            } else {
                query = query.lt('updated_at', timestamp)
            }
        }

        query = query
            .order('updated_at', { ascending: false })
            .order('id', { ascending: false })  // Secondary sort for consistency
            .limit(limit)

        const { data, error } = await query

        if (error) {
            console.error('Failed to fetch cards:', error)
            throw new Error(`Failed to fetch cards: ${error.message}`)
        }


        const mappedCards = (data ?? []).map(row => {
            const typedRow = {...row, cards: Array.isArray(row.cards) ? row.cards[0] : row.cards} as SavedCardRow
            return mapSavedCard(typedRow, user_id, device_id)
        })

        const lastCard = mappedCards[mappedCards.length - 1]
        const nextCursor = lastCard ? `${lastCard.updated_at},${lastCard.saved_card_id}` : null

        return {
            cards: mappedCards,
            nextCursor,
            hasMore: mappedCards.length === limit
        }

    } catch (error: any) {
        console.error('List cards error:', error)
        throw new Error(error.message || 'Failed to list cards')
    }
}

function mapSavedCard(row: SavedCardRow, user_id: string | null, deviceId: string | null) {
    const card = row.cards
    const isOwner = (card.user_id === user_id) || (card.device_id === deviceId)
    
    return {
        // Saved card metadata
        saved_card_id: row.id,
        card_id: row.card_id,
        
        // Card content
        front: card.front,
        back: card.back,
        front_audio_url: card.front_audio_url,
        back_audio_url: card.back_audio_url,
        
        // Learning state
        state: row.state,
        due_at: row.due_at,
        last_reviewed_at: row.last_reviewed_at,
        
        // Metadata
        updated_at: row.updated_at,
        source_kind: row.source_kind,
        source_version: row.source_version,
        current_version: card.content_version,
        has_updates: row.source_version < card.content_version,
        
        // Ownership info
        is_owner: isOwner,
        visibility: card.visibility,
        
        // User context
        user_id: row.user_id,
        device_id: row.device_id
    }
}