import Book from '../models/Book.js';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Get all books (with optional title search)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const { title } = req.query;

    // Build filter — if title query is provided, do case-insensitive regex search
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return next(new AppError('Invalid book ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Public
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, publishedYear, genre, totalCopies } = req.body;

    // Validate required fields
    if (!title || !author || !isbn) {
      return next(new AppError('Please provide title, author, and ISBN', 400));
    }

    // Manually check for duplicate ISBN to give a cleaner error message
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return next(new AppError('A book with this ISBN already exists', 409));
    }

    // When totalCopies is provided, copiesAvailable should match it
    const copies = totalCopies || 1;

    const book = await Book.create({
      title,
      author,
      isbn,
      publishedYear,
      genre,
      totalCopies: copies,
      copiesAvailable: copies,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Fallback catch for MongoDB duplicate key error (race condition)
    if (error.code === 11000) {
      return next(new AppError('A book with this ISBN already exists', 409));
    }
    // Mongoose validation errors (e.g. schema-level required fields)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return next(new AppError(messages.join(', '), 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Public
const updateBook = async (req, res, next) => {
  try {
    // If ISBN is being changed, ensure it doesn't conflict with another book
    if (req.body.isbn) {
      const existingBook = await Book.findOne({
        isbn: req.body.isbn,
        _id: { $ne: req.params.id },
      });
      if (existingBook) {
        return next(new AppError('A book with this ISBN already exists', 409));
      }
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid book ID format', 400));
    }
    if (error.code === 11000) {
      return next(new AppError('A book with this ISBN already exists', 409));
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return next(new AppError(messages.join(', '), 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Public
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid book ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

export { getBooks, getBookById, createBook, updateBook, deleteBook };
