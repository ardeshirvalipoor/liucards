import helpers from '../../helpers'
import { Div } from '../../base/components/native/div'
import { EASE } from '../../base/helpers/style'
import { IRouteParams } from '../../base/lib/router'
import { waitFor } from '../../base/utils/wait'
import { emitter } from '../../services/emitter'
import { Body } from '../shared/body'
import { PageHeader } from '../shared/page-header'
import { MenuItem } from './shared/item'
import services from '../../services'

export const MenuPage = () => {

    const base = Div()
    const title = PageHeader('Liu Cards')
    const body = Body()
    // const about = MenuItem('About Liu', '/about')
    // const login = MenuItem('Login', '/login')
    const welcome = Div('')
    const login = MenuItem('Login with Google')
    const logout = MenuItem('Logout')
    const review = MenuItem('Review', '/review')
    const version = Div('Version 1.4.1').style({ fontWeight: '100', fontSize: '14px', color: '#666', marginTop: '40px' })

    welcome.style({ display: 'none', marginBottom: '10px', fontSize: '18px', color: 'rgb(11 187 148)' })

    login.style({ display: 'none' })
    logout.style({ display: 'none' })

    handleButtons()
    emitter.on('auth:change', handleButtons)
    base.append(title, body)
    body.append(welcome, login, logout, review, version)
    base.cssClass(helpers.styles.PAGE_BASE)
    login.el.addEventListener('click', async () => {
		await services.supabase.auth.signInWithGoogle()
		console.log('Logged in now apply user id');
		await services.supabase.afterLoginMerge()
	})
    logout.el.addEventListener('click', async () => {
        await services.supabase.auth.signOut()
        handleButtons()
    })

    function handleButtons() {
        const user = services.supabase.auth.getUser()
        if (user) {
            welcome.text(`Welcome, ${user.email}`)
            welcome.style({ display: 'block' })
            login.style({ display: 'none' })
            logout.style({ display: 'block' })
        } else {
            welcome.style({ display: 'none' })
            login.style({ display: 'block' })
            logout.style({ display: 'none' })
        }
    }

    return {
        ...base,
        async exit({ to = '' }: IRouteParams) {
            base.style(helpers.styles.PAGE_EXIT)
            if (to === '/login') base.style(helpers.styles.PAGE_EXIT_UP)
            if (to === '/about') base.style(helpers.styles.PAGE_EXIT_UP)
            if (to === '/review') base.style(helpers.styles.PAGE_EXIT_UP)
        },
        async enter({ from = '' }: IRouteParams) {
            await waitFor(200)
            if (from === '/') {
                base.style({ ...helpers.styles.PAGE_EXIT, ...EASE(0) })
            }
            base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

        }
    }
}