import { body } from 'express-validator';
import validate from './validate.js';

const currentYear = new Date().getFullYear();

export const createBookValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('author')
    .notEmpty()
    .withMessage('Author is required'),

  body('isbn')
    .notEmpty()
    .withMessage('ISBN is required'),

  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be a positive integer'),

  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: currentYear + 5 })
    .withMessage(`Published year must be between 1000 and ${currentYear + 5}`),

  body('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string'),

  validate,
];

export const updateBookValidation = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('author')
    .optional()
    .notEmpty()
    .withMessage('Author cannot be empty'),

  body('isbn')
    .optional()
    .notEmpty()
    .withMessage('ISBN cannot be empty'),

  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be a positive integer'),

  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: currentYear + 5 })
    .withMessage(`Published year must be between 1000 and ${currentYear + 5}`),

  body('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string'),

  validate,
];
