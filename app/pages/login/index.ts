import router, { IRouteParams } from "../../base/lib/router";
import helpers from "../../helpers";
import { Page } from "../shared/page";
import { Base } from "../../base/components/base";

export const LoginPage = () => {
    const base = Page()

    const wizard = Base()
    base.append(wizard)
    wizard.on('done', async () => {
        const redirect = router.getQuery('redirect')
        // if (window.history.length <= 1) {
        //     router.goto(redirect)
        // } else {
        router.back()
        // }
    })


    function exit({ to }: IRouteParams) {
        base.style(helpers.styles.PAGE_EXIT)
    }

    base.on('enter', ({ from }: IRouteParams) => {
        if (from?.includes('setup-reminder')) {
            // desc.style({ display: 'block' })
        }
    })

    return Object.assign(base, { exit })
};
