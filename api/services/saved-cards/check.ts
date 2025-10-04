import { supabaseAdmin } from "../../configs/supabase";
import { CheckSavedParams, CheckSavedResponse } from "../../interfaces/saved-cards";
import helpers from "./helpers";

export default async function (params: CheckSavedParams): Promise<CheckSavedResponse> {
    const { userId, deviceId, cardId } = params;

    try {
        if (!userId && !deviceId) {
            return { is_saved: false };
        }

        const auth = helpers.getAuthFilter(userId, deviceId);

        const { data, error } = await supabaseAdmin
            .from('saved_cards')
            .select(`
                id,
                follow_updates,
                source_version,
                cards!inner (
                    content_version
                )
            `)
            .eq('card_id', cardId)
            .eq(auth.column, auth.value)
            .single();

        if (error || !data) {
            return { is_saved: false };
        }

        return {
            is_saved: true,
            follow_updates: data.follow_updates,
            source_version: data.source_version,
            current_version: data.cards?.[0]?.content_version,
            has_updates: data.source_version < data.cards?.[0]?.content_version
        };
    } catch (error) {
        console.error('Error checking saved status:', error);
        return { is_saved: false };
    }
}


// export async function isSaved(params: CheckSavedParams): Promise<boolean> {
//     const result = await checkSavedStatus(params);
//     return result.is_saved;
// }