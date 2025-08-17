import { Div } from "../../base/components/native/div";

export const View = () => {

    const base = Div() // Fragment later
    // console.log('is running in browser', isRunningInBrowser());

    base.cssClass({
        position: 'relative',
        right: '0',
        left: '0',
        top: '0',
        bottom: '0',
        height: window.innerHeight + 'px',
        overflow: 'hidden',
        width: '100vw',
    })
    // base.append(Div(window.innerHeight + 'px').cssClass({ height: window.innerHeight + 'px' }))

    setTimeout(() => {
        // base.style({ height: window.innerHeight + 'px' })
    }, 3000);
    // setTimeout(() => {
    //     base.style({ height: window.innerHeight + 'px' })
    // }, 3000);
    window.addEventListener('resize', () => {
        // base.style({ height: window.innerHeight + 'px' })
    })

    return base
}

