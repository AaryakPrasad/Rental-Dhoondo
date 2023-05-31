const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../public/js/middleware')
const { createReview, deleteReview } = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(createReview))

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;