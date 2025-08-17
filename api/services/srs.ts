// // ========== src/services/srs.service.js ==========
// /**
//  * Spaced Repetition System Service
//  * Implements SM-2 algorithm with modifications
//  */

// class SRSService {
//   constructor() {
//     // Default parameters
//     this.config = {
//       initialEaseFactor: 2.5,
//       minEaseFactor: 1.3,
//       easyBonus: 1.3,
//       hardPenalty: 0.8,
//       lapseNewInterval: 0.5,
//       graduatingInterval: 1,
//       easyInterval: 4,
//     };
//   }

//   /**
//    * Calculate next review based on SM-2 algorithm
//    * @param {Object} currentState - Current review state
//    * @param {number} rating - User rating (0: again, 1: hard, 2: good, 3: easy)
//    * @returns {Object} Next review state
//    */
//   calculateNextReview(currentState, rating) {
//     const {
//       ease_factor = this.config.initialEaseFactor,
//       interval_days = 0,
//       repetitions = 0,
//       status = 'new',
//       lapses = 0,
//     } = currentState;

//     let newEaseFactor = ease_factor;
//     let newInterval = interval_days;
//     let newStatus = status;
//     let newRepetitions = repetitions;
//     let newLapses = lapses;

//     // Handle "Again" rating (failed recall)
//     if (rating === 0) {
//       newEaseFactor = Math.max(this.config.minEaseFactor, ease_factor - 0.2);
//       newInterval = 1; // Reset to 1 day
//       newStatus = 'relearning';
//       newLapses = lapses + 1;
//       newRepetitions = 0; // Reset repetitions
//     } else {
//       // Successful recall - adjust ease factor
//       newEaseFactor = this.adjustEaseFactor(ease_factor, rating);
//       newRepetitions = repetitions + 1;

//       // Calculate new interval based on status
//       if (status === 'new' || status === 'relearning') {
//         newInterval = this.getGraduatingInterval(rating, newRepetitions);
//         if (newInterval > 1) {
//           newStatus = 'review';
//         } else {
//           newStatus = 'learning';
//         }
//       } else {
//         // In review phase - use ease factor
//         newInterval = this.calculateInterval(interval_days, newEaseFactor, rating);
//         newStatus = 'review';
//       }
//     }

//     // Apply some randomness to prevent clustering (±5%)
//     newInterval = this.addFuzz(newInterval);

//     return {
//       ease_factor: parseFloat(newEaseFactor.toFixed(2)),
//       interval_days: Math.round(newInterval),
//       repetitions: newRepetitions,
//       status: newStatus,
//       lapses: newLapses,
//       due_date: this.calculateDueDate(newInterval),
//     };
//   }

//   /**
//    * Adjust ease factor based on rating
//    */
//   adjustEaseFactor(currentEase, rating) {
//     let adjustment = 0;
    
//     switch (rating) {
//       case 1: // Hard
//         adjustment = -0.15;
//         break;
//       case 2: // Good
//         adjustment = 0;
//         break;
//       case 3: // Easy
//         adjustment = 0.15;
//         break;
//     }

//     return Math.max(
//       this.config.minEaseFactor,
//       currentEase + adjustment
//     );
//   }

//   /**
//    * Calculate interval for cards in learning phase
//    */
//   getGraduatingInterval(rating, repetitions) {
//     if (rating === 3) {
//       // Easy - graduate immediately with bonus
//       return this.config.easyInterval;
//     }
    
//     if (repetitions === 1) {
//       return rating === 2 ? 1 : 0.4; // Good: 1 day, Hard: ~10 hours
//     } else if (repetitions === 2) {
//       return rating === 2 ? 3 : 1; // Good: 3 days, Hard: 1 day
//     } else {
//       return rating === 2 ? 7 : 3; // Graduate to review
//     }
//   }

//   /**
//    * Calculate next interval for review cards
//    */
//   calculateInterval(currentInterval, easeFactor, rating) {
//     let multiplier = easeFactor;
    
//     // Apply rating modifiers
//     if (rating === 1) {
//       multiplier *= this.config.hardPenalty;
//     } else if (rating === 3) {
//       multiplier *= this.config.easyBonus;
//     }

//     // For very short intervals, use fixed progressions
//     if (currentInterval < 7) {
//       const progressions = {
//         1: [1, 3, 7],
//         2: [3, 7, 14],
//         3: [7, 14, 30],
//       };
      
//       const progression = progressions[rating] || progressions[2];
//       for (const interval of progression) {
//         if (interval > currentInterval) {
//           return interval;
//         }
//       }
//     }

//     // Standard calculation
//     return currentInterval * multiplier;
//   }

//   /**
//    * Add small random variation to prevent clustering
//    */
//   addFuzz(interval) {
//     if (interval < 2) return interval;
    
//     const fuzzRange = 0.05; // ±5%
//     const fuzz = 1 + (Math.random() * 2 - 1) * fuzzRange;
//     return interval * fuzz;
//   }

//   /**
//    * Calculate due date from interval
//    */
//   calculateDueDate(intervalDays) {
//     const due = new Date();
//     due.setDate(due.getDate() + intervalDays);
//     due.setHours(4, 0, 0, 0); // Set to 4 AM to avoid timezone issues
//     return due.toISOString();
//   }

//   /**
//    * Get review statistics for optimization
//    */
//   calculateReviewStats(reviews) {
//     if (!reviews || reviews.length === 0) {
//       return {
//         averageEase: this.config.initialEaseFactor,
//         retention: 1,
//         averageInterval: 1,
//       };
//     }

//     const stats = reviews.reduce((acc, review) => {
//       acc.totalEase += review.ease_after || this.config.initialEaseFactor;
//       acc.correct += review.rating > 0 ? 1 : 0;
//       acc.totalInterval += review.interval_after || 1;
//       return acc;
//     }, { totalEase: 0, correct: 0, totalInterval: 0 });

//     return {
//       averageEase: stats.totalEase / reviews.length,
//       retention: stats.correct / reviews.length,
//       averageInterval: stats.totalInterval / reviews.length,
//     };
//   }
// }

// export default new SRSService();

// // ========== src/controllers/reviews.controller.js ==========
// import reviewService from '../services/review.service.js';

// export const getDueCards = async (req, res, next) => {
//   try {
//     const userId = req.user?.id;
//     const { limit = 50, includeNew = true } = req.query;
    
//     if (!userId) {
//       return res.status(401).json({ error: 'Login required' });
//     }
    
//     const cards = await reviewService.getDueCards(userId, {
//       limit: parseInt(limit),
//       includeNew: includeNew === 'true',
//     });
    
//     res.json({ success: true, cards, count: cards.length });
//   } catch (error) {
//     next(error);
//   }
// };

// export const submitReview = async (req, res, next) => {
//   try {
//     const userId = req.user?.id;
//     const { 
//       card_id, 
//       rating, 
//       duration_ms,
//       correct,
//       confidence,
//       hint_used 
//     } = req.body;
    
//     if (!userId) {
//       return res.status(401).json({ error: 'Login required' });
//     }
    
//     const result = await reviewService.submitReview(userId, {
//       cardId: card_id,
//       rating,
//       durationMs: duration_ms,
//       correct,
//       confidence,
//       hintUsed: hint_used,
//     });
    
//     res.json({ success: true, nextReview: result });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getReviewStats = async (req, res, next) => {
//   try {
//     const userId = req.user?.id;
//     const { period = '7d' } = req.query;
    
//     if (!userId) {
//       return res.status(401).json({ error: 'Login required' });
//     }
    
//     const stats = await reviewService.getReviewStats(userId, period);
//     res.json({ success: true, stats });
//   } catch (error) {
//     next(error);
//   }
// };

// export default {
//   getDueCards,
//   submitReview,
//   getReviewStats,
// };

// // ========== src/services/review.service.js ==========
// import { supabaseAdmin } from '../config/supabase.js';
// import srsService from './srs.service.js';

// class ReviewService {
//   async getDueCards(userId, options = {}) {
//     const { limit = 50, includeNew = true } = options;
    
//     // Get cards that are due for review
//     let query = supabaseAdmin
//       .from('review_states')
//       .select(`
//         *,
//         cards!inner(id, front, back, tags)
//       `)
//       .eq('user_id', userId)
//       .lte('due_date', new Date().toISOString())
//       .order('due_date', { ascending: true })
//       .limit(limit);
    
//     if (!includeNew) {
//       query = query.neq('status', 'new');
//     }
    
//     const { data, error } = await query;
//     if (error) throw error;
    
