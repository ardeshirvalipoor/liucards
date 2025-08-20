import { Div } from "../../base/components/native/div";
import { EASE } from "../../base/helpers/style";
import { IRouteParams } from "../../base/lib/router";
import { waitFor } from "../../base/utils/wait";
import { ReviewCard } from "../../components/card/review-card";
import helpers from "../../helpers";
import services from "../../services";
import { Body } from "../shared/body";
import { PageHeader } from "../shared/page-header";

export const ReviewPage = () => {
    const base = Div()
    const title = PageHeader('Study time')
    const body = Body()
    body.style({ padding: '0', scrollBehavior: 'smooth' })
    base.append(title, body)

    base.cssClass(helpers.styles.PAGE_BASE)


    async function render() {
        const cardData = await services.reviews.loadMoreCardsToReview()
        console.log({ cardData });
        if (!cardData) {
            base.append(Div('No cards to review'))
            return
        }
        const reviewCard = ReviewCard(cardData)
        reviewCard.on('iKnow', ()=>{
            render()
        })
        reviewCard.on('dontKnow', () => {
            render()
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
            body.empty() // for now
            render()

            // if (from === '/menu') {
            //     base.style({ ...helpers.styles.PAGE_EXIT, ...EASE(0) })
            // }
            base.style({ ...helpers.styles.PAGE_ENTER, ...EASE(.16) }, 50)

        }
    })
}
