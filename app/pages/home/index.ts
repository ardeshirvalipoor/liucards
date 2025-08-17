import { Page } from '../shared/page'
import { HomeHeader } from './shared/header'
import { Div } from '../../base/components/native/div'
import { Timeline } from './shared/timeline/timeline'

export const HomePage = () => {

    const base = Page()
    base.append()

    const header = HomeHeader()
    base.append(header)

    const timeline = Timeline()
    base.append(timeline)

    base.on('enter', () => {
        console.log('home enter');
        
        timeline.load()
    })

    return base
}