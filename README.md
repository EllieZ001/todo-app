1. Simple To-Do Application

A basic To-Do list app built with React for the frontend and Express for the backend.
Tasks are stored in server memory for simplicity.

2. Features

- Add new tasks
- Mark tasks as complete or undo
- Delete tasks
- See all tasks in a list
- Basic loading and error handling

3. Project Structure
 t
todo-app/
│
├── todo-backend/     # Express API server
└── todo-frontend/    # React UI

4. How to Run
4.1 Start the backend

cd todo-backend
npm install
npm run dev

Server runs at: http://localhost:5000

4.2 Start the frontend

cd todo-frontend
npm install
npm start

App opens at: http://localhost:3000

5. API Endpoints
Base URL: http://localhost:5000/api/todos

Method	Endpoint	Description
GET      	/	    Get all tasks
POST	    /	    Add a new task
PUT	        /:id	Update task status
DELETE      /:id	Delete a task

5.1 Example Request

POST /api/todos
Content-Type: application/json

{
  "task": "Buy groceries"
}

6. How it Works

- The frontend sends API requests to the backend
- The backend processes the requests and returns data
- The frontend updates the UI based on responses

7. Notes

This project was mainly for practicing how frontend and backend work together.
I kept the design simple so I could focus on understanding API requests, handling responses, and debugging. 

This project uses in-memory storage. All data is lost when the server restarts.For production, replace storage with a database.