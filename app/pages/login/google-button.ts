import { Base } from "../../base/components/base"
import { Img } from "../../base/components/native/img"
import { Span } from "../../base/components/native/span"
import { CENTER } from "../../base/helpers/style"
import images from '../../configs/images'

export const GoogleButton = () => {
    const base = Base()
    const google = Img(images.ICONS.GOOGLE, { width: 24 })
    const txt = Span('Login using google')
    txt.cssClass({
        marginLeft: '10px',
    })

    base.append(google, txt)
    base.cssClass({
        ...CENTER,
        border: '1px solid #eee',
        borderRadius: '10px',
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#fefefe',
        }
    })

    base.el.onclick = async () => {
        txt.text('Logging in...')
        base.emit('request-login')
    }

    return base
}