import { Base } from '../../base/components/base'
import router from '../../base/lib/router'
import { Bar } from './bar'
import { CENTER } from '../../base/helpers/style'
import { withRipple } from '../../base/components/advanced/ghost/ghost'

export const BackIcon = () => {

    const height = 2
    const base = Base()
    const top = Bar(height)
    const bottom = Bar(height)

    router.on('change', ({ path }: any) => {
        
        if (location.pathname == '/') {
            hide()
        } else {
            show()
            blink()
        }
    })

    base.el.onclick = () => {
        router.goto('/')
        // router.back()
    }

    top.style({
        bottom: '5px',
        width: '14px',
        backgroundColor: 'black',
        position: 'absolute',
        transform: `rotateZ(45deg)`
    })
    bottom.style({
        top: '6px',
        width: '14px',
        backgroundColor: 'black',
        position: 'absolute',
        transform: `rotateZ(-45deg)`
    })

    base.el.addEventListener('touchstart', (e: TouchEvent) => {
        base.style({
            transform: 'scale(.9)'
        })
    })
    base.el.addEventListener('touchend', () => {
        base.style({
            transform: 'scale(1)'
        })
    })
    base.append(top, bottom)
    withRipple(base)
    base.cssClass({
        position: 'absolute',
        left: `0`,
        top: 'env(safe-area-inset-top) + 0px)',

        margin: '20px',
        width: '22px',
        height: '22px',
        transition: 'all .28s',
        zIndex: '99999',
        opacity: '0',
        transform: 'translateY(50px) rotateX(180deg)',
        cursor: 'pointer',
        '&.hover': {
            opacity: '.8'
        },
        // '&:active': {
        //     transform: 'scale(.29)'
        // },
        ...CENTER
    })

    function blink() {
    }
    function show() {
        base.style({
            opacity: '.7',
            transition: 'all .28s',

            transform: 'translateY(0) rotateX(0deg)'
        }, { delay: 260 })
    }
    function hide() {
        base.style({
            opacity: '0',
            transition: 'all .12s',
            transform: 'translateY(50px) rotateX(180deg)'
        })
    }

    return base
}