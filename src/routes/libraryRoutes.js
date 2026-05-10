import { Router } from 'express';
import {
  issueBook,
  returnBook,
  getBorrowingHistory,
} from '../controllers/libraryController.js';

const router = Router();

router.post('/issue/:studentId/:bookId', issueBook);
router.post('/return/:studentId/:bookId', returnBook);
router.get('/history/:studentId', getBorrowingHistory);

export default router;
