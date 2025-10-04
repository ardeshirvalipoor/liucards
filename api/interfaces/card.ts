export interface CardPayload {
    front: string
    back: string
    front_audio_url?: string
    back_audio_url?: string
    client_created_at?: string
    channel_id?: string
}

export interface CreateCardPayload extends CardPayload {
    user_id: string | null
    device_id?: string
}

export interface EditCardPayload extends CreateCardPayload {
    id: string
}

export interface ListCardsParams {
    user_id: string | null
    device_id?: string
    limit: number
    before?: string  // Consider using { timestamp: string, id: string } for compound cursor
    source?: 'all' | 'self' | 'channel'
    dueOnly?: boolean
    includeArchived?: boolean
}

export interface SavedCardRow {
    id: string
    card_id: string
    state: string
    interval_days: number
    ease: number
    stability: number
    difficulty: number
    reps: number
    lapses: number
    due_at: string
    last_reviewed_at: string | null
    updated_at: string
    source_kind: string
    source_version: number
    user_id: string | null
    device_id: string | null
    cards: {
        id: string
        front: string
        back: string
        created_at: string
        updated_at: string
        content_version: number
        front_audio_url: string | null
        back_audio_url: string | null
        visibility: 'public' | 'private'
        user_id: string | null
        device_id: string | null
        deleted_at: string | null  // Soft delete support
    }
}