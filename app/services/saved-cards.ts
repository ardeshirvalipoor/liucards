import utils from "../utils";

export async function save(cardId: string) {
    await utils.http.post('/api/v1/saved-cards', { card_id: cardId });
    return true;
}

export default {
    save
}