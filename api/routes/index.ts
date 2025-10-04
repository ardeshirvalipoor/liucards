import { Router } from 'express'
import cards from './cards'
import reviews from './reviews'
import savedCards from './saved-cards'

const router = Router({ strict: true })

router.get('/favicon.ico', (req, res) => res.end())
router.use('/api/v1/cards', cards)
router.use('/api/v1/saved-cards', savedCards)
router.use('/api/v1/reviews', reviews)

export default router