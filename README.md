# SmartCV AI

SmartCV AI is a full-stack AI-powered resume analysis and optimization platform that helps users improve their resumes using artificial intelligence.

Built with modern technologies, the project provides resume upload, AI-based analysis, ATS-friendly suggestions, and an intuitive user interface.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Spring Boot
- Java
- REST APIs
- Maven

### Database
- MySQL

### AI
- OpenAI API (or your configured AI provider)

---

## Project Structure

```text
SmartCV_AI/
│
├── backend/        Spring Boot REST API
├── frontend/       React User Interface
└── README.md
```

---

# How The Application Works

1. The user opens the React application.
2. A resume is uploaded through the interface.
3. React sends the file to the Spring Boot backend.
4. The backend extracts resume content.
5. AI analyzes the resume.
6. The application generates:
   - ATS score
   - Resume feedback
   - Skill analysis
   - Improvement suggestions
7. The optimized results are displayed to the user.

---

# Features

- Upload Resume (PDF/DOCX)
- AI Resume Analysis
- ATS Score
- Resume Improvement Suggestions
- Skill Detection
- Modern Responsive UI
- REST API Architecture

---

# Backend Setup

Open a terminal inside the backend folder.

```bash
cd backend
```

Run the application.

```bash
mvn spring-boot:run
```

The backend runs at

```text
http://localhost:8080
```

---

## API Endpoints

Example endpoints

```text
POST /api/resume/upload
```

Upload a resume.

```text
POST /api/resume/analyze
```

Analyze the uploaded resume.

```text
GET /api/resume/history
```

Fetch previous resume analyses.

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend runs at

```text
http://localhost:5173
```

---

# Learning Path

Read the code in this order:

1. Spring Boot Main Application
2. Entity Classes
3. Repository Layer
4. Service Layer
5. Controller Layer
6. AI Integration Service
7. API Configuration
8. React API Functions
9. React Components
10. Tailwind UI

---

# Project Architecture

```text
React UI
      │
      ▼
Spring Boot REST API
      │
      ▼
Business Logic
      │
      ├──────────────► AI Service
      │
      ▼
MySQL Database
```

---

# Why These Components Exist

- **Entity** — Represents database tables.
- **Repository** — Handles database operations.
- **Service** — Contains business logic.
- **Controller** — Exposes REST endpoints.
- **DTO** — Transfers request and response data.
- **AI Service** — Generates resume analysis and suggestions.
- **React Components** — Build the user interface.

---

# Common Commands

Run backend tests

```bash
cd backend
mvn test
```

Build backend

```bash
mvn clean package
```

Build frontend

```bash
cd frontend
npm run build
```

---

# Run Using Docker

Build and start containers

```bash
docker compose up --build
```

Frontend

```text
http://localhost:3000
```

Backend

```text
http://localhost:8080
```

Stop containers

```bash
docker compose down
```

---

# Environment Variables

### Backend

```text
OPENAI_API_KEY=your_api_key

DB_URL=jdbc:mysql://localhost:3306/smartcv

DB_USERNAME=root

DB_PASSWORD=password

FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend

```text
VITE_API_BASE_URL=http://localhost:8080
```

---

# Future Improvements

- Resume Templates
- Cover Letter Generator
- LinkedIn Profile Review
- Interview Question Generator
- Resume Version History
- Authentication & Authorization
- Dashboard Analytics
- Export Improved Resume

---

# Screenshots

Add screenshots of:

- Home Page
- Resume Upload
- AI Analysis
- ATS Score
- Suggestions Dashboard

---

# Contributing

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# License

This project is created for educational and portfolio purposes.

---

<p align="center">
  Built with ❤️ by <b>Mayank Sangwani</b>
</p>
