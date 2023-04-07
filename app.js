const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const Rental = require('./models/rentals')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
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

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/rentals/new', (req, res) => {
    res.render('rentals/new')
})
app.post('/rentals', async (req, res) => {
    const newRental = new Rental(req.body)
    await newRental.save()
    res.redirect(`/rentals/${newRental._id}`)
})
app.get('/rentals/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    res.render('rentals/edit', { foundRental })
})
app.put('/rentals/:id', async (req, res) => {
    const { id } = req.params;
    await Rental.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/rentals/${id}`)
})
app.get('/rentals', async (req, res) => {
    const rentals = await Rental.find({})
    res.render('rentals/index', { rentals })
})
app.get('/rentals/:id', async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    res.render('rentals/show', { foundRental })
})
app.delete('/rentals/:id', async (req, res) => {
    const { id } = req.params;
    const deletedRental = await Rental.findByIdAndDelete(id)
    res.redirect('/rentals')
})
