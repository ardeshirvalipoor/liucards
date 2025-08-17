import { Ghost, withRipple } from '../../base/components/advanced/ghost/ghost'
import { Base } from '../../base/components/base'
import router from '../../base/lib/router'
import { emitter } from '../../base/utils/emitter'
import { Bar } from './bar'
import { CENTER, ROUND } from '../../base/helpers/style'
import configs from '../../configs'

export const MenuIcon = () => {

    const base = Base()
    const top = Bar(4)
    const middle = Bar(4)
    const bottom = Bar(4)

    router.on('change', ({ path }: any) => path.split('?')[0] === '/' ? show() : hide()) // todo: fetch typing
    base.el.onclick = () => {
        router.goto('/menu')
    }
    top.style({ width: '50%' })
    bottom.style({ width: '80%' })

    withRipple(base, { bg: '#ccc' });
    base.append(top, middle, bottom)

    base.cssClass({
        ...ROUND,
        left: '0',
        width: '60px',
        height: '60px',
        padding: '20px',
        transition: 'all .16s',
        zIndex: '99999',
        ...CENTER,
        alignItems: 'start',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // backgroundColor: 'white',
        position: 'absolute',
        top: 'env(safe-area-inset-top) + 0px)',
        cursor: 'pointer',
        // backgroundColor: '#fff',
        borderRadius: '50%',
        '&:hover': {
            opacity: '.8',
        },
        '&:active': {
            transform: 'scale(.9)' // Tdod: fix this. if we have other transform, it will not be overriden
        },
    })

    function show() {
        base.style({
            opacity: '1',
            transform: 'translateY(0)'
        }, { delay: 100 })
    }
    function hide() {
        base.style({
            opacity: '0',
            transform: 'translateY(-60px)'
        })
    }


    return base
}