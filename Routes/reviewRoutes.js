const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Rental = require('../models/rentals')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas')


const validateReview = (req, res, next) => {
    if (!req.body.review) { throw new ExpressError('Incomplete data', 400) }
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    const review = new Review(req.body.review)
    rental.reviews.push(review);
    review.save();
    rental.save();
    req.flash('success', 'Successfully created new review')
    res.redirect(`/rentals/${req.params.id}`)
}))
router.delete('/:reviewID', catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/rentals/${req.params.id}`)
}))

module.exports = router;