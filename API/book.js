const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");

const Router = require("express").Router();

// GET Routes

// Route            - /book
// Description      - To get all the books
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
Router.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  res.json(getAllBooks);
});

// Route            - /book/:bookID
// Description      - To get a specific book
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
Router.get("/:bookID", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.bookID});

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
Router.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.find({ category: req.params.category });
  if (!getSpecificBooks) {
    res.json({
      error: `No books found for the category of ${req.params.category}`,
    });
  }
  return res.json({ books: getSpecificBooks });
});

// Route            - /book/a/:authorID
// Description      - To get a list of books based on author
// Access           - Public
// Method           - GET
// Params           - authorID
// Body             - none
Router.get("/a/:authorID", async (req, res) => {
  const getSpecificBooks = await BookModel.find({ authors: parseInt(req.params.authorID) });
  if (!getSpecificBooks) {
    res.json({
      error: `No books found with the author id of ${req.params.authorID}`,
    });
  }
  return res.json({ books: getSpecificBooks });
});

// POST Routes

// Route            - /book/new
// Description      - To add a new book
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    await BookModel.create(newBook);
    return res.json({ message: "Book added successfully to database." });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// PUT Routes

// Route            - /book/update
// Description      - To update an existing book details
// Access           - Public
// Method           - PUT
// Params           - isbn
// Body             - none
Router.put("/update/:isbn", async (req, res) => {
  const { newBook } = req.body;
  const { isbn } = req.params;

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      $set: {
        ...newBook,
      },
    },
    {
      new: true,
    }
  );

  return res.json({ author: updatedBook });
});

// Route            - /book/updateTitle
// Description      - To update an existing book title
// Access           - Public
// Method           - PUT
// Params           - isbn
Router.put("/updateTitle/:isbn", async (req, res) => {
  const {title} = req.body;
  
  const updateBook = await BookModel.findOneAndUpdate({
    ISBN: req.params.isbn,
  },
  {
    title: title,
  },
  {
    new: true,
  });

  return res.json({
    message: "Book title updated successfully",
    book: updateBook,
  });
});

// Route            - /book/updateAuthor
// Description      - To update/add a new author to an existing book
// Access           - Public
// Method           - PUT
// Params           - isbn
// Body             - none
Router.put("/updateAuthor/:isbn", async (req, res) => {
  const { newAuthor } = req.body;
  const { isbn } = req.params;

  const updatedBook = await BookModel.findOneAndUpdate({
    ISBN: isbn,
  },{
    $addToSet: {
      authors: newAuthor,
    }
  },{
    new: true,
  });
  
  const updatedAuthor = await AuthorModel.findOneAndUpdate({
    id: newAuthor,
  },{
    $addToSet: {
      books: isbn,
    }
  },{
    new: true,
  });

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added successfully to database.",
  });

});

// DELETE Routes

/*
Route        /book/delete/:isbn
Description  delete a book
Access       PUBLIC
Parameters   isbn
Method       DELETE
*/

Router.delete("/delete/:isbn", async (req, res) => {
  const { isbn } = req.params;

  const updateBookDatabase = await Book.findOneAndDelete({
    ISBN: isbn,
  });

  return res.json({books: updateBookDatabase, message: "Book deleted successfully."});
});

/*
Route        /book/delete/:isbn/:id
Description  delete an author from a book
Access       PUBLIC
Parameters   isbn, id
Method       DELETE
*/

Router.delete("/delete/:isbn/:id", async (req, res) => {
  const { isbn, id } = req.params;

  const updatedBook = await BookModel.findOneAndUpdate({
    ISBN: isbn,
  },{
    $pull: {
      authors: parseInt(id),
    }
  },{
    new: true,
  });

  const updatedAuthor = await AuthorModel.findOneAndUpdate({
    id:parseInt(id),
  },{
    $pull: {
      books: isbn,
    }
  },{
    new: true,
  });

  return res.json({ message: "Author was deleted successfully.", book: updatedBook, author: updatedAuthor });
});

module.exports = Router;
