import { Base } from '../../base/components/base'
import { Div } from '../../base/components/native/div'
import { jDateFormatter } from '../../base/helpers/date'
import { NUMBERS_DELIMITER_REGEX } from '../../base/helpers/regex'
import helpers from '../../helpers'

export const Date = (date: Date) => {

    const base = Div()
    const content = jDateFormatter.format(date).replace(',', '').split(' ').reverse().join(' ')
    base.html(content)
    base.cssClass({
        direction: 'rtl',
    })

    return base
}
