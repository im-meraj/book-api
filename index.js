require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Importing different Schema's
const Book = require("./schema/book");
const Author = require("./schema/author");
const Publication = require("./schema/publication");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

// Local Database
const database = require("./database");
const BookModel = require("./schema/book");

// Express initialization
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Book API");
});

// GET ROUTES

// Route            - /book
// Description      - To get all the books
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
app.get("/book", async (req, res) => {
  const getAllBooks = await Book.find();
  res.json(getAllBooks);
});

// Route            - /book/:bookID
// Description      - To get a specific book
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
app.get("/book/:bookID", async (req, res) => {
  const getSpecificBook = await Book.findOne({ISBN: req.params.bookID});

  if (!getSpecificBook) {
    res.json({
      error: `No book found for the ISBN of ${req.params.bookID}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

// Route            - /book/c/:category
// Description      - To get a list of books based on category
// Access           - Public
// Method           - GET
// Params           - category
// Body             - none
app.get("/book/c/:category", (req, res) => {
  const getBook = database.Books.filter((book) =>
    book.category.includes(req.params.category)
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
  const getBook = database.Books.filter((book) =>
    book.authors.includes(parseInt(req.params.authorID))
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
  const getAuthor = database.Authors.filter(
    (author) => author.id === parseInt(req.params.authorID)
  );
  return res.json({ author: getAuthor });
});

// Route            - /author/b/:bookID
// Description      - To get a list of authors based on books
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
app.get("/author/b/:bookID", (req, res) => {
  const getAuthor = database.Authors.filter((author) =>
    author.books.includes(req.params.bookID)
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
  const getPublication = database.Publications.filter(
    (publication) => publication.id === parseInt(req.params.publicationID)
  );
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
  const getPublication = database.Publications.filter((publication) =>
    publication.books.includes(bookID)
  );
  return res.json({ publication: getPublication });
});

// POST ROUTES

// Route            - /book/new
// Description      - To add a new book
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
app.post("/book/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    await Book.create(newBook);
    return res.json({ message: "Book added successfully to database." });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Route            - /author/new
// Description      - To add a new author
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
app.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
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
// Description      - To update an existing book details
// Access           - Public
// Method           - PUT
// Params           - isbn
// Body             - none
app.put("/book/update/:isbn", (req, res) => {
  const { updatedBook } = req.body;
  const { isbn } = req.params;

  const book = database.Books.map((book) => {
    if (book.ISBN === isbn) {
      return { ...book, ...updatedBook };
    }
    return book;
  });
  return res.json(book);
});

// Route            - /bookAuthor/update
// Description      - To update/add a new author to an existing book
// Access           - Public
// Method           - PUT
// Params           - isbn
// Body             - none
app.put("/bookAuthor/update/:isbn", (req, res) => {
  const { newAuthor } = req.body;
  const { isbn } = req.params;

  database.Books.forEach((book) => {
    if (book.ISBN === isbn) {
      if (!book.authors.includes(newAuthor)) {
        return book.authors.push(newAuthor);
      }
      return book;
    }
    return book;
  });

  database.Authors.forEach((author) => {
    if (author.id === newAuthor) {
      if (!author.books.includes(isbn)) {
        return author.books.push(isbn);
      }
      return author;
    }
    return author;
  });

  return res.json({ book: database.Books, author: database.Authors });
});

// Route            - /author/update
// Description      - To update an existing author
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
app.put("/author/update/:id", (req, res) => {
  const { updatedAuthor } = req.body;
  const { id } = req.params;

  const author = database.Authors.map((author) => {
    if (author.id === parseInt(id)) {
      return { ...author, ...updatedAuthor };
    }
    return author;
  });
  return res.json(author);
});

// Route            - /author/updateNam
// Description      - To update an existing author name
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
app.put("/author/updateName/:id", (req, res) => {
  const { updatedAuthor } = req.body;
  const { id } = req.params;

  const author = database.Authors.map((author) => {
    if (author.id === parseInt(id)) {
      author.name = updatedAuthor.name;
      return author;
    }
    return author;
  });
  return res.json(author);
});

// Route            - /publication/update
// Description      - To update an existing publication
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
app.put("/publication/update/:id", (req, res) => {
  const { updatedPublication } = req.body;
  const { id } = req.params;

  const publication = database.Publications.map((publication) => {
    if (publication.id === parseInt(id)) {
      return { ...publication, ...updatedPublication };
    }
    return publication;
  });
  return res.json(publication);
});

// Route            - /publication/updateBook
// Description      - To update or add a new book to an existing publication
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
app.put("/publication/updateBook/:id", (req, res) => {
  const { updatedPublication } = req.body;
  const { id } = req.params;
  const { books } = updatedPublication;

  const publication = database.Publications.map((publication) => {
    if (publication.id === parseInt(id)) {
      publication.books = books;
      return publication;
    }
    return publication;
  });
  return res.json(publication);
});

/*
Route        /book/delete/:isbn
Description  delete a book
Access       PUBLIC
Parameters   isbn
Method       Delete
*/

app.delete("/book/delete/:isbn", (req, res) => {
  const { isbn } = req.params;

  const filteredBooks = database.Books.filter((book) => book.ISBN !== isbn);

  database.Books = filteredBooks;

  return res.json(database.Books);
});

app.listen(4000, () => {
  console.log("Server Running!!!🔥 Listening on http://localhost:4000");
});
