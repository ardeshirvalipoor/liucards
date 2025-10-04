import { CardPayload } from '../interfaces/card'
import utils from '../utils'

let _cardsCache = new Map<string, any>()


// Fetch card by ID, with caching
async function getById(id: string) {
    if (_cardsCache.has(id)) return _cardsCache.get(id)
    const resp = await utils.http.get(`/api/v1/cards/${id}`)
    _cardsCache.set(id, resp)

    return resp
}


// Update card
async function update(payload: any) {
    const resp = await utils.http.put(`/api/v1/cards/${payload.id}`, payload)
    _cardsCache.set(payload.id, { ..._cardsCache.get(payload.id), ...payload })

    return true
}


// Create new card
async function create(params: CardPayload) {
    const payload = {
        ...params,
        channel_id: null,
        client_created_at: new Date().toISOString(),
    }
    const resp = await utils.http.post('/api/v1/cards', payload)
    console.log('Created card response:', resp);
    
    _cardsCache.set(resp.id, resp)

    return resp.id
}

// Clear the cache
function clearCache() {
    _cardsCache = new Map<string, any>()
}


// Manually set cache item
function setCacheItem(id: string, data: any) {
    _cardsCache.set(id, data)
}

export default {
    create,
    update,
    getById,
    setCacheItem
}