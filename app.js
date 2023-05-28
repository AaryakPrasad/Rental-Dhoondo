const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const ExpressError = require('./utils/ExpressError')

const rentals = require('./Routes/rentalRoutes')
const reviews = require('./Routes/reviewRoutes')


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)
app.listen(3000, () => {
    console.log('Listening on port 3000.')
})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Rental-dhundo')
        .then(() => {
            console.log("Connected to Mongodb!")
        })
        .catch(() => {
            console.log('MongoDB connection error.')
        })
} main();


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: '***ChangeThisInProduction***',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7) // 1 week in miliseconds
    }
}
app.use(session(sessionConfig))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.get('/', (req, res) => {
    res.render('home')
})

app.use('/rentals', rentals)
app.use('/rentals/:id/reviews', reviews)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { message, statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong :('
    res.status(statusCode).render('error', { err })
    res.send(message)
})
