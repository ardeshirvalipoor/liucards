import { Div } from "../../base/components/native/div"
import { IRouteParams } from "../../base/lib/router"
import { waitFor } from "../../base/utils/wait"
import helpers from "../../helpers"

export const Page = () => {

    const base = Div()

    base.cssClass(helpers.styles.PAGE_BASE)

    function exit({ query, from, to, data, params }: IRouteParams) {
        base.emit('exit', { query, from, to, data, params })
        base.style(helpers.styles.PAGE_EXIT_UP)
    }

    async function enter({ query, from, to, data, params }: IRouteParams) {
        await waitFor(helpers.styles.PAGE_TRANSITION_DURATION)
        base.emit('enter', { query, from, to, data, params })
        base.style(helpers.styles.PAGE_ENTER)
    }

    return Object.assign(base, { enter, exit })
}