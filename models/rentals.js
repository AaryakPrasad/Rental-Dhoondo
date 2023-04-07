const mongoose = require('mongoose')
const schema = mongoose.Schema;

const RentalSchema = new schema({
    title: String,
    price: String,
    description: String,
    location: String
});
module.exports = mongoose.model('Rental', RentalSchema)