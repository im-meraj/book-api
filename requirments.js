// Requirments

/* 
    Book
        -ISBN           -String
        -Title          -String
        -Author         -[Number]
        -Language       -String
        -Publication    -Number
        -NoOfPages      -Number
        -Categories     -[String]

    Author
        -ID             -Number
        -Name           -String
        -Books          -[String]

    Publication
        -ID             -Number
        -Name           -String
        -Books          -[String]


    ---APIs---

    Book

    - GET
      - To get all books✅
      - To get a specific book✅
      - To get a list of books based on category✅
      - To get a list of books based on authors✅

    - POST
      - To add a new book✅

    - PUT
      - To update book details✅
      - To update/add new author✅

    - DELETE
      - To delete a book
      - To delete an author from a book


    Author

    - GET
      - To get all authors✅
      - To get a specific author✅
      - To get a list of author based on book✅

    - POST
      - To add new author✅
      - To update or add new book

    - PUT
      - To update author details✅

    - DELETE
      - To delete an author


    Publications

    - GET
      - To get all publication✅
      - To get a specific publication✅
      - To get a list of publication based on book✅

    - POST
      - To add new publication✅

    - PUT
      - To update publication details✅
      - To update or add new book✅

    - DELETE
      - To delete a book from publication
      - To delete a publication
*/