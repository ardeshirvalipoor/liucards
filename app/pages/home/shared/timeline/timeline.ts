import { Div } from '../../../../base/components/native/div'
import { Img } from '../../../../base/components/native/img'
import ldb from '../../../../base/lib/ldb'
import state from '../../../../base/services/state'
import images from '../../../../configs/images'
import services from '../../../../services'
import { emitter } from '../../../../services/emitter'
import { Loader } from '../../../shared/loader'
import { Loading } from '../../../shared/loading'
import { TimelineItem } from './timeline-item'
import { baseStyle } from './timeline.style'

let _cards: { [key: string]: any } = {}
export const Timeline = () => {

	const base = Div()
	base.cssClass(baseStyle)

	base.el.addEventListener('scroll', handleScrollStart)
	base.el.addEventListener('scrollend', handleScrollEnd)

	// load()
	base.append(Loader())

	emitter.on('flashcard-added', (card: any) => {
		console.log('>>> new card added', card);
		
		const item = TimelineItem(card)
		services.cards.setCacheItem(card.id, card)
		_cards[card.id] = item
		base.prepend(item)
		setTimeout(() => {
			
			base.el.scrollTo({ top: 0, behavior: 'smooth' })
		}, 600);
	})
	emitter.on('card-removed', ({ id }) => {
		console.log('>>> card removed event', id, _cards[id]);
		setTimeout(() => {
			base.el.scrollTo({   top: _cards[id]?.el?.clientHeight, behavior: 'smooth' })
			_cards[id]?.remove()
			delete _cards[id]

		}, 600);
	})
	emitter.on('card-updated', ({ id }) => {
		console.log('>>> card updated event', id, _cards[id]);
		setTimeout(() => {
			const cached = services.cards.getCacheItem(id)
			const card = _cards[id]
			card.update(cached)
		}, 200);
	})
	async function load() {
		console.log('Loading timeline...');
		
		const localCards = ldb.get('liucards-cards') || []
		const cards = await services.timeline.loadMoreCards() as any[]
		base.empty();
		[...localCards.reverse(), ...cards].forEach(card => {
			const item = TimelineItem(card)
			_cards[card.id] = item
			base.append(item)
		})
		console.log('Cards loaded', _cards);
		
	}

	function handleScrollStart() {
		state.set('timeline-scrolling', true)
	}

	function handleScrollEnd() {
		state.set('timeline-scrolling', false)
	}

	return { ...base, load }
}
