import { Div } from "../../base/components/native/div"
import { NUMBERS_DELIMITER_REGEX } from "../../base/helpers/regex"
import { FInput } from "./f-input"

export const PriceInput = (title: string, placeholder: string) => {
    const base = FInput(title, placeholder, { inputmode: 'numeric' })
    const i = base.input
    i.el.dir = 'ltr'
    i.style({
        position: 'relative',
        left: '50px'
    })
    i.on('input', () => {
        i.el.value = i.getValue().replace(/[^\d۰۱۲۳۴۵۶۷۸۹]/g, '').split('').map((c: string, i, arr) => {
            if ((arr.length - i) % 3 === 0 && i > 0) return ',' + c
            return c
        }).join('')
        // i.setValue(i.getValue().replace(NUMBERS_DELIMITER_REGEX, ','))
    })
    const p = base.placeholder
    p.style({
        left: '50px',
        top: '53px',
        zIndex: '9',
    })

    const unit = Div('تومان')
    unit.cssClass({
        position: 'absolute',
        left: '0px',
        top: '65px',
        fontSize: '20px',
        color: '#bbb',
    })
    base.append(unit)
    return Object.assign(base, { getValue: () => i.getValue().replace(/,/g, '') })
}