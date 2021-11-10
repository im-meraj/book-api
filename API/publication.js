const BookModel = require("../schema/book");
const PublicationModel = require("../schema/publication");

const Router = require("express").Router();

// GET Routes

// Route            - /publication
// Description      - To get all publications
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
Router.get("/", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  res.json(getAllPublications);
});

// Route            - /publication/:publicationID
// Description      - To get a specific publication
// Access           - Public
// Method           - GET
// Params           - publicationID
// Body             - none
Router.get("/:publicationID", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    id: req.params.publicationID,
  });
  if (!getSpecificPublication) {
    return res.json({
      error: `No publication found at the id of ${req.params.publicationID}`,
    });
  }
  return res.json({ publication: getSpecificPublication });
});

// Route            - /publication/b/:bookID
// Description      - To get a list of publications based on books
// Access           - Public
// Method           - GET
// Params           - bookID
// Body             - none
Router.get("/b/:bookID", async (req, res) => {
  const { bookID } = req.params;

  const getSpecificPublication = await PublicationModel.findOne({
    books: bookID,
  });

  if (!getSpecificPublication) {
    return res.json({
      error: `No Publication found based on the book with ISBN - ${req.params.bookID}`,
    });
  }

  return res.json({ publication: getSpecificPublication });
});

// POST ROUTES

// Route            - /publication/new
// Description      - To add a new publication
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
Router.post("/new", async (req, res) => {
  const newPublication = req.body;
  await PublicationModel.create(newPublication);
  return res.json({ message: "Publication added successfully to database." });
});

// PUT ROUTES

// Route            - /publication/update
// Description      - To update an existing publication
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
Router.put("/update/:id", async (req, res) => {
  const { newPublication } = req.body;
  const { id } = req.params;

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(id),
    },
    {
      $set: {
        ...newPublication,
      },
    },
    {
      new: true,
    }
  );

  return res.json({ publication: updatedPublication });
});

// Route            - /publication/updateBook
// Description      - To update or add a new book to an existing publication
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
Router.put("/updateBook/:id", async (req, res) => {
  const { id } = req.params;
  const { newBook } = req.body;
  
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(id),
    },
    {
      $addToSet: {
        books: newBook,
      },
    },
    {
      new: true,
    }
  );

  return res.json({
    publication: updatedPublication,
    message: "Publication books updated successfully",
  });
});

// DELETE Routes

/*
Route        /publication/delete/:id
Description  delete a publication
Access       PUBLIC
Parameters   id
Method       DELETE
*/

Router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const updateBookDatabase = await PublicationModel.findOneAndDelete({
    id: id,
  });

  return res.json({Publication: updateBookDatabase, message: "Publication deleted successfully."});
});

/*
Route        /publication/delete/book/:isbn/:id
Description  delete a book from a publication
Access       PUBLIC
Parameters   isbn, id
Method       DELETE
*/

Router.delete("/delete/book/:isbn/:id", async (req, res) => {
  const { isbn, id } = req.params;

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      $pull: {
        publication: parseInt(id),
      },
    },
    {
      new: true,
    }
  );

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(id),
    },
    {
      $pull: {
        books: isbn,
      },
    },
    {
      new: true,
    }
  );

  return res.json({ message: "Book was deleted successfully.", book: updatedBook, publication: updatedPublication });
});

module.exports = Router;