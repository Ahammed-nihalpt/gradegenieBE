# GradeGenie Backend

This is the backend service for **GradeGenie**, an AI-powered assistant that helps educators auto-generate assignments, rubrics, feedback, and instructional content.

Built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**, it supports authentication, file handling, LLM-based content generation, and session memory.

## 🔧 Tech Stack

- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for file hosting
- Multer for file upload handling
- PDF parsing via `pdf-parse`
- OCR support via `tesseract.js`
- Google Gemini 2.0 Flash via `@google/generative-ai`

## ✅ Features

- 🔐 JWT-based authentication
- 🧠 LLM-based content generation (Gemini)
- 📤 File uploads with Cloudinary
- 🧾 PDF and OCR parsing
- 🗃️ Session memory stored in MongoDB
- 👨‍🏫 Models for users, students, teachers, courses, assignments

## 📁 Folder Structure

```
src/
├── models/ # Mongoose models (User, Student, Teacher, Course, Assignment, etc.)
├── routes/ # Express route handlers
├── controllers/ # Business logic
├── middleware/ # JWT auth, error handling
├── utils/ # File and AI utilities (e.g. Cloudinary config)
├── app.ts # Express app configuration
├── server.ts # App entry point
```

## 🔑 Environment Variables

Create a `.env` file in the root with:

```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>

GEMINI_API_KEY=<your-gemini-api-key>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start in development

```bash
yarn dev
```

### 2. Build and run production

```bash
npm run build
npm start
```

## ⚠️ Notes

Some features mentioned in the original project brief were intentionally not implemented due to limited available time caused by ongoing commitments at my current job. These include:

- LMS integrations (e.g., Moodle, Google Classroom)
- Agentic workflows using frameworks like LangChain or CrewAI
- Full API documentation (e.g., Swagger/Postman)
- End-to-end testing coverage

I prioritized building the core functionality — authentication, AI content generation, session persistence, and file handling — to demonstrate fullstack engineering and product thinking within the available development window.

Further enhancements may be considered after submission.
