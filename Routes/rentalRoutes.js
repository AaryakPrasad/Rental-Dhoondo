const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Rental = require('../models/rentals')
const ExpressError = require('../utils/ExpressError')
const { rentalSchema } = require('../schemas')


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

router.get('/new', (req, res) => {
    res.render('rentals/new')
})
router.post('/', validateRental, catchAsync(async (req, res, next) => {
    const newRental = new Rental(req.body.rental)
    await newRental.save()
    req.flash('success', 'Successfully created new rental vehicle')
    res.redirect(`/rentals/${newRental._id}`)
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    if (!foundRental) {
        req.flash('error', 'Cannot find that rental')
        res.redirect('/rentals')
    }
    res.render('rentals/edit', { foundRental })
}))
router.put('/:id', validateRental, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Rental.findByIdAndUpdate(id, req.body.rental, { runValidators: true })
    req.flash('success', 'Successfully updated rental details')
    res.redirect(`/rentals/${id}`)
}))
router.delete('/:id', catchAsync(async (req, res) => {
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
    const foundRental = await Rental.findById(id).populate('reviews')
    if (!foundRental) {
        req.flash('error', 'Cannot find that rental')
        res.redirect('/rentals')
    }
    res.render('rentals/show', { foundRental })
}))

module.exports = router;