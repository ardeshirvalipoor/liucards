import { Div } from "../../base/components/native/div";
import { Img } from "../../base/components/native/img";
import { EASE } from "../../base/helpers/style";
import { IRouteParams } from "../../base/lib/router";
import { waitFor } from "../../base/utils/wait";
import images from "../../configs/images";
import helpers from "../../helpers";
import { ActionButton } from "../shared/action-button";

export const AboutPage = () => {
    const base = Div()
    const title = Div('Liu Cards')
    const description = Div(`
   Liu is here to help you




    `)
    // body.style({ paddingTop: '60px' })

    base.append(title, description)

    title.cssClass({
        fontSize: '36px',
        fontWeight: 'bold',
    })
    description.cssClass({
        fontSize: '16px',
        margin: '10px 0 30px',
        width: '290px',
    })

    base.cssClass({
        ...helpers.styles.PAGE_BASE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflowY: 'auto',
    })

    return Object.assign(base, {
        ...base,
        async exit({ to = '' }: IRouteParams) {
            base.style(helpers.styles.PAGE_EXIT)
        },
        async enter({ from = '' }: IRouteParams) {
            await waitFor(200)
            // if (from === '/menu') {
            //     base.style({ ...helpers.styles.PAGE_EXIT, ...EASE(0) })
            // }
            base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

        }
    })
}
