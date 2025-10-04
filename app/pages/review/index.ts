import { Div } from "../../base/components/native/div";
import { EASE } from "../../base/helpers/style";
import ldb from "../../base/lib/ldb";
import { IRouteParams } from "../../base/lib/router";
import { waitFor } from "../../base/utils/wait";
import { ReviewCard } from "../../components/card/review-card";
import helpers from "../../helpers";
import services from "../../services";
import { Body } from "../shared/body";
import { Loader } from "../shared/loader";
import { PageHeader } from "../shared/page-header";

export const ReviewPage = () => {
    const base = Div()
    const title = PageHeader('Study time')
    const body = Body()
    body.style({ padding: '0', scrollBehavior: 'smooth' })
    base.append(title, body)

    base.cssClass(helpers.styles.PAGE_BASE)
    //

    async function render(fresh = true) {
        console.log('in render');
        
        if (fresh) {
            body.empty() // for now
            const loading = Loader()
            body.append(loading)
        }
        const cardData = await services.reviews.loadMoreCardsToReview()
        if (fresh) {
            body.empty() // for now
        }   

        if (!cardData) {
            const done = Div('\n\n\nNo cards to review, Good job!')
            done.cssClass({
                padding: '200px 100px',
                textAlign: 'center',
                color: '#888',
                fontSize: '18px'
            })
            body.append(done)
            body.el.scrollTop = body.el.scrollHeight
            return
        }
        const reviewCard = ReviewCard(cardData)
        reviewCard.on('iKnow', async () => {
            const cards_correct = ldb.get('liu-cards-correct') || 0
            ldb.set('liu-cards-correct', cards_correct + 1)
            const cards_studied = ldb.get('liu-cards-studied') || 0
            ldb.set('liu-cards-studied', cards_studied + 1)
            const total_time_ms = ldb.get('liu-total-time-ms') || 0
            ldb.set('liu-total-time-ms', total_time_ms + 1000)
            await services.reviews.submitReview(cardData.saved_card_id, { correct: true, think_time_ms: 1000, duration_ms: 1000, confidence: 2, rating: 2 })
            render(false)
        })
        reviewCard.on('dontKnow', async () => {
            services.reviews.submitReview(cardData.saved_card_id, { correct: false, think_time_ms: 2000, duration_ms: 2000, confidence: 1, rating: 1 })
            const cards_studied = ldb.get('liu-cards-studied') || 0
            ldb.set('liu-cards-studied', cards_studied + 1)
            const total_time_ms = ldb.get('liu-total-time-ms') || 0
            ldb.set('liu-total-time-ms', total_time_ms + 2000)
            render(false)
        })

        body.append(reviewCard)
        body.el.scrollTop = body.el.scrollHeight
    }

    return Object.assign(base, {
        async exit({ to = '' }: IRouteParams) {
            base.style(helpers.styles.PAGE_EXIT)
        },
        async enter({ from = '' }: IRouteParams) {
            await waitFor(200)
            render()

            // if (from === '/menu') {
            //     base.style({ ...helpers.styles.PAGE_EXIT, ...EASE(0) })
            // }
            base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

        }
    })
}
