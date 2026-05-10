import Student from '../models/Student.js';
import { AppError } from '../middleware/errorMiddleware.js';

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    const { name, email, rollNumber, department, phone } = req.body;

    // Validate required fields
    if (!name || !email || !rollNumber) {
      return next(new AppError('Please provide name, email, and rollNumber', 400));
    }

    // Manually check for duplicate rollNumber to give a cleaner error message
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return next(new AppError('A student with this rollNumber already exists', 409));
    }

    // Manually check for duplicate email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return next(new AppError('A student with this email already exists', 409));
    }

    const student = await Student.create({ name, email, rollNumber, department, phone });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    // Fallback catch for MongoDB duplicate key error (race condition)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new AppError(`A student with this ${field} already exists`, 409));
    }
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return next(new AppError(messages.join(', '), 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate('issuedBooks')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('issuedBooks');

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return next(new AppError('Invalid student ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res, next) => {
  try {
    // If rollNumber is being changed, ensure it doesn't conflict with another student
    if (req.body.rollNumber) {
      const existingStudent = await Student.findOne({
        rollNumber: req.body.rollNumber,
        _id: { $ne: req.params.id },
      });
      if (existingStudent) {
        return next(new AppError('A student with this rollNumber already exists', 409));
      }
    }

    // If email is being changed, ensure it doesn't conflict with another student
    if (req.body.email) {
      const existingEmail = await Student.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
      });
      if (existingEmail) {
        return next(new AppError('A student with this email already exists', 409));
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid student ID format', 400));
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new AppError(`A student with this ${field} already exists`, 409));
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return next(new AppError(messages.join(', '), 400));
    }
    next(new AppError(error.message, 500));
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return next(new AppError('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid student ID format', 400));
    }
    next(new AppError(error.message, 500));
  }
};

export { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
