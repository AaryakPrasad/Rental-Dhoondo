const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const ExpressError = require('../utils/ExpressError')
const passport = require('passport')
const { storeReturnTo } = require('../public/js/middleware');


router.get('/register', (req, res) => {
    res.render('auth/register')
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Rental Dhoondo!')
            res.redirect('/rentals')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}))
router.get('/login', (req, res) => {
    res.render('auth/login')
})
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/rentals'
    res.redirect(redirectUrl)
}))
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged you out!')
        res.redirect('/rentals')
    });

})

module.exports = router;