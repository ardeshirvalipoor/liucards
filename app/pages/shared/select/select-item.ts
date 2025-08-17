import { Div } from "../../../base/components/native/div"
import { CENTER } from "../../../base/helpers/style"

export const SelectItem = (object?: any) => {
    const base = Div()
// temp
// todo: and template

    base.append(Div(object?.name || ''))


    base.cssClass({
        height: '60px',
        ...CENTER,
        flexDirection: 'row',
        justifyContent: 'start',
        fontSize: '18px',
        scrollSnapAlign: 'start',
    })

    return base
}