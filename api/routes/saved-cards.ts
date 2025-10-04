
import { Router, Request, Response, NextFunction } from 'express'
import handlers from '../handlers'
import middlewares from '../middlewares'

const router = Router()

router.post('/', middlewares.auth.requireUserOrDevice, handlers.savedCards.save)
router.delete('/:id', middlewares.auth.requireUserOrDevice, handlers.savedCards.unsave)

export default router


