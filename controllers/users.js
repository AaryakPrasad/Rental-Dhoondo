const User = require('../models/user')

const renderRegister = (req, res) => {
    res.render('auth/register')
}

const registerUser = async (req, res, next) => {
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
        if (error.code === 11000) {
            error.message = 'User with that email already exists!'
            req.flash('error', error.message)
            res.redirect('/register')
        } else {
            req.flash('error', error.message)
            res.redirect('/register')
        }
    }
}

const renderLogin = (req, res) => {
    res.render('auth/login')
}

const authenticateUser = async (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/rentals'
    res.redirect(redirectUrl)
}

const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged you out!')
        res.redirect('/')
    });
}

module.exports = { renderLogin, registerUser, renderRegister, authenticateUser, logoutUser }