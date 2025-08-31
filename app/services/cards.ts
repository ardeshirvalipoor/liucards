import services from "."
import utils from "../utils"

let _cardsCache = new Map<string, any>()
async function getById(id: string) {
    if (_cardsCache.has(id)) {
        return _cardsCache.get(id)
    }
    const resp = await fetch(`/api/v1/cards/${id}`)
    const data = await resp.json()
    _cardsCache.set(id, data)
    return data
}

async function update(params:any) {
    let accessToken: string | null = null

    const session = await services.supabase.auth.getSession()
    if (session) {
        accessToken = session.access_token
        console.log('Token:', accessToken)

    }

    const { front, back, id } = params
    console.log('EDIT PARAMS:', params);

    const payload = {
        front,
        back,
        device_id: utils.device.getId(),
    }
    console.log('EDIT PAYLOAD:', payload);

    const resp = await fetch(`/api/v1/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`  // <- token here
        },
        body: JSON.stringify(payload)
    })
    _cardsCache.set(id, { ..._cardsCache.get(id), ...payload })

    // const cards = ldb.get('liucards-cards') || []
    // cards.push({front, back, 'liucards-device-id': localStorage.getItem('liucards-device-id'), added: true})
    // ldb.set('liucards-cards', cards)
    return true
}
async function save(params: any) {

    let accessToken: string | null = null
    const session = await services.supabase.auth.getSession()
    if (session) {
        accessToken = session.access_token
        console.log('Token:', accessToken)

    }

    const { front, back, front_audio_url, back_audio_url } = params
    const payload = {
        front,
        back,
        front_audio_url,
        back_audio_url,
        client_created_at: new Date().toISOString(),
        device_id: utils.device.getId(),
    }
    const resp = await fetch('/api/v1/cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`  // <- token here
        },
        body: JSON.stringify(payload)
    })
    const data = await resp.json()
    _cardsCache.set(data.id, data)

    // const cards = ldb.get('liucards-cards') || []
    // cards.push({front, back, 'liucards-device-id': localStorage.getItem('liucards-device-id'), added: true})
    // ldb.set('liucards-cards', cards)
    return true
}


export default {
    save,
    update,
    getById,
    setCacheItem: (id: string, data: any) => {
        console.log('in setting cache', id);
        _cardsCache.set(id, data)
    }
}