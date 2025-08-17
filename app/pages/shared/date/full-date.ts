import { Div } from "../../../base/components/native/div"
import { jDateFormatter } from "../../../base/helpers/date"

export const FullDate = (date: Date) => {

    const base = Div()
    const [wd, d, ...rest] = jDateFormatter.format(date).replace(',', '').split(' ').reverse()
    const top = Div(wd + ' <b>' + d + '</b>')
    const bottom = Div(rest.join(' '))
    bottom.style({
        opacity: '.7',
    })
    base.append(top, bottom)

    base.style({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',

    })

    return base
}