import { Div } from "../../base/components/native/div"

export const SuggesitonsLoadings = (num = 5) => {

    const base = Div()
    for (let i = 0; i < num; i++) {
        const loading = Div()
        loading.el.classList.add('fade')
        loading.cssClass({
            width: Math.random() * 50 + 50 + '%',
            height: '21px',
            backgroundColor: '#eee',
            margin: '10px 0',
        }, i * 100)
        base.append(loading)
    }
    base.cssClass({

    })

    return base
}



