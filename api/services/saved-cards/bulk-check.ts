import { supabaseAdmin } from "../../configs/supabase";
import { BulkCheckResponse } from "../../interfaces/saved-cards";
import helpers from "./helpers";

export default async function bulkCheckSaved(params: {
    userId: string | null;
    deviceId?: string | null;
    cardIds: string[];
}): Promise<BulkCheckResponse> {
    const { userId, deviceId, cardIds } = params;

    if (!cardIds.length || (!userId && !deviceId)) {
        return {};
    }

    try {
        const auth = helpers.getAuthFilter(userId, deviceId);
        
        const { data, error } = await supabaseAdmin
            .from('saved_cards')
            .select(`
                card_id,
                follow_updates,
                source_version,
                cards!inner (
                    content_version
                )
            `)
            .in('card_id', cardIds)
            .eq(auth.column, auth.value);

        if (error) {
            console.error('Error bulk checking saved status:', error);
            return {};
        }

        // Build response
        const result: BulkCheckResponse = {};
        
        // Initialize all as not saved
        cardIds.forEach(id => {
            result[id] = {
                is_saved: false,
                follow_updates: false,
                has_updates: false
            };
        });

        // Update with saved cards
        (data || []).forEach(row => {
            result[row.card_id] = {
                is_saved: true,
                follow_updates: row.follow_updates,
                has_updates: row.source_version < row.cards?.[0]?.content_version
            };
        });

        return result;
    } catch (error) {
        console.error('Error bulk checking saved status:', error);
        return {};
    }
}