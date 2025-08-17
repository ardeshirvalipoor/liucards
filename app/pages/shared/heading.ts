import { Div } from "../../base/components/native/div"
import { H3 } from "../../base/components/native/h"

export const Heading = (text: string, color = 'gray') => {
    const base = Div(text)
    base.cssClass({
        textAlign: 'right',
        fontSize: '16px',
        margin: '20px 0 30px 0',
        fontWeight: 'bold',
        color
    })
    return base
}