const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateRental } = require('../public/js/middleware')
const { index, renderNewRental, createRental, renderEditRental, updateRental, deleteRental, showRental } = require('../controllers/rentals')
const multer = require('multer')
const { cloudinary, storage } = require('../cloudinary')
const upload = multer({ storage })


router.get('/new', isLoggedIn, renderNewRental)

router.post('/', isLoggedIn, upload.array('image'), validateRental, catchAsync(createRental))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditRental))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateRental, catchAsync(updateRental))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteRental))

router.get('/', catchAsync(index))

router.get('/:id', catchAsync(showRental))

module.exports = router;