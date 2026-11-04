import { getDb } from '../db/connect.js';

export const getAllBooks = async () => {
  const books = await getDb()
    .collection('books')
    .find({})
    .toArray();

  return books;
};

export const getBookById = async (bookId) => {
  const book = await getDb()
    .collection('books')
    .findOne({ id: bookId });

  return book;
};

export const createBook = async (book) => {
  const result = await getDb()
    .collection('books')
    .insertOne(book);

  return result;
};

export const updateBook = async (bookId, book) => {
  const result = await getDb()
    .collection('books')
    .updateOne(
      { id: bookId },
      { $set: book }
    );

  return result;
};

export const deleteBook = async (bookId) => {
  const result = await getDb()
    .collection('books')
    .deleteOne({ id: bookId });

  return result;
};