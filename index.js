require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//API
const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");

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

// Express initialization
const app = express();

app.use(express.json());

// Microservices

app.use("/book", Book);
app.use("/author", Author);
app.use("/publication", Publication);

app.get("/", (req, res) => {
  res.send("Welcome to Book API");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server Running!!!🔥");
});
