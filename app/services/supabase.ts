import { createClient, Session, User } from '@supabase/supabase-js'
import utils from '../utils'

const SUPABASE_URL = 'https://kjwuyqdprfwdrxygmtmm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3V5cWRwcmZ3ZHJ4eWdtdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTU3NTksImV4cCI6MjA2MzA5MTc1OX0.tX4Xp7h5HWHBgVZc4oy6LkFiec__cs15nbKfBwHhFzs'

// Important: Configure the client with proper auth settings
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		storage: window.localStorage,
		storageKey: 'sb-kjwuyqdprfwdrxygmtmm-auth-token',
		flowType: 'pkce' // Use PKCE flow for better security
	}
})

interface AuthState {
	token: string | null
	user: User | null
	session: Session | null
	initialized: boolean
}

let state: AuthState = {
	token: null,
	user: null,
	session: null,
	initialized: false
}

const subscribers = new Set<(state: any) => void>()

function notifySubscribers() {
	const publicState = {
		token: state.token,
		user: state.user,
		isAuthenticated: !!state.token
	}
	subscribers.forEach((callback) => callback(publicState))
}

function updateState(session: Session | null) {
	state.session = session
	state.token = session?.access_token ?? null
	state.user = session?.user ?? null
	notifySubscribers()
}

const auth = {
	initialize: async () => {
		if (state.initialized) {
			console.warn('Auth already initialized')
			return state.session
		}

		try {
			// First, try to get the session from storage
			const { data: { session }, error } = await supabase.auth.getSession()

			if (error) {
				console.error('Error getting session:', error)
			}

			if (session) {
				console.log('Found existing session:', session)
				updateState(session)
			}

			// Set up auth state change listener
			const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
				console.log('Auth event:', event)
				console.log('New session:', session)

				// Handle different auth events
				switch (event) {
					case 'SIGNED_IN':
						console.log('User signed in successfully')
						updateState(session)
						break
					case 'SIGNED_OUT':
						console.log('User signed out')
						updateState(null)
						break
					case 'TOKEN_REFRESHED':
						console.log('Token refreshed')
						updateState(session)
						break
					case 'USER_UPDATED':
						console.log('User updated')
						updateState(session)
						break
					default:
						updateState(session)
				}
			})

			state.initialized = true

			// Check localStorage to debug
			const storedSession = localStorage.getItem('sb-kjwuyqdprfwdrxygmtmm-auth-token')
			console.log('Stored session in localStorage:', storedSession ? 'Present' : 'Not found')

			return session
		} catch (error) {
			console.error('Failed to initialize auth:', error)
			state.initialized = true
			throw error
		}
	},

	subscribe: (callback: (state: any) => void) => {
		subscribers.add(callback)
		// Immediately call with current state
		callback({
			token: state.token,
			user: state.user,
			isAuthenticated: !!state.token
		})
		return () => subscribers.delete(callback)
	},

	getToken: () => state.token,
	getUser: () => state.user,
	getSession: () => state.session,
	isAuthenticated: () => !!state.token,

	signInWithGoogle: async () => {
		try {
			// Get the current URL for redirect
			const redirectTo = `${window.location.origin}${window.location.pathname}`

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent'
					}
				}
			})

			if (error) {
				console.error('Google sign-in error:', error)
				throw error
			}

			console.log('OAuth sign-in initiated:', data)
			return data
		} catch (error) {
			console.error('Failed to sign in with Google:', error)
			throw error
		}
	},

	signOut: async () => {
		try {
			const { error } = await supabase.auth.signOut()
			if (error) {
				console.error('Sign out error:', error)
				throw error
			}
			updateState(null)
		} catch (error) {
			console.error('Failed to sign out:', error)
			throw error
		}
	},

	refreshSession: async () => {
		try {
			const { data: { session }, error } = await supabase.auth.refreshSession()
			if (error) {
				console.error('Refresh session error:', error)
				throw error
			}
			updateState(session)
			return session
		} catch (error) {
			console.error('Failed to refresh session:', error)
			throw error
		}
	},

	// Helper method to manually check for session
	checkSession: async () => {
		const { data: { session }, error } = await supabase.auth.getSession()
		if (error) {
			console.error('Check session error:', error)
			return null
		}
		updateState(session)
		return session
	}
}

async function afterLoginMerge() {
	// 1) must have a session
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) throw new Error('No session after login')

	// 2) merge anonymous cards for this device
	const deviceId = utils.device.getId()
	const { data, error } = await supabase.rpc('claim_device_cards', { p_device_id: deviceId })
	if (error) {
		console.error('Merge failed:', error)
		// You can continue; the user can retry from settings later
	} else {
		// optional: show a toast
		// data => [{ moved_cards: number, ensured_saved: number }]
	}
}

export default {
	auth,
	afterLoginMerge
}