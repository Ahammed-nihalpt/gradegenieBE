import express from 'express';
import { StudentController } from '../controller/studentController';

const router = express.Router();
const submissionController = new StudentController();

router.post('/add', submissionController.create);
router.put('/edit/:id', submissionController.edit);
router.get('/:id', submissionController.getById);
router.get('/by/user/:userId', submissionController.getByUserId);

export default router;
