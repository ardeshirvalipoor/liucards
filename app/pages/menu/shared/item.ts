import { withRipple } from "../../../base/components/advanced/ghost/ghost"
import { Div } from "../../../base/components/native/div"
import router from "../../../base/lib/router"

export const MenuItem = (title: string, target?: string) => {
    const base = Div(title)

  if (target)  base.el.onclick = () => setTimeout(() => router.goto(target), 100)
    withRipple(base, { bg: '#ccc' })

    base.cssClass({
        position: 'relative',
        fontSize: '18px',
        padding: '20px 0px 15px',
        overflow: 'hidden',
    })
    return base
}