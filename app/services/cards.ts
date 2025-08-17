import services from "."
import ldb from "../base/lib/ldb"
import { XHR } from "../base/lib/xhr"
import { waitFor } from "../base/utils/wait"
import utils from "../utils"

async function save(params: any) {

    let accessToken: string | null = null
    const session = await services.supabase.auth.getSession()
    if (session) {
        accessToken = session.access_token
        console.log('Token:', accessToken)

    }



    const { front, back } = params
    const payload = {
        front,
        back,
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

    // const cards = ldb.get('liucards-cards') || []
    // cards.push({front, back, 'liucards-device-id': localStorage.getItem('liucards-device-id'), added: true})
    // ldb.set('liucards-cards', cards)
    return true
}


export default {
    save
}