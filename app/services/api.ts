import ldb from '../base/lib/ldb'

function getHeader() {
    
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ldb.get('rankr-user')?.token,
    }
}

export default {
    async get(url: string, params: any = {}) {
        try {
            const options = {
                headers: getHeader()
            }
            const response = await fetch(url, options)
            const data = await response.json()
            return { data, status: response.status }
        } catch (error) {
            return { error, status: error.status }
        }
    },
    async post(url: string, params: any = {}) {
        try {
            const options = {
                method: 'POST',
                headers: getHeader(),
                body: JSON.stringify(params),
            }
            const response = await fetch(/* prefix + */ url, options)
            const data = await response.json()
            return { data, status: response.status }
        } catch (error) {
            return { error, status: error.status }
        }
    }
}