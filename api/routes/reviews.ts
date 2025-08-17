import { Router } from 'express'
import controllers from '../controllers'
import middlewares from '../middlewares'

export const reviewsRouter = Router()

reviewsRouter.use(middlewares.auth.required)
reviewsRouter.get('/queue', controllers.reviews.getQueue)
reviewsRouter.post('/', controllers.reviews.post)



export default reviewsRouter

    
