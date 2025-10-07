import { Page } from '../shared/page'
import { HomeHeader } from './shared/header'
import { Div } from '../../base/components/native/div'
import { Timeline } from './shared/timeline/timeline'
import { IRouteInitParams, IRouteParams } from '../../base/lib/router'
import helpers from '../../helpers'
import { waitFor } from '../../base/utils/wait'

export const HomePage = () => {

    const base = Page()
    base.append()

    const header = HomeHeader()
    base.append(header)

    const timeline = Timeline()
    base.append(timeline)
    setTimeout(() => {
        
        timeline.load()
    }, 100);

    // return base
    async function enter({ query, from, to, data, params }: IRouteParams) {
        await waitFor(helpers.styles.PAGE_TRANSITION_DURATION)
        base.style(helpers.styles.PAGE_ENTER)

        if (from?.startsWith('/flashcards/edit')) {
            console.log('>>> returning');
        }
        if (!from?.startsWith('/add-flashcard')) {
            console.log('>>> loading timeline', from);
            // temp
            // timeline.load()
        }
    }
    return Object.assign(base, {
        enter



    })
}