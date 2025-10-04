import utils from '.'
import services from '../services'


function getDefaultHeader() {
    const session = services.supabase.auth.getSession()
    const accessToken = session?.access_token

    return {
        'Content-Type': 'application/json',
        'x-device-id': utils.device.getId(),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
}

// GET
// todo: deduplicate requests
async function get<T = any>(url: string, customHeader = {}): Promise<T> {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...getDefaultHeader(),
                ...customHeader
            },
        })
        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`HTTP ${res.status}: ${errorText}`)
        }

        return await res.json() as T
    } catch (err) {
        console.error('HTTP GET Error:', err);
        throw err;
    }
}

// POST
async function post<T = { id: string }>(url: string, data: any, customHeader = {}): Promise<T> {
    
    try {
        
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                ...getDefaultHeader(),
                ...customHeader
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`HTTP ${res.status}: ${errorText}`)
        }

        return await res.json() as T
    } catch (err) {
        console.error('HTTP POST Error:', err);
        throw err;
    }
}

// PUT
async function put<T = any>(url: string, data: any, customHeader = {}): Promise<T> {
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                ...getDefaultHeader(),
                ...customHeader
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`HTTP ${res.status}: ${errorText}`)
        }

        return await res.json() as T
    } catch (err) {
        console.error('HTTP PUT Error:', err);
        throw err;
    }
}

export default {
    post,
    put,
    get,
}
