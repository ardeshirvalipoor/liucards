import { Div } from '../../../../base/components/native/div'
import { Img } from '../../../../base/components/native/img'
import ldb from '../../../../base/lib/ldb'
import state from '../../../../base/services/state'
import images from '../../../../configs/images'
import services from '../../../../services'
import { Loader } from '../../../shared/loader'
import { Loading } from '../../../shared/loading'
import { TimelineItem } from './timeline-item'
import { baseStyle } from './timeline.style'

export const Timeline = () => {

	const base = Div()
	base.cssClass(baseStyle)

	base.el.addEventListener('scroll', handleScrollStart)
	base.el.addEventListener('scrollend', handleScrollEnd)

	// load()
 	base.append(Loader())
	async function load() {
		const localCards = ldb.get('liucards-cards') || []
		const cards = await services.timeline.loadMoreCards() as any[]
		base.empty();
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
