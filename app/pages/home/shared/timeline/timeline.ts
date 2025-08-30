import { Div } from '../../../../base/components/native/div'
import ldb from '../../../../base/lib/ldb'
import state from '../../../../base/services/state'
import services from '../../../../services'
import { TimelineItem } from './timeline-item'
import { baseStyle } from './timeline.style'

export const Timeline = () => {

	const base = Div()
	base.cssClass(baseStyle)

	base.el.addEventListener('scroll', handleScrollStart)
	base.el.addEventListener('scrollend', handleScrollEnd)

	// load()

	async function load() {
		base.empty()
		const localCards = ldb.get('liucards-cards') || []
		console.log(localCards);

		const cards = await services.timeline.loadMoreCards() as any[]
		[...localCards.reverse(), ...cards].forEach(card => {
			const item = TimelineItem(card)
			base.append(item)
		})
	}

	function handleScrollStart() {
		state.set('timeline-scrolling', true)
	}

	function handleScrollEnd() {
		state.set('timeline-scrolling', false)
	}

	return { ...base, load }
}
