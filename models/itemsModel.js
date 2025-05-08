
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,

    },
    price: {
        type: Number,

    },
    image: {
        type: String,

    },
    description: {
        type: String,

    },
})

const ItemCollection = mongoose.model('Item', itemSchema);

module.exports = ItemCollection;