import { body } from 'express-validator';
import validate from './validate.js';

export const createStudentValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('rollNumber')
    .notEmpty()
    .withMessage('Roll number is required'),

  body('phone')
    .optional()
    .isNumeric()
    .withMessage('Phone must be numeric'),

  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),

  validate,
];

export const updateStudentValidation = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('rollNumber')
    .optional()
    .notEmpty()
    .withMessage('Roll number cannot be empty'),

  body('phone')
    .optional()
    .isNumeric()
    .withMessage('Phone must be numeric'),

  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),

  validate,
];
