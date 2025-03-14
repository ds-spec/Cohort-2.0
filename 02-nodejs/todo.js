/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require("express");
const bodyParser = require("body-parser");
const z = require("zod");

const app = express();

app.use(bodyParser.json());

let todos = [];

app.post("/todos", (req, res) => {
  const todo = z.object({
    title: z.string(),
    description: z.string(),
    completed: z.boolean(),
  });

  const { title, description, completed } = req.body;
  const validatedTodo = todo.safeParse(req.body);
  if (!validatedTodo) {
    return res.status(400).json({ error: "Invalid todo item format" });
  }
  const newTodo = {
    id: todos.length + 1,
    title,
    description,
    completed,
  };
  todos.push(newTodo);
  res.status(201).send(newTodo);
});

app.get("/todos", (req, res) => {
  const todo = todos;
  // console.log(todo);
  if (todos.length > 0) {
    return res.status(200).send(todo);
  }
  return res.status(404).json({
    message: "Add a to-do",
  });
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => parseInt(todo.id) === id);
  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }
  res.status(200).send(todo);
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => parseInt(todo.id) === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const updatedTodo = { ...todo, ...req.body };
  const index = todos.findIndex((todo) => parseInt(todo.id) === id);
  todos[index] = updatedTodo;
  res.status(200).send(updatedTodo);
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoToDelete = todos.find((todo) => parseInt(todo.id) === id);
  console.log(todoToDelete);

  // console.log(todo);
  if (!todoToDelete) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos = todos.filter((todo) => todo.id !== id);
  return res.status(200).json({
    message: "Todo deleted",
  });
});

module.exports = app;

app.listen(3000);
