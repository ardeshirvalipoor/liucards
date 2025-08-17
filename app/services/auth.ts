import { fetch } from '../base/lib/fetch'
import idb from '../base/lib/idb'
import ldb from '../base/lib/ldb'
import { XHR } from '../base/lib/xhr'
import { TUser } from '../interfaces/user'
import db from './db'

let popup: Window

export default {
    async check() {
        return XHR.post('/auth/check')
    },

    requestLogin(phone: string) {
        return XHR.post('/auth/request-login', { phone })
        // fetch('/auth/request-login', { method: 'POST', body: JSON.stringify({ phone }) })   
    },

    async login(phone: string, code: string) {
        try {
            const { ok, data } = await XHR.post('/auth/login', { phone, code }) as { ok: boolean, data: TUser }
            if (!ok) return false
            ldb.save('user', data)

            // Ensure all local records have user_id
            console.log('ensureUserIdOnAllRecords done');

            // sync.run()
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    },
    // todo: check auto login

    async logout() {
        // Todo clear components
        ldb.clear()
        db.clear('clients')
        db.clear('appointments')
        db.clear('businesses')
        db.clear('transactions')
        return XHR.post('/auth/logout')
    }

    // async googleLogin() {
    //     const W = Math.max(window.innerWidth, 600)
    //     const H = Math.max(window.innerHeight, 800)
    //     const { data } = await XHR.get('/auth/google', { type: 'text/html' })
    //     popup = <Window>window.open('', 'Rankr authentication', `status=1, height=${H}, width=${W}, toolbar=0, resizable=0`)
    //     popup.location.href = data
    //     return true
    // }
}


// window.addEventListener('message', (event) => {
//     return // temp
//     if (event?.origin !== window.origin) return
//     popup?.close()
//     getProfile(event.data)
//     return true
// }, false)

// async function getProfile(token: string) {
//     const { data } = await XHR.get('/auth/google/callback?code=' + token)
//     ldb.save(data).as('rankr-user')
//     emitter.emit('logged-in', data)
// }