import Student from '../models/Student.js';
import Book from '../models/Book.js';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Issue a book to a student
// @route   POST /api/library/issue/:studentId/:bookId
// @access  Public
const issueBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.params;

    // Fetch both student and book in parallel to minimize DB latency
    const [student, book] = await Promise.all([
      Student.findById(studentId),
      Book.findById(bookId),
    ]);

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    // Ensure at least one copy is available before issuing
    if (book.copiesAvailable <= 0) {
      return next(new AppError('No copies available for this book', 400));
    }

    // Prevent duplicate issuance — a student cannot have the same book twice.
    // NOTE: issuedBooks stores ObjectIds, while bookId from params is a string.
    // .includes() uses === which fails for ObjectId vs string comparison.
    // We must explicitly convert via .toString() for a reliable check.
    if (student.issuedBooks.some(id => id.toString() === bookId)) {
      return next(new AppError('Book already issued to this student', 400));
    }

    // Atomically decrement copiesAvailable — only succeeds if a copy still exists.
    // Using findOneAndUpdate with a condition on copiesAvailable ensures
    // we never go below 0 even under concurrent requests.
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, copiesAvailable: { $gt: 0 } },
      { $inc: { copiesAvailable: -1 } },
      { new: true }
    );

    // Safety net: if between our check and the atomic update the last copy was taken
    if (!updatedBook) {
      return next(new AppError('No copies available for this book', 400));
    }

    try {
      // Add book reference to the student's issuedBooks array
      await Student.findByIdAndUpdate(studentId, { $push: { issuedBooks: bookId } });
    } catch (studentUpdateError) {
      // Rollback: the book copy was decremented but the student update failed.
      // Restore the copy to keep the system consistent.
      await Book.findByIdAndUpdate(bookId, { $inc: { copiesAvailable: 1 } });
      throw studentUpdateError;
    }

    res.status(200).json({
      success: true,
      message: 'Book issued successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Return an issued book
// @route   POST /api/library/return/:studentId/:bookId
// @access  Public
const returnBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.params;

    // Fetch both student and book in parallel
    const [student, book] = await Promise.all([
      Student.findById(studentId),
      Book.findById(bookId),
    ]);

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    // Verify this student actually has the book issued.
    // Same ObjectId-vs-string consideration as issueBook.
    if (!student.issuedBooks.some(id => id.toString() === bookId)) {
      return next(new AppError('Book was not issued to this student', 400));
    }

    // Increment available copies (no upper bound check needed — totalCopies is a soft limit)
    await Book.findByIdAndUpdate(bookId, { $inc: { copiesAvailable: 1 } });

    try {
      // Remove book reference from the student's issuedBooks array
      await Student.findByIdAndUpdate(studentId, { $pull: { issuedBooks: bookId } });
    } catch (studentUpdateError) {
      // Rollback: the book copy was restored but the student update failed.
      // Re-decrement to keep the system consistent.
      await Book.findByIdAndUpdate(bookId, { $inc: { copiesAvailable: -1 } });
      throw studentUpdateError;
    }

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Get borrowing history of a student
// @route   GET /api/library/history/:studentId
// @access  Public
const getBorrowingHistory = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('issuedBooks');
    if (!student) {
      return next(new AppError('Student not found', 404));
    }
    res.status(200).json({
      success: true,
      data: student.issuedBooks,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid student ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

export { issueBook, returnBook, getBorrowingHistory };
