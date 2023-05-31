const Rental = require('../models/rentals')
const { cloudinary } = require('../cloudinary')

const index = async (req, res) => {
    const rentals = await Rental.find({})
    res.render('rentals/index', { rentals })
}

const showRental = async (req, res) => {
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
}

const renderNewRental = (req, res) => {
    res.render('rentals/new')
}

const createRental = async (req, res, next) => {
    const newRental = new Rental(req.body.rental)
    newRental.author = req.user._id;
    if (req.files.length > 5) {
        req.flash('error', 'You can only upload 5 images max')
        return res.redirect(`/rentals/new`)
    }
    newRental.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await newRental.save()
    console.log(newRental)
    req.flash('success', 'Successfully created new rental vehicle')
    res.redirect(`/rentals/${newRental._id}`)
}

const renderEditRental = async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    if (!foundRental) {
        req.flash('error', 'Cannot find that rental')
        return res.redirect('/rentals')
    }
    res.render('rentals/edit', { foundRental })
}

const updateRental = async (req, res) => {
    const { id } = req.params;
    const foundRental = await Rental.findById(id)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    foundRental.images.push(...imgs)
    if (foundRental.images.length > 5) {
        req.flash('error', 'You can only upload 5 images max')
        return res.redirect(`/rentals/${id}/edit`)
    }
    await foundRental.updateOne(id, req.body.rental)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await foundRental.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await foundRental.save()
    console.log(foundRental)

    req.flash('success', 'Successfully updated rental details')
    res.redirect(`/rentals/${id}`)
}

const deleteRental = async (req, res) => {
    const { id } = req.params;
    const deletedRental = await Rental.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted rental')
    res.redirect('/rentals')
}

module.exports = { index, renderNewRental, showRental, createRental, renderEditRental, updateRental, deleteRental }