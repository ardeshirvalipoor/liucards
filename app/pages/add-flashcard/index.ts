import { Div } from '../../base/components/native/div'
import { EASE } from '../../base/helpers/style'
import ldb from '../../base/lib/ldb'
import router, { IRouteParams } from '../../base/lib/router'
import { waitFor } from '../../base/utils/wait'
import { AddAudio } from '../../components/add-audio/add-audio'
import helpers from '../../helpers'
import services from '../../services'
import { DButton } from '../shared/d-button'
import { DInput } from '../shared/d-input'
import { PageHeader } from '../shared/page-header'
import { baseStyle } from './index.style'

export const AddFlashcardPage = () => {
    const base = Div()
    base.cssClass(baseStyle)

    const title = PageHeader('Add Flashcard')
	base.append(title)

	const question = DInput('Question', 'Question', { type: 'textarea' })
	question.style({ marginTop: '30px' })
    base.append(question)

	const frontAudio = AddAudio()
	base.append(frontAudio)
	question.el.oninput = () => {
		frontAudio.setText(question.getValue())
	}

	const hr = Div()
	hr.cssClass({
		height: '1px',
		margin: '20px 0',
		backgroundColor: '#00000022',
		width: '100%'
	})
	base.append(hr)

	const answer = DInput('Answer', 'Answer', { type: 'textarea' })
    base.append(answer)

	const backAudio = AddAudio()
	base.append(backAudio)
	backAudio.el.oninput = () => {
		backAudio.setText(answer.getValue())
	}

	const submit = DButton()
	submit.cssClass({
		padding: '10px 20px',
		backgroundColor: '#0bbba4',
		marginTop: '20px'
	})
	submit.text('Save')
    base.append(submit)

	submit.el.onclick = async () => {
		if (!question.getValue() || !answer.getValue()) return
		submit.style({ opacity: '0.5', pointerEvents: 'none' })
		submit.text('Saving...')
		const cardData = {
			front: question.getValue(),
			back: answer.getValue(),
			front_audio_url: frontAudio.getUrl(),
			back_audio_url: backAudio.getUrl(),
			device_id: ldb.get('liucards-device-id')
		}
		console.log('card data', cardData);
		await services.cards.save(cardData)
		question.setValue('')
		answer.setValue('')
		submit.style({ opacity: '1', pointerEvents: 'auto' })
		submit.text('Save')
		frontAudio.resetUI()
		backAudio.resetUI()
		router.back()
	}

    return Object.assign(base, {
        ...base,
        async exit({ to = '' }: IRouteParams) {
            base.style(helpers.styles.PAGE_EXIT)
        },
        async enter({ from = '' }: IRouteParams) {
            await waitFor(200)
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
