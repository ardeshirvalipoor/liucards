

export interface SaveCardParams {
    userId: string | null;
    deviceId?: string | null;
    cardId: string;
    followUpdates?: boolean;
}

export interface SaveCardResponse {
    saved_card_id: string;
    source_kind: 'self' | 'channel' | 'community';
    source_version: number;
    current_version: number;
    follow_updates: boolean;
    is_new: boolean;
}

export interface UnsaveCardParams {
    userId: string | null;
    deviceId?: string | null;
    cardId: string;
}

export interface CheckSavedParams {
    userId: string | null;
    deviceId?: string | null;
    cardId: string;
}

export interface CheckSavedResponse {
    is_saved: boolean;
    follow_updates?: boolean;
    source_version?: number;
    current_version?: number;
    has_updates?: boolean;
}

export interface BulkCheckResponse {
    [cardId: string]: {
        is_saved: boolean;
        follow_updates: boolean;
        has_updates: boolean;
    };
}

export interface ToggleFollowParams {
    userId: string | null;
    deviceId?: string | null;
    cardId: string;
    followUpdates: boolean;
}

export interface ToggleFollowResponse {
    saved_card_id: string;
    follow_updates: boolean;
}