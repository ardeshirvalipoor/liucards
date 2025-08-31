import { Div } from '../../base/components/native/div'
import { EASE } from '../../base/helpers/style'
import ldb from '../../base/lib/ldb'
import router, { IRouteParams } from '../../base/lib/router'
import { waitFor } from '../../base/utils/wait'
import helpers from '../../helpers'
import services from '../../services'
import { DButton } from '../shared/d-button'
import { DInput } from '../shared/d-input'
import { PageHeader } from '../shared/page-header'
import { baseStyle } from './index.style'

export const EditFlashcardPage = () => {

	let id = ''
	const base = Div()
	base.cssClass(baseStyle)

	const title = PageHeader('Edit Flashcard')
	base.append(title)

	const question = DInput('Question', 'Question', { type: 'textarea' })
	question.style({ marginTop: '30px' })
	base.append(question)

	const hr = Div()
	hr.cssClass({
		height: '1px',
		backgroundColor: '#00000022',
		width: '100%'
	})
	base.append(hr)

	const answer = DInput('Answer', 'Answer', { type: 'textarea' })
	base.append(answer)

	const submit = DButton()
	submit.cssClass({
		padding: '10px 20px',
		backgroundColor: '#0bbba4',
		marginTop: '20px'
	})
	submit.text('Update')
	base.append(submit)

	submit.el.onclick = async () => {
		submit.style({ opacity: '0.5', pointerEvents: 'none' })
		submit.text('Saving...')
		const cardData = {
			front: question.getValue(),
			back: answer.getValue(),
			device_id: ldb.get('liucards-device-id'),
			id
		}
		const locale = ldb.get(`liucards-card-${id}`)
		if (locale) {
			ldb.set(`liucards-card-${id}`, { front: question.getValue(), back: answer.getValue() })
		}
		await services.cards.update(cardData)
		router.goto('/') // temp
		question.setValue('')
		answer.setValue('')
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

			if (card) {
				question.setValue(card.front)
				answer.setValue(card.back)
			}
			setTimeout(() => {
				question.focus()
			}, 500);
			// if (from === '/menu') {
			//     base.style({ ...helpers.styles.PAGE_EXIT, ...EASE(0) })
			// }
			base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

		}
	})
}
