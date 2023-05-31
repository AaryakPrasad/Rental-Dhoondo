const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../public/js/middleware');
const { registerUser, authenticateUser, logoutUser, renderRegister, renderLogin } = require('../controllers/users')

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(registerUser))

router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(authenticateUser))

router.get('/logout', logoutUser)

module.exports = router;