const express = require("express");
const fs = require("fs");
const router = express.Router();

const BOOKS_FILE = "./books.json";

const readBooksFromFile = () => {
    try {
        const data = fs.readFileSync(BOOKS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


const writeBooksToFile = (books) => {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2), "utf8");
};


router.get("/", (req, res) => {
    const books = readBooksFromFile();
    res.json(books);
});


router.get("/:id", (req, res) => {
    const books = readBooksFromFile();
    const filteredBooks = books.filter((b) => b.id === parseInt(req.params.id));

    if (filteredBooks.length === 0) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.json(filteredBooks[0]);
});


router.post("/", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: "Title and author are required" });
    }

    const books = readBooksFromFile();
    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author,
    };

    books.push(newBook);
    writeBooksToFile(books);

    res.status(201).json(newBook);
});


router.put("/:id", (req, res) => {
    const { title, author } = req.body;
    const books = readBooksFromFile();
    const id = parseInt(req.params.id);

    const filteredBooks = books.filter((b) => b.id !== id);

    
    if (books.length === filteredBooks.length) {
        return res.status(404).json({ error: "Book not found" });
    }

    
    const updatedBook = { id, title: title || "Untitled", author: author || "Unknown" };
    filteredBooks.push(updatedBook);

    writeBooksToFile(filteredBooks);
    res.json(updatedBook);
});


router.delete("/:id", (req, res) => {
    const books = readBooksFromFile();
    const updatedBooks = books.filter((b) => b.id !== parseInt(req.params.id));

    if (books.length === updatedBooks.length) {
        return res.status(404).json({ error: "Book not found" });
    }

    writeBooksToFile(updatedBooks);

    res.json({ message: "Book deleted successfully" });
});

module.exports = router;
