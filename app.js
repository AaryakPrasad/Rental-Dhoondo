const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Rental = require('./models/rentals')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { rentalSchema } = require('./schemas')

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


app.get('/', (req, res) => {
    res.render('home')
})
app.get('/rentals/new', (req, res) => {
    res.render('rentals/new')
})
app.post('/rentals', validateRental, catchAsync(async (req, res, next) => {
    const newRental = new Rental(req.body.rental)
    await newRental.save()
    res.redirect(`/rentals/${newRental._id}`)
}))
app.get('/rentals/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    res.render('rentals/edit', { foundRental })
}))
app.put('/rentals/:id', validateRental, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Rental.findByIdAndUpdate(id, req.body.rental, { runValidators: true })
    res.redirect(`/rentals/${id}`)
}))
app.get('/rentals', catchAsync(async (req, res) => {
    const rentals = await Rental.find({})
    res.render('rentals/index', { rentals })
}))
app.get('/rentals/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    res.render('rentals/show', { foundRental })
}))
app.delete('/rentals/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedRental = await Rental.findByIdAndDelete(id)
    res.redirect('/rentals')
}))
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { message, statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong :('
    res.status(statusCode).render('error', { err })
    res.send(message)
})
