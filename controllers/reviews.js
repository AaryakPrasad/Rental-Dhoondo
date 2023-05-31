const Review = require('../models/review');
const Rental = require('../models/rentals');

const createReview = async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    rental.reviews.push(review);
    await review.save();
    await rental.save();
    req.flash('success', 'Successfully created new review')
    res.redirect(`/rentals/${req.params.id}`)
}

const deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/rentals/${req.params.id}`)
}

module.exports = { createReview, deleteReview }