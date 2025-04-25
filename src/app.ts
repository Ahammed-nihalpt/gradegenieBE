import express from 'express';
import indexReoutes from './routes/index.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexReoutes);

export default app;
