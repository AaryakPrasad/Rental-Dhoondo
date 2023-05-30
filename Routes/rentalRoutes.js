const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Rental = require('../models/rentals')
const { isLoggedIn, isAuthor, validateRental } = require('../public/js/middleware')

router.get('/new', isLoggedIn, (req, res) => {
    res.render('rentals/new')
})
router.post('/', isLoggedIn, validateRental, catchAsync(async (req, res, next) => {
    const newRental = new Rental(req.body.rental)
    newRental.author = req.user._id;
    await newRental.save()
    req.flash('success', 'Successfully created new rental vehicle')
    res.redirect(`/rentals/${newRental._id}`)
}))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    if (!foundRental) {
        req.flash('error', 'Cannot find that rental')
        return res.redirect('/rentals')
    }
    res.render('rentals/edit', { foundRental })
}))
router.put('/:id', validateRental, isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Rental.findByIdAndUpdate(id, req.body.rental, { runValidators: true })
    req.flash('success', 'Successfully updated rental details')
    res.redirect(`/rentals/${id}`)
}))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedRental = await Rental.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted rental')
    res.redirect('/rentals')
}))
router.get('/', catchAsync(async (req, res) => {
    const rentals = await Rental.find({})
    res.render('rentals/index', { rentals })
}))
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!foundRental) {
        req.flash('error', 'Cannot find that rental')
        return res.redirect('/rentals')
    }
    res.render('rentals/show', { foundRental })
}))

module.exports = router;