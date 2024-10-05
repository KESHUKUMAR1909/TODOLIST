document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoinput");
  const submitButton = document.getElementById("addtodo");
  const filterbtns = document.getElementsByClassName("filterbtn");

  for (let btn of filterbtns) {
    btn.addEventListener("click", executefilterAction);
  }

  submitButton.addEventListener("click", (event) => {
    const todoText = todoInput.value;
    if (todoText === "") {
      alert("Please enter something in todo list");
    } else {
      addTodoToLocalStorage({ text: todoText, isCompleted: false });
      appendTodoInHtml({ text: todoText, isCompleted: false });
      todoInput.value = "";
    }
  });

  todoInput.addEventListener("change", (event) => {
    const todoText = event.target.value;
    event.target.value = todoText.trim();
    // console.log(event.target.value);
  });

  const todos = loadTodos();
  todos.todos.forEach(todo => {
    appendTodoInHtml(todo);
  });
});

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || { "todos": [] };
  // console.log(todos);
  return todos;
}

function addTodoToLocalStorage(todo) {
  const todos = loadTodos();
  todos.todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function appendTodoInHtml(todo) {
  const tasklist = document.getElementById("tasklist");

  const li = document.createElement("li");
  const textDiv = document.createElement("div");
 
  textDiv.textContent = todo.text;
  

  li.classList.add("todoitem");

  const wrapper = document.createElement("div");
  wrapper.classList.add("todobtns");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("editbtn");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("deletebtn");

  const completedButton = document.createElement("button");
  completedButton.textContent = "Complete";
  completedButton.classList.add("completebtn");

  li.appendChild(textDiv);
  wrapper.appendChild(editButton);
  wrapper.appendChild(deleteButton);
  wrapper.appendChild(completedButton);
  li.appendChild(wrapper);
  tasklist.appendChild(li);

  editButton.addEventListener("click", (event) => {
    edittodo(event);

  });

  deleteButton.addEventListener("click", (event) => {
    deletetodo(event);
   
  });

  completedButton.addEventListener("click", (event) => {
    completeStatus(event);
  });
}

function executefilterAction(event) {
  const tasklist = document.getElementById("tasklist");
  const element = event.target;
  const value = element.getAttribute("data-filter");
  // console.log(value);
  tasklist.innerHTML = "";
  const todos = loadTodos();

  if (value === "all") {
    todos.todos.forEach(todo => {
      appendTodoInHtml(todo);
    });
  } else if (value === "Pending") {
    todos.todos.forEach(todo => {
      if (!todo.isCompleted) {
        appendTodoInHtml(todo);
      }
    });
  } else {
    todos.todos.forEach(todo => {
      if (todo.isCompleted) {
        appendTodoInHtml(todo);
      }
    });
  }
}

function edittodo(event) {
  const li = event.target.closest("li");
  const textDiv = li.querySelector("div");
  const todoText = textDiv.textContent;
  const todoInput = document.getElementById("todoinput");
  todoInput.value = todoText;

  let updateButton = document.getElementById("updateButton");

  if (!updateButton) {
    updateButton = document.createElement("button");
    updateButton.id = "updateButton";
    updateButton.textContent = "Update";
    updateButton.classList.add("updatebtn");
    li.appendChild(updateButton);
  }

  updateButton.onclick = () => {
    const updatedValue = todoInput.value;
    textDiv.textContent = updatedValue;
    todoInput.value = "";
    updateButton.remove();
  };
}


function deletetodo(event) {
  const li = event.target.closest("li"); 
  const textDiv = li.querySelector("div");
  const todoText = textDiv.textContent;
  
 
  li.style.display = "none"; 

  
  const todos = loadTodos(); 
  const updatedTodos = todos.todos.filter(todo => todo.text !== todoText); 
  localStorage.setItem("todos", JSON.stringify({ todos: updatedTodos })); 
}

function completeStatus(event) {
  const li = event.target.closest("li"); 
  const textDiv = li.querySelector("div"); 
  const todoText = textDiv.textContent; 

  const todos = loadTodos(); 


  const todoToUpdate = todos.todos.find(todo => todo.text === todoText);
  
  if (todoToUpdate) {
    todoToUpdate.isCompleted = true;
    localStorage.setItem("todos", JSON.stringify(todos)); 

    
    textDiv.style.color = "blue"; 
    textDiv.style.fontSize= "x-large"; 
  }
}

