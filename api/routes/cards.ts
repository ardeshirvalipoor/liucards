
import { Router, Request, Response, NextFunction } from 'express'
import handlers from '../handlers'
import middlewares from '../middlewares'

const router = Router()

router.post('/', middlewares.auth.requireUserOrDevice, handlers.cards.post)
router.put('/:id', middlewares.auth.requireUserOrDevice, handlers.cards.edit)
router.post('/find', middlewares.auth.requireUserOrDevice, handlers.cards.find)
router.get('/', middlewares.auth.requireUserOrDevice, handlers.cards.list)
export default router


