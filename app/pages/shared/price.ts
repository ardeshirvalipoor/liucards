import { Base } from '../../base/components/base'
import { Div } from '../../base/components/native/div'
import { NUMBERS_DELIMITER_REGEX } from '../../base/helpers/regex'
import helpers from '../../helpers'

export const Price = (value: number | string = 0) => {

    const base = Div()
    base.cssClass({
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '7px',
    })

    const toman = Div('تومان')
    toman.cssClass({
        fontSize: '.7em',
        opacity: '.6',
    })

    const content = Div(helpers.locale.replaceLatinDigits(value.toString().replace(NUMBERS_DELIMITER_REGEX, ',')))
    base.append(content, toman)

    return base
}
