import "../scss/styles.scss";

function createTodoElement(todoText: string): HTMLElement {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  li.textContent = todoText;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "float-end");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    li.remove(); // Remove the todo when delete button is clicked
  });
  li.appendChild(deleteBtn);
  return li;
}

function addTodoHandler() {
  const todoInput = document.getElementById("todo-input") as HTMLInputElement | null;
  const todoList = document.getElementById("todo-list");

  if (!todoInput || !todoList) {
     console.error('Cannot find todo-input or todo-list element.');
     return;
   }

  if (todoInput.value.trim() === "") {
    alert("Please enter a valid todo.");
    return;
  }

  const newTodo = createTodoElement(todoInput.value.trim());
  todoList.appendChild(newTodo);
  todoInput.value = ""; // Clear the input field after adding the todo
}

const addTodoBtn = document.getElementById('add-todo-btn');
addTodoBtn?.addEventListener('click', addTodoHandler);