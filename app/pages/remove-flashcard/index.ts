import { Div } from '../../base/components/native/div'
import { EASE } from '../../base/helpers/style'
import ldb from '../../base/lib/ldb'
import router, { IRouteParams } from '../../base/lib/router'
import { waitFor } from '../../base/utils/wait'
import helpers from '../../helpers'
import services from '../../services'
import { emitter } from '../../services/emitter'
import { DButton } from '../shared/d-button'
import { DInput } from '../shared/d-input'
import { PageHeader } from '../shared/page-header'
import { baseStyle } from './index.style'

export const RemoveFlashcardPage = () => {

    let id = ''
    const base = Div()
    base.cssClass(baseStyle)

    const title = PageHeader('Delete Flashcard')
    base.append(title)

    const submit = DButton()
    submit.cssClass({
        padding: '10px 20px',
        backgroundColor: '#d11228ff',
        marginTop: '100px'
    })
    submit.text('I am sure, delete it')
    base.append(submit)

    submit.el.onclick = async () => {
        submit.style({ opacity: '0.5', pointerEvents: 'none' })
        submit.text('Saving...')
        const cardData = {
            device_id: ldb.get('liucards-device-id'),
            id
        }
        const locale = ldb.get(`liucards-card-${id}`)
        if (locale) {
            ldb.remove(`liucards-card-${id}`)
        }
        try {
            await services.cards.remove(cardData)
        } catch (error) {
            console.error('Failed to update card:', error)
            alert('Failed to update card. Please try again.')
            submit.style({ opacity: '1', pointerEvents: 'auto' })
            submit.text('Update')
            return
        }
        emitter.emit('card-removed', { id })
        router.goto('/') // temp
        submit.style({ opacity: '1', pointerEvents: 'auto' })
        submit.text('Update')
    }

    return Object.assign(base, {
        ...base,
        async exit({ to = '' }: IRouteParams) {
            base.style(helpers.styles.PAGE_EXIT)
        },
        async enter({ from = '', params = { cardId: '' } }: IRouteParams) {
            // temp solution:
            await waitFor(200)
            console.log('edit enter', params);
            id = params.id

            const card = await services.cards.getById(id)
            console.log('edit enter', card);

            base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

        }
    })
}
