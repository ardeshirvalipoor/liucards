import { Base } from '../../base/components/base'
import { Div } from '../../base/components/native/div'
import { Input } from '../../base/components/native/input'
import { isRTL } from '../../base/helpers/locales'
import { ABSOLUTE, EASE } from '../../base/helpers/style'
import helpers from '../../helpers'

export type DInputOptions = {
    type?: string
    size?: number
    pattern?: string
    inputmode?: string
    dir?: string
    isLatin?: boolean
}

export const DInput = (title: string, placeholder: string, options: DInputOptions = {}) => {

    const type = options.type || 'text'
    const size = options.size || 24
    const titleHeight = 50

    const base = Base()
    const t = Div(title)
    const p = Div(placeholder)
    const i = Input('')
    const e = Div('') // replace with editable component
    base.append(t, p)
    if (options.type === 'textarea') base.append(e)
    else base.append(i)

    p.el.textContent = helpers.locale.replaceLatinDigits(placeholder)
    e.el.setAttribute('contenteditable', 'true')
    p.el.setAttribute('role', 'placeholder')
    p.el.setAttribute('dir', options.dir || 'auto')
    let firstChar = (placeholder || '').toString().trim().charAt(0);
    i.el.setAttribute('dir', options.dir || (isRTL(firstChar) ? 'rtl' : 'ltr'))
    i.el.setAttribute('type', type)
    if (options.pattern) i.el.setAttribute('pattern', options.pattern || '')
    if (options.inputmode) i.el.setAttribute('inputmode', options.inputmode || 'text')
    i.on('input', (payload: any) => {
        if (!options.isLatin) i.el.value = helpers.locale.replaceLatinDigits(i.getValue())
        base.emit('input', { value: i.getValue(), event: payload.event })
        p.style({ opacity: (i.getValue().length > 0 ? '0' : '1') })
    })
    e.el.addEventListener('input', (payload: any) => {
        base.emit('input', e.el.innerHTML)
        p.style({ opacity: (e.el.innerHTML !== '<br>' ? '0' : '1') })
    })
    e.el.addEventListener('paste', (e: any) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        const selection = window.getSelection()
        if (!selection?.rangeCount) return
        selection.deleteFromDocument()
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
    })

    if (e.el.innerHTML !== '') p.style({ opacity: '0' })
    if (i.getValue().length > 0) p.style({ opacity: '0' })
    i.on('key', (data: any) => base.emit('key', data))
    i.on('key-enter', () => base.emit('key-enter'))

    i.cssClass({
        height: '46px',
        fontSize: size + 'px',
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        border: 'none',
        letterSpacing: options.inputmode === 'numeric' ? '5px' : '0',
    })

    e.cssClass({
        height: '100%',
        fontSize: size + 'px',
        width: '100%',
        border: 'none',
        padding: '25px',
        margin: '0px',
        resize: 'none',
        overflow: 'hidden',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        outline: 'none',
        position: 'relative',
        zIndex: '1',
    })
    p.cssClass({
        ...ABSOLUTE,
        height: '46px',
        top: '57px',
        right: '0px',
        left: '0px',
        width: '100%',
        textAlign: 'center',
        fontSize: size + 'px',
        color: '#00000022',
        pointerEvents: 'none',
        zIndex: '0',
        letterSpacing: options.inputmode === 'numeric' ? '5px' : '0',
    })
    setTimeout(() => {
        p.style({
            // Todo: fix this
            opacity: (e.el.innerHTML !== '' || i.getValue().length > 0) ? '0' : '1',
        })
    }, 1);
    t.cssClass({
        opacity: '0', //temp hide
        fontSize: '20px',
        height: titleHeight + 'px',
        transition: 'opacity 0.2s',
        fontWeight: 'bold'
    })
    base.cssClass({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: '200px',
        // marginBottom: '20px',
        transition: 'all 0.2s',
    })

    return Object.assign(base, {
        focus() {
            const el = options.type === 'textarea' ? e.el : i.el
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false); // Collapse the range to the end point

            // Get the current selection and remove any existing ranges
            const selection = window.getSelection();
            selection?.removeAllRanges();

            // Add the new range to the selection
            selection?.addRange(range);
            el.focus();

        },
        clear() { return options.type === 'textarea' ? e.el.innerHTML = '' : i.clear() },
        getValue() { return options.type === 'textarea' ? e.el.innerHTML : i.getValue() },
        setValue(v: any = '') {
            if (v.length > 0) p.style({ opacity: '0' })
            return options.type === 'textarea' ? e.el.innerHTML = v : i.setValue(v)
        },
        placeholder: p,
        input: i,
        // setError(v: string) { return e.el.innerText = v },
    })
}

