import { Div } from "../../../base/components/native/div"
import ldb from "../../../base/lib/ldb"
import helpers from "../../../helpers"
import services from "../../../services"
import { baseStyle, exitStyle, phoneStyle } from "./user.style"

export const User = () => {

    const base = Div()
    base.cssClass(baseStyle)

    const phone = Div()
    phone.style(phoneStyle)
    base.append(phone)

    const exit = Div('خروج')
    exit.style(exitStyle)
    base.append(exit)
    // exit.el.onclick = async () => {
    //     await services.auth.logout()
    //     base.emit('exit')
    // }

    return Object.assign(base, {
        show() {
            base.style({ display: 'flex' })
            const num = (ldb.get('user')?.phone_number || '').replace('98', '0')
            const number = helpers.locale.replaceLatinDigits(num)
            phone.text(number)
        },
        hide() {
            base.style({ display: 'none' })
        }
    })
}