// import { supabaseAdmin } from "../../configs/supabase"
// import { SaveCardParams } from "../../interfaces/saved-cards"
// export default async function isSaved(params: SaveCardParams): Promise<boolean> {
//     const { userId, deviceId, cardId } = params
//     try {
//         let query = supabaseAdmin
//             .from('saved_cards')
//             .select('id')
//             .eq('card_id', cardId)
//             .limit(1)
//         if (userId) {
//             query = query.eq('user_id', userId)
//         } else if (deviceId) {
//             query = query.eq('device_id', deviceId)
//         } else {
//             return false
//         }
//         const { data, error } = await query
//         if (error) {
//             console.error('Error checking saved status:', error)
//             return false
//         }
//         return !!data && data.length > 0
//     } catch (error) {
//         console.error('Error checking saved status:', error)
//         return false
//     }
// }
