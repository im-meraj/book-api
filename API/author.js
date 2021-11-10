const AuthorModel = require("../schema/author");

const Router = require("express").Router();

// GET Routes

// Route            - /author
// Description      - To get all authors
// Access           - Public
// Method           - GET
// Params           - none
// Body             - none
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  res.json(getAllAuthors);
});

// Route            - /author/:authorID
// Description      - To get a specific author based on ID
// Access           - Public
// Method           - GET
// Params           - authorID
// Body             - none
Router.get("/:authorID", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    id: parseInt(req.params.authorID),
  });

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for the id - ${req.params.authorID}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

// Route            - /author/b/:isbn
// Description      - To get a list of authors based on books
// Access           - Public
// Method           - GET
// Params           - isbn
// Body             - none
Router.get("/b/:isbn", async (req, res) => {
  const getSpecificAuthors = await AuthorModel.find({ books: req.params.isbn });

  if (!getSpecificAuthors) {
    return res.json({
      error: `No authors found based on the book with ISBN - ${req.params.isbn}`,
    });
  }

  return res.json({ author: getSpecificAuthors });
});

// POST Routes

// Route            - /author/new
// Description      - To add a new author
// Access           - Public
// Method           - POST
// Params           - none
// Body             - none
Router.post("/new", async (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);
  return res.json({message: "Author added successfully to database."});
});

// PUT Routes

// Route            - /author/update
// Description      - To update an existing author
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
Router.put("/update/:id", async (req, res) => {
  const { newAuthor } = req.body;
  const { id } = req.params;

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(id),
    },
    {
      $set: {
        ...newAuthor,
      },
    },
    {
      new: true,
    }
  );

  return res.json({ author: updatedAuthor });
});

// Route            - /author/updateName
// Description      - To update an existing author name
// Access           - Public
// Method           - PUT
// Params           - id
// Body             - none
Router.put("/updateName/:id", async (req, res) => {
  const { name } = req.body;

  const updateAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      name: name,
    },
    {
      new: true,
    }
  );

  return res.json({
    message: "Author name updated successfully",
    book: updateAuthor,
  });

});

// DELETE Routes

/*
Route        /author/delete/:id
Description  delete an author
Access       PUBLIC
Parameters   id
Method       DELETE
*/

Router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const updateBookDatabase = await AuthorModel.findOneAndDelete({
    id: id,
  });

  return res.json({Author: updateBookDatabase, message: "Author deleted successfully."});
});

module.exports = Router;