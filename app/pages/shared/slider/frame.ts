import { Div } from "../../../base/components/native/div"
import { CENTER } from "../../../base/helpers/style"

export const Frame = (content?: string) => {

    const base = Div(content)
    base.cssClass({
        ...CENTER,
        width: '100%',
        position: 'relative',
        height: '100%',
    })

    return base
}