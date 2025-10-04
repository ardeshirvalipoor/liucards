import { Router } from 'express'
import handlers from '../handlers'
import middlewares from '../middlewares'

export const router = Router()

router.use(middlewares.auth.requireUserOrDevice)
router.get('/queue', handlers.reviews.getQueue)
router.post('/', handlers.reviews.post)

router.post('/sessions/start', handlers.studySessions.start)
router.post('/sessions/end', handlers.studySessions.end)

export default router

    
