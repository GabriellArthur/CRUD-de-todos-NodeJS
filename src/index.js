const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [];

function checksExistsUserAccount(request, response, next) {
   const { username } = request.headers; //diferente de Java/Kotlin, aqui se utiliza Headers
   const user = users.find((user) => user.username === username);
 
   if (!user) {
     return response.status(404).json({ error: "Mensagem do erro" });
   }
 
   request.user = user;
 
   return next();
}

app.post('/users', (request, response) => {
   const { name, username } = request.body;

   const userAlreadyExists = users.some((user) => user.username === username); //o Some é o existe/não existe, igual no Hibernate
 
   if(userAlreadyExists){
      return response.status(400).json({Error: "Customer already exists!"})
   }

   customers.push({
      id:uuidv4(),
      name, 
      username, 
      todos: []
   });

   users.push(user);
   return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
   const { user } = request;

   return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
   const { title, deadline } = request.body;
   const { user } = request;
 
   const todo = {
     id: uuidv4(),
     title,
     done: false,
     deadline: new Date(deadline),
     created_at: new Date(),
   };
 
   user.todos.push(todo);
   return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
   const { title, deadline } = request.body;
   const { id } = request.params;
   const { user } = request;
 
   const todo = user.todos.find((todo) => todo.id === id);
 
   if (!todo) {
     return response.status(404).json({ error: "Mensagem do erro" });
   }

   //Replace title deadline
   todo.title = title;
   todo.deadline = deadline;
 
   return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
   const { id } = request.params;
   const { user } = request;
 
   const todo = user.todos.find((todo) => todo.id === id);
 
   if (!todo) {
     return response.status(404).json({ error: "Mensagem do erro" });
   }
   //Replace
   todo.done = true;
 
   return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
   const { id } = request.params;
   const { user } = request;
 
   const todo = user.todos.find((todo) => todo.id === id);
 
   if (!todo) {
     return response.status(404).json({ error: "Mensagem do erro" });
   }

   //Delete
   user.todos.splice(todo, 1);
 
   return response.status(204).json(todo);
});

module.exports = app;