import express from 'express';
import { StudentController } from '../controllers/studentController'; // adjust path if needed

const router = express.Router();
const studentController = new StudentController();

// Routes
router.post('/add', studentController.create);
router.put('/edit/:id', studentController.edit);
router.get('/:id', studentController.getById);
router.get('/by/user/:userId', studentController.getByUserId);

export default router;
