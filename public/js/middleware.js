const Rental = require('../../models/rentals')
const Review = require('../../models/review')
const ExpressError = require('../../utils/ExpressError')
const { reviewSchema, rentalSchema } = require('../../schemas')

const validateRental = (req, res, next) => {
    if (!req.body.rental) { throw new ExpressError('Incomplete data', 400) }
    const { error } = rentalSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}


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


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first.')
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login')
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo && req.method === 'GET') {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id);
    if (!foundRental.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/rentals/${id}`)
    }
    next();
}


const isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const foundReview = await Review.findById(reviewID);
    if (!foundReview.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/rentals/${id}`)
    }
    next();
}
module.exports = { isLoggedIn, storeReturnTo, isAuthor, isReviewAuthor, validateRental, validateReview };