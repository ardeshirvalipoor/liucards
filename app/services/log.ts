import ldb from "../base/lib/ldb";
import { XHR } from "../base/lib/xhr";

export default {
    userEvents
}

function userEvents(eventType: string) {
    if (location.hostname === 'localhost') {
        return
    }
    XHR.post('/api/track/events', {
        event: eventType,
        timestamp: new Date().toISOString(),
        appId: ldb.get('app-id') || 'no-app-id',
        user: ldb.get('user')?._id || 'no-user',
        phone: ldb.get('user')?.phone_number || 'no-phone'
    }).then((response) => {
        console.log('Event logged:', response)
    }).catch((error) => {
        console.error('Error logging event:')
        console.log(error);
    })
}