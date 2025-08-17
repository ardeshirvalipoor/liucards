import { Div } from "../../../base/components/native/div"
import { SelectItem } from "./select-item"

export const Select = () => {

    const base = Div()
    const wrapper = Div()
    const topMask = Div()
    const lowMask = Div()
    base.append(topMask, lowMask, wrapper)
    let _state: any = {}

    const maskStyle = {
        position: 'absolute',
        height: '60px',
        backgroundColor: 'white',
        top: '0',
        right: '0',
        left: '5px',
        zIndex: '99',
        opacity: '.85',
        pointerEvents: 'none',
    }
    topMask.cssClass({
        ...maskStyle,
        borderBottom: '1px solid #00000033'
    })
    lowMask.cssClass({
        ...maskStyle,
        top: '120px',
        borderTop: '1px solid #00000033'
    })
    base.cssClass({
        position: 'relative',
    })
    wrapper.cssClass({
        scrollSnapType: 'y mandatory',
        height: '180px',
        overflowY: 'scroll',
    })

    return Object.assign(base, {
        getValue() {
            const scrolledTopIndex = Math.round(wrapper.el.scrollTop / 60)
            return _state[scrolledTopIndex] || {}
        },
        setValue(data: any[], selectedKey: any) {
            const index = data.findIndex(item => item.__key === selectedKey)
            _state = data
            wrapper.empty()
            wrapper.append(SelectItem())
            data.forEach((item) => {
                const _item = SelectItem(item)
                wrapper.append(_item)
            })
            wrapper.append(SelectItem())
            wrapper.el.scrollTop = (index) * 60
        }
    })
}