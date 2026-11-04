import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  isAuthorReferenced,
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch {
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({ message: 'Invalid author data.' });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);

    if (existingAuthor) {
      return res.status(409).json({ message: 'Author ID already exists.' });
    }

    await createAuthorInDb({ id, name, birthYear });

    return res.status(201).json({ id, name, birthYear });
  } catch {
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, birthYear } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({ message: 'Invalid author data.' });
    }

    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    await updateAuthorInDb(req.params.id, { name, birthYear });

    return res.status(200).json({
      id: req.params.id,
      name,
      birthYear,
    });
  } catch {
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const referencedBook = await isAuthorReferenced(req.params.id);

    if (referencedBook) {
      return res.status(409).json({
        message: 'Cannot delete an author referenced by a book.',
      });
    }

    await deleteAuthorFromDb(req.params.id);

    return res.status(200).json({ message: 'Author deleted successfully.' });
  } catch {
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};