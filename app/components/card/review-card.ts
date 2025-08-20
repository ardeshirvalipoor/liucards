import { Div } from "../../base/components/native/div"
import { CENTER } from "../../base/helpers/style"
import { Card } from "./card"

export const ReviewCard = (_card: { front: string, back: string, added: boolean }) => {
    const base = Card(_card)

    const buttons = Div()
    buttons.cssClass({
        display: 'flex',
        flexDirection: 'row',
        gap: '72px',
        justifyContent: 'space-between',
        marginTop: '26px'
    })
    const dontKnow = Div('Don\'t know')
    dontKnow.cssClass({
        ...CENTER,
        lineHeight: '18px',
        textAlign: 'center',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(175, 175, 175, 1)',
        cursor: 'pointer'
    })
    const iKnow = Div('I<br>know')
    iKnow.cssClass({
        ...CENTER,
        textAlign: 'center',
        lineHeight: '18px',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(175, 175, 175, 1)',
        cursor: 'pointer'
    })
    buttons.append(dontKnow)
    buttons.append(iKnow)
    base.append(buttons)

    iKnow.el.onclick = () => {
        iKnow.cssClass({ backgroundColor: 'rgba(7, 197, 61, 0.8)' })
        base.emit('iKnow')
        iKnow.el.onclick = null
        dontKnow.el.onclick = null
    }
    dontKnow.el.onclick = () => {
        dontKnow.cssClass({ backgroundColor: 'crimson' })
        base.emit('dontKnow')
        dontKnow.el.onclick = null
        iKnow.el.onclick = null
    }
    return base
}
