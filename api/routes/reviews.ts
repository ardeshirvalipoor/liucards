import { Router } from 'express'
import controllers from '../handlers'
import middlewares from '../middlewares'

export const router = Router()

router.use(middlewares.auth.optional)
router.get('/queue', controllers.reviews.getQueue)
router.post('/', controllers.reviews.post)

router.post('/sessions/start', controllers.studySessions.start)
router.post('/sessions/end', controllers.studySessions.end)


export default router

    
