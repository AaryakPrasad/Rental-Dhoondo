if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')
const rentalRoutes = require('./Routes/rentalRoutes')
const reviewRoutes = require('./Routes/reviewRoutes')
const userRoutes = require('./Routes/authRoutes')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')
const dbURl = process.env.DB_URL
const secret = process.env.SESSION_SECRET

mongoose.set('strictQuery', false);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)
app.listen(3000, () => {
    console.log('Listening on port 3000.')
})

async function main() {
    await mongoose.connect(dbURl)
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

app.use(helmet({ contentSecurityPolicy: false }))

const store = MongoStore.create({
    mongoUrl: dbURl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7) // 1 week in miliseconds
    }
}
app.use(session(sessionConfig))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use(flash())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.get('/', (req, res) => {
    res.render('rentals/home')
})

app.use('/rentals', rentalRoutes)
app.use('/rentals/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { message, statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong :('
    res.status(statusCode).render('error', { err })
    res.send(message)
})