//     // Format response
//     return data.map(item => ({
//       card_id: item.cards.id,
//       front: item.cards.front,
//       back: item.cards.back,
//       tags: item.cards.tags,
//       status: item.status,
//       ease_factor: item.ease_factor,
//       interval_days: item.interval_days,
//       due_date: item.due_date,
//     }));
//   }
  
//   async submitReview(userId, reviewData) {
//     const { cardId, rating, durationMs, correct, confidence, hintUsed } = reviewData;
    
//     // Get current state
//     const { data: currentState, error: stateError } = await supabaseAdmin
//       .from('review_states')
//       .select('*')
//       .eq('card_id', cardId)
//       .eq('user_id', userId)
//       .single();
    
//     if (stateError) throw stateError;
//     if (!currentState) throw new Error('Card not found in review states');
    
//     // Calculate next review
//     const nextState = srsService.calculateNextReview(currentState, rating);
    
//     // Start transaction
//     const updates = [];
    
//     // Log the review
//     updates.push(
//       supabaseAdmin
//         .from('review_logs')
//         .insert({
//           card_id: cardId,
//           user_id: userId,
//           rating,
//           duration_ms: durationMs,
//           ease_before: currentState.ease_factor,
//           ease_after: nextState.ease_factor,
//           interval_before: currentState.interval_days,
//           interval_after: nextState.interval_days,
//           correct,
//           confidence,
//           hint_used: hintUsed,
//         })
//     );
    
//     // Update review state
//     updates.push(
//       supabaseAdmin
//         .from('review_states')
//         .update({
//           ease_factor: nextState.ease_factor,
//           interval_days: nextState.interval_days,
//           repetitions: nextState.repetitions,
//           due_date: nextState.due_date,
//           last_reviewed_at: new Date().toISOString(),
//           status: nextState.status,
//           lapses: nextState.lapses,
//         })
//         .eq('card_id', cardId)
//         .eq('user_id', userId)
//     );
    
//     // Execute all updates
//     const results = await Promise.all(updates);
    
//     // Check for errors
//     for (const result of results) {
//       if (result.error) throw result.error;
//     }
    
//     return nextState;
//   }
  
//   async getReviewStats(userId, period = '7d') {
//     // Parse period
//     const days = parseInt(period) || 7;
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
    
//     // Get review logs
//     const { data: reviews, error } = await supabaseAdmin
//       .from('review_logs')
//       .select('*')
//       .eq('user_id', userId)
//       .gte('reviewed_at', startDate.toISOString())
//       .order('reviewed_at', { ascending: false });
    
//     if (error) throw error;
    
//     // Calculate statistics
//     const stats = {
//       totalReviews: reviews.length,
//       correctReviews: reviews.filter(r => r.rating > 0).length,
//       retention: 0,
//       averageInterval: 0,
//       averageEase: 0,
//       reviewsByDay: {},
//       reviewsByRating: { 0: 0, 1: 0, 2: 0, 3: 0 },
//     };
    
//     if (reviews.length > 0) {
//       stats.retention = (stats.correctReviews / stats.totalReviews) * 100;
      
//       // Group by day and rating
//       reviews.forEach(review => {
//         const day = new Date(review.reviewed_at).toISOString().split('T')[0];
//         stats.reviewsByDay[day] = (stats.reviewsByDay[day] || 0) + 1;
//         stats.reviewsByRating[review.rating]++;
        
//         stats.averageInterval += review.interval_after || 0;
//         stats.averageEase += review.ease_after || 2.5;
//       });
      
//       stats.averageInterval /= reviews.length;
//       stats.averageEase /= reviews.length;
//     }
    
//     return stats;
//   }
// }

// export default new ReviewService();

// // ========== src/routes/reviews.routes.js ==========
// import { Router } from 'express';
// import { requireAuth } from '../middleware/auth.middleware.js';
// import { validateReview } from '../middleware/validation.middleware.js';
// import reviewsController from '../controllers/reviews.controller.js';

// const router = Router();

// // All review routes require authentication
// router.use(requireAuth);

// // Get due cards for review
// router.get('/due', reviewsController.getDueCards);

// // Submit a review
// router.post('/', validateReview, reviewsController.submitReview);

// // Get review statistics
// router.get('/stats', reviewsController.getReviewStats);

// export default router;