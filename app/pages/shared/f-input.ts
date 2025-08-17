import { Base } from '../../base/components/base'
import { Div } from '../../base/components/native/div'
import { Input } from '../../base/components/native/input'
import { isRTL } from '../../base/helpers/locales'
import { ABSOLUTE, EASE } from '../../base/helpers/style'
import helpers from '../../helpers'

export type FInputOptions = {
    type?: string
    inputmode?: string
}

export const FInput = (title: string, placeholder: string, options: FInputOptions = {}) => {

    const type = options.type || 'text'

    const base = Base()
    base.cssClass({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: '200px',
        marginBottom: '20px',
        transition: 'all 0.2s',
    })

    const titleEl = Div(title)
    titleEl.cssClass({
        fontSize: '20px',
        transition: 'opacity 0.2s',
        fontWeight: 'bold',
        height: '60px',
    })
    base.append(titleEl)

    const placeholderEl = Div(placeholder)
    placeholderEl.cssClass({
        ...ABSOLUTE,
        height: '56px',
        display: 'flex',
        fontSize: '32px',
        right: '0px',
        left: '0px',
        top: '49px',
        color: '#00000022',
        pointerEvents: 'none',
        letterSpacing: options.inputmode === 'numeric' ? '5px' : '0',
    })
    base.append(placeholderEl)

    const inputEl = Input('')
    inputEl.cssClass({
        height: '36px',
        width: '100%',
        fontSize: '32px',
        border: 'none',
        letterSpacing: options.inputmode === 'numeric' ? '5px' : '0',
    })
    base.append(inputEl)

    placeholderEl.el.textContent = helpers.locale.replaceLatinDigits(placeholder)
    placeholderEl.el.setAttribute('role', 'placeholder')
    placeholderEl.el.setAttribute('dir', 'auto')
    let firstChar = (placeholder || '').toString().trim().charAt(0);
    inputEl.el.setAttribute('dir', isRTL(firstChar) ? 'rtl' : 'ltr')
    inputEl.el.setAttribute('type', type)
    inputEl.on('key', (data: any) => base.emit('key', data))
    inputEl.on('key-enter', () => base.emit('key-enter'))
    inputEl.on('input', (payload: any) => {
        inputEl.el.value = helpers.locale.replaceLatinDigits(inputEl.getValue())
        base.emit('input', { value: inputEl.getValue(), event: payload.event })
        placeholderEl.style({ opacity: (inputEl.getValue().length > 0 ? '0' : '1') })
    })

    return Object.assign(base, {
        focus() { return inputEl.focus() },
        clear() { return inputEl.clear() },
        getValue() { return inputEl.getValue() },
        setValue(v: any) { return inputEl.setValue(v) },
        placeholder: placeholderEl,
        input: inputEl,
        title: titleEl,
        // setError(v: string) { return e.el.innerText = v },
    })
}

