import services from "."
import utils from "../utils"


async function getRecomendations() {

}

async function loadMoreCards() {

    /* 
    fetch to /api/v1/cards, either by device_id as query param or the token.
    {
  "items": [
    {
      "saved_card_id": null,
      "card_id": "d337a415-944c-4861-9a45-00ec969b40f6",
      "front": "Dara",
      "back": "Sara",
      "state": "new",
      "due_at": null,
      "created_at": "2025-08-17T09:57:37.465575+00:00",
      "updated_at": "2025-08-17T09:57:37.465575+00:00",
      "source_kind": "self"
    },
    {
      "saved_card_id": null,
      "card_id": "faa02e48-0876-4108-8511-6d396f6c04c5",
      "front": "AFTER RLS",
      "back": "DONE",
      "state": "new",
      "due_at": null,
      "created_at": "2025-08-17T09:15:56.462749+00:00",
      "updated_at": "2025-08-17T09:15:56.462749+00:00",
      "source_kind": "self"
    }
  ],
  "count": 2
}
    */
    const device_id = utils.device.getId()
    const auth = services.supabase.auth.getSession()
    const url = `/api/v1/cards?limit=10&device_id=${device_id}`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${auth?.access_token}`
        }
    })
    const data = await response.json()
    return data.items.map((item: any) => ({
        added: false,
        id: item.card_id,
        front: item.front,
        back: item.back
    }))
}



export default {
    getRecomendations,
    loadMoreCards
}