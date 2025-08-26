
import { Router, Request, Response, NextFunction } from 'express'
import controllers from '../controllers'
import middlewares from '../middlewares'

const router = Router()

router.post('/', middlewares.auth.optional, controllers.cards.post)
router.post('/search', middlewares.auth.optional, controllers.cards.search)
router.get('/', middlewares.auth.optional, controllers.cards.list)
export default router


