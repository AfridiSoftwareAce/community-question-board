# Community Question Board (MERN)

A simple Q&A board for local libraries to manage community questions.

## 🧩 Stack
- MongoDB + Mongoose
- Express.js (Node.js)
- React + Vite + Axios + React Router
- CORS + dotenv

## ⚙️ Setup

```bash
git clone https://github.com/AfridiSoftwareAce/community-question-board.git
cd community-question-board

Backend

cd backend
npm install
cp .env.example .env
# update MONGO_URI
npm run dev


Frontend

cd ../frontend
npm install
npm run dev


Visit: http://localhost:5173

💡 Features

Submit, view, and search questions

Mark urgent or normal priority

Librarians can answer and change status

Filter unanswered/urgent