const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

RentalSchema.post('findOneAndDelete', async function (doc) {
    console.log(doc.reviews)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Rental', RentalSchema)