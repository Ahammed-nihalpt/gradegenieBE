import express from 'express';
import indexReoutes from './routes/index.routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexReoutes);

export default app;
