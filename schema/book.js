const mongoose = require('mongoose');

//Create a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPages: Number,
    category: [String],
    publication: Number,
});

const BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel;