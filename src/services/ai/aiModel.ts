import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const aiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export default aiModel;
