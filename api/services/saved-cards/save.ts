import { supabaseAdmin } from "../../configs/supabase";
import { SaveCardParams, SaveCardResponse } from "../../interfaces/saved-cards";
import helpers from "./helpers";

export default async function (params: SaveCardParams): Promise<SaveCardResponse> {
    const { userId, deviceId, cardId, followUpdates = false } = params;

    // Validation
    if (!cardId) {
        throw new Error('Card ID is required');
    }

    try {
        // Fetch card details
        const { data: card, error: cardError } = await supabaseAdmin
            .from('cards')
            .select('id, content_version, user_id, device_id, channel_id, visibility')
            .eq('id', cardId)
            .single();

        if (cardError || !card) {
            console.error('Card fetch error:', cardError);
            throw new Error('Card not found');
        }

        // Check permissions
        // checkCardAccess(card, userId, deviceId);

        // Determine source kind
        const source_kind = helpers.determineSourceKind(card, userId, deviceId);

        // Check if already exists
        const auth = helpers.getAuthFilter(userId, deviceId);
        let existingQuery = supabaseAdmin
            .from('saved_cards')
            .select('id')
            .eq('card_id', cardId)
            .eq(auth.column, auth.value);

        const { data: existing } = await existingQuery.single();
        const isNew = !existing;

        // Prepare saved card data
        const savedCardData = {
            user_id: userId,
            device_id: userId ? null : deviceId,
            card_id: cardId,
            source_kind,
            source_version: card.content_version,
            follow_updates: followUpdates || (source_kind === 'channel')
        };

        // Upsert
        const onConflictColumns = userId ? 'user_id,card_id' : 'device_id,card_id';

        const { data: savedCard, error: upsertError } = await supabaseAdmin
            .from('saved_cards')
            .upsert(
                savedCardData,
                {
                    onConflict: onConflictColumns,
                    ignoreDuplicates: false
                }
            )
            .select('id, source_kind, source_version, follow_updates')
            .single();

        if (upsertError) {
            console.error('Upsert error:', upsertError);
            throw upsertError;
        }

        return {
            saved_card_id: savedCard.id,
            source_kind: savedCard.source_kind as 'self' | 'channel' | 'community',
            source_version: savedCard.source_version,
            current_version: card.content_version,
            follow_updates: savedCard.follow_updates,
            is_new: isNew
        };

    } catch (error: any) {
        console.error('Save card operation failed:', error);
        throw error;
    }
}