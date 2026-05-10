import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import {
  createStudentValidation,
  updateStudentValidation,
} from '../middleware/validators/studentValidator.js';

const router = Router();

router.route('/')
  .get(getStudents)
  .post(createStudentValidation, createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudentValidation, updateStudent)
  .delete(deleteStudent);

export default router;
