const express = require('express');

const database = require('./database');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Book API');
})


// GET ROUTES

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

// Route            - /book/a/:authorID
// Description      - To get a list of books based on author
// Access           - Public
// Method           - GET
// Params           - authorID
// Body             - none
app.get("/book/a/:authorID", (req, res) => {
  const getBook = database.Books.filter(
    (book) => book.authors.includes(parseInt(req.params.authorID))
  );
  return res.json({ book: getBook });
});


// Route            - /author
// Description      - To get all authors
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
app.get("/author", (req, res) => {
  res.json({ authors: database.Authors });
});

// Route            - /author/:authorID
// Description      - To get a specific author
// Access           - Public
// Method           - GET
// Params           - authorID
// Body             - none
app.get("/author/:authorID", (req, res) => {
  const getAuthor = database.Authors.filter((author) => author.id === parseInt(req.params.authorID))
  return res.json({ author: getAuthor });
});

// Route            - /author/b/:bookID
// Description      - To get a list of authors based on books
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
app.get("/author/b/:bookID", (req, res) => {
  const getAuthor = database.Authors.filter(
    (author) => author.books.includes(req.params.bookID)
  );
  return res.json({ author: getAuthor });
});


// Route            - /publication
// Description      - To get all publications
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
app.get("/publication", (req, res) => {
  res.json({ publication: database.Publications });
});


// Route            - /publication/:publicationID
// Description      - To get a specific publication
// Access           - Public
// Method           - GET
// Params           - publicationID
// Body             - none
app.get("/publication/:publicationID", (req, res) => {
  const getPublication = database.Publications.filter((publication) => publication.id === parseInt(req.params.publicationID));
  console.log(getPublication);
  return res.json({ publication: getPublication });
});


// Route            - /publication/b/:bookID
// Description      - To get a list of publications based on books
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
app.get("/publication/b/:bookID", (req, res) => {
  const bookID = req.params.bookID;
  const getPublication = database.Publications.filter((publication) => publication.books.includes(bookID));
  return res.json({ publication: getPublication });
});


// POST ROUTES

// Route            - /book/new
// Description      - To add a new book
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
app.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  database.Books.push(newBook);
  return res.json(database.Books);
});


// Route            - /author/new
// Description      - To add a new author
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
app.post("/author/new", (req, res) => {
  const {newAuthor} = req.body;
  database.Authors.push(newAuthor);
  return res.json(database.Authors);
});


// Route            - /author/new
// Description      - To add a new author
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
app.post("/publication/new", (req, res) => {
  const newPublication = req.body;
  database.Publications.push(newPublication);
  return res.json(database.Publications);
});


// PUT ROUTES


// Route            - /book/update
// Description      - To update an existing book
// Access           - Public
// Method           - PUT
// Params           - isbn
// Body             - none

app.put("/book/update/:isbn", (req, res) => {
  const {updatedBook} = req.body;
  const {isbn} = req.params;

  const book = database.Books.map((book) => {
    if (book.ISBN === isbn) {
      return {...book, ...updatedBook};
    }
    return book;
  });
  return res.json(book);
});

app.listen(4000,() => {
    console.log('Server Running!!!🔥 Listening on http://localhost:4000');
})