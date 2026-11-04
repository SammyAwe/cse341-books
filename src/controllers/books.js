import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../models/books.js';

import { getAuthorById } from '../models/authors.js';

const isValidBook = (book) => {
  if (
    typeof book.id !== 'string' ||
    !book.id.trim() ||
    typeof book.authorId !== 'string' ||
    !book.authorId.trim() ||
    typeof book.title !== 'string' ||
    !book.title.trim() ||
    typeof book.publicationDate !== 'string'
  ) {
    return false;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(book.publicationDate)) {
    return false;
  }

  const date = new Date(`${book.publicationDate}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === book.publicationDate
  );
};

export const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to retrieve book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    const book = { id, authorId, title, publicationDate };

    if (!isValidBook(book)) {
      return res.status(400).json({ message: 'Invalid book data' });
    }

    const existingBook = await getBookById(id);

    if (existingBook) {
      return res.status(409).json({ message: 'Book ID already exists' });
    }

    const author = await getAuthorById(authorId);

    if (!author) {
      return res.status(400).json({ message: 'Author does not exist' });
    }

    await createBook(book);

    return res.status(201).json(book);
  } catch (error) {
    console.error('Failed to create book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBookHandler = async (req, res) => {
  try {
    const { authorId, title, publicationDate } = req.body;

    const book = {
      id: req.params.id,
      authorId,
      title,
      publicationDate,
    };

    if (!isValidBook(book)) {
      return res.status(400).json({ message: 'Invalid book data' });
    }

    const existingBook = await getBookById(req.params.id);

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = await getAuthorById(authorId);

    if (!author) {
      return res.status(400).json({ message: 'Author does not exist' });
    }

    await updateBook(req.params.id, {
      authorId,
      title,
      publicationDate,
    });

    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to update book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBookHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBook(req.params.id);

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};