import { Div } from '../../base/components/native/div'
import { Span } from '../../base/components/native/span'
import { CENTER, WH, EASE, Y, SHOW, HIDE } from '../../base/helpers/style'
import router from '../../base/lib/router'
import {emitter} from '../../base/utils/emitter'
import db from '../../services/db'
import { BackIcon } from './back-icon'
import { MenuIcon } from './menu-icon'

// Make it better
export const Header = () => {

    const base = Div()

    const shadow = Div()

    base.append( /* logo,  */ shadow)


    shadow.cssClass({
        // boxShadow: '0 0 5px #00000000',
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0',
        height: '66px',
        transition: 'all .44s',
        pointerEvents: 'none',
    })
    base.cssClass({
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 'calc(66px + env(safe-area-inset-top))',
        padding: 'calc(0px + env(safe-area-inset-top)) 0 0',
        transition: 'all .24s',
        backgroundColor: 'white',
        zIndex: '999999',
        position: 'relative',
    })

    return Object.assign(
        base,
        {
            toggleShadow(v: number) {
                shadow.style({ boxShadow: v > 10 ? '#00000012 0px 5px 8px' : '#00000000 0px 5px 8px' })
            }
        }
    )
}