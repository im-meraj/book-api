const express = require('express');

const database = require('./database');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Book API');
})



// Route            - /book
// Description      - To get all the books
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
app.get("/book", (req, res) => {
  res.json({books: database.Books})
});

// Route            - /book/:bookID
// Description      - To get a specific book
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
app.get("/book/:bookID", (req, res) => {
  const getBook = database.Books.filter((book) => book.ISBN === req.params.bookID);
  
   return res.json({ book: getBook });
});

// Route            - /book/c/:category
// Description      - To get a list of books based on category
// Access           - Public
// Method           - GET
// Params           - category
// Body             - none
app.get("/book/c/:category", (req, res) => {
  const getBook = database.Books.filter(
    (book) => book.category.includes(req.params.category)
  );

  return res.json({ book: getBook });
});

app.listen(4000,()=> {
    console.log('listening on http://localhost:4000');
})