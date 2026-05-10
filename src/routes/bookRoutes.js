import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import {
  createBookValidation,
  updateBookValidation,
} from '../middleware/validators/bookValidator.js';

const router = Router();

router.route('/')
  .get(getBooks)
  .post(createBookValidation, createBook);

router.route('/:id')
  .get(getBookById)
  .put(updateBookValidation, updateBook)
  .delete(deleteBook);

export default router;
