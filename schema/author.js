const mongoose = require('mongoose');

// Author Schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true
    },
    books: [String]
});

// Author Model
const AuthorModel = mongoose.model('authors', AuthorSchema);

module.exports = AuthorModel;