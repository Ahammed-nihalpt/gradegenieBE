import express from 'express';
import { TeacherController } from '../controllers/teacherController';

const router = express.Router();
const teacherController = new TeacherController();

// Routes
router.post('/add', teacherController.create);
router.put('/edit/:id', teacherController.edit);
router.get('/:id', teacherController.getById);
router.get('/by/user/:userId', teacherController.getByUserId);

export default router;
