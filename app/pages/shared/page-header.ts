import { Base } from '../../base/components/base'
import { Div } from "../../base/components/native/div"
import { EASE } from '../../base/helpers/style'

export const PageHeader = (title = '') => {
    const base = Div(title)
    base.cssClass({
        position: 'absolute',
        top: 'env(safe-area-inset-top) + 0px)',
        right: '0',
        left: '0',
        zIndex: '2',
        height: '60px',
        backgroundColor: '#fff',//COLORS.MAIN,
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '18px 0px 17px 60px',
        textAlign: 'left',
        ...EASE(.24)
    })


    return Object.assign(base, {
        toggleShadow(v: number) {
            base.style({ boxShadow: v > 10 ? '#00000012 0px 5px 8px' : '#00000000 0px 5px 8px' })
        },
    })
}