import app from './app'
import ldb from './base/lib/ldb'
import { disableContextMenu, disableTouchStartPassive } from './base/utils/event-handlers'
import services from './services'
import { emitter } from './services/emitter'

(async () => {
    window.onerror = (message, source, lineno, colno, error) => alert(message)
    // await db.init()
    disableContextMenu({ touch: true, mouse: false })
    disableTouchStartPassive()
    document.body.appendChild(app.el)
    window.ononline = () => app.emit('online')

// temp clear local cards
const cards = ldb.get('liucards-cards') || []
for (const card of cards) {
    const payload = {
        front: card.front,
        back: card.back,

    }
   await services.cards.save(payload)
}
ldb.set('liucards-cards', []) // Clear local cards after saving


    // services.log.userEvents('open')

    // This MUST run on every page load to handle OAuth redirects
    const session = await services.supabase.auth.initialize()

    if (session) {
        console.log('User logged in:', session.user.email)
        emitter.emit('auth:change', { user: session.user, isAuthenticated: true })
        // Clear URL hash/params after successful auth
        // window.history.replaceState({}, document.title, window.location.pathname)
    } else {
        console.log('No session - user not logged in')
    }


    // Check auth anywhere
    if (services.supabase.auth.isAuthenticated()) {
        const token = services.supabase.auth.getToken();
        console.log('> init supabase token', token);
        console.log('> Running afterLoginMerge');
        services.supabase.afterLoginMerge()

        // Use token for API calls
    }

    // React to auth changes
    let unsubscribe: () => void;

    function initPage() {
        // Start listening
        unsubscribe = services.supabase.auth.subscribe((state: { user: { email: any }; isAuthenticated: any }) => {
            console.log('User:', state.user?.email);
            console.log('Authenticated:', state.isAuthenticated);
        });
    }

    function cleanupPage() {
        // Stop listening when leaving page or cleaning up
        if (unsubscribe) {
            unsubscribe();
        }
    }

    // Example: cleanup when navigating away
    window.addEventListener('beforeunload', cleanupPage);
})()


// window.addEventListener('beforeunload', () => services.log.userEvents('close'))


