import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  return await collection.find({}).toArray();
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  return await collection.findOne({ id });
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  return await collection.insertOne(author);
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection('authors');

  return await collection.updateOne(
    { id },
    { $set: author }
  );
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  return await collection.deleteOne({ id });
};

const isAuthorReferenced = async (id) => {
  const db = getDb();
  const books = db.collection('books');
  return await books.findOne({ authorId: id });
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  isAuthorReferenced,
};