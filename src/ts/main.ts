import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

// Helper function to create a task item
function createTaskItem(
  taskText: string,
  isChecked: boolean = false,
  isMobile: boolean = false
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex align-items-center";
  li.innerHTML = `
  <input type="checkbox" class="form-check-input me-2" ${isChecked ? "checked" : ""}>
  <span class="task-text">${taskText}</span>
  <div class="button-container">
    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
  </div>
`;

  const checkbox = li.querySelector(".form-check-input") as HTMLInputElement;
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      moveToDone(li, isMobile);
    } else {
      moveToTodo(li, isMobile);
    }
  });

  const deleteBtn = li.querySelector(".delete-btn") as HTMLButtonElement;
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks(); // Save tasks to local storage after deletion
  });

  const editBtn = li.querySelector(".edit-btn") as HTMLButtonElement;
  editBtn.addEventListener("click", () => {
    editTask(li);
  });

  return li;
}

function editTask(taskItem: HTMLLIElement) {
  const taskTextElement = taskItem.querySelector(
    ".task-text"
  ) as HTMLSpanElement;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control";
  input.value = taskTextElement.textContent || "";

  // Replace the task text with the input field
  taskItem.replaceChild(input, taskTextElement);
  input.focus();

  // Create and insert the save button
  const saveBtn = createSaveButton(taskItem, input, taskTextElement);
  taskItem.replaceChild(
    saveBtn,
    taskItem.querySelector(".edit-btn") as HTMLButtonElement
  );

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveBtn.click();
    }
  });
}

function createSaveButton(
  taskItem: HTMLLIElement,
  input: HTMLInputElement,
  taskTextElement: HTMLSpanElement
): HTMLButtonElement {
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-primary btn-sm ms-2";
  saveBtn.textContent = "Save";

  saveBtn.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText !== "") {
      taskTextElement.textContent = newText;
      taskItem.replaceChild(taskTextElement, input);
      const editBtn = createEditButton();
      taskItem.replaceChild(editBtn, saveBtn);
      // Reattach event listener for the new edit button
      editBtn.addEventListener("click", () => editTask(taskItem));
      saveTasks(); // Save tasks to local storage after editing
    }
  });

  return saveBtn;
}

// Helper function to create an edit button
function createEditButton(): HTMLButtonElement {
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary btn-sm ms-2 edit-btn";
  editBtn.textContent = "Edit";
  return editBtn;
}

// Function to add a task
// Updated function to add a task with task text parameter
function addTask(
  inputId: string,
  listId: string,
  isMobile: boolean = false,
  taskText: string | null = null
) {
  const taskList = document.getElementById(listId) as HTMLUListElement;
  const taskInput = document.getElementById(inputId) as HTMLInputElement;

  // If taskText is provided, use it; otherwise, get value from input
  const text = taskText || taskInput.value.trim();
  if (text === "") return;

  const taskItem = createTaskItem(text, false, isMobile);
  taskList.appendChild(taskItem);
  if (!taskText) {
    taskInput.value = "";
  }

  saveTasks(); // Save tasks to local storage after adding
}

// Function to move a task to the Done list
function moveToDone(taskItem: HTMLLIElement, isMobile: boolean) {
  taskItem.remove();
  const doneListId = isMobile ? "doneTaskListMobile" : "doneTaskListDesktop";
  const doneTaskList = document.getElementById(doneListId) as HTMLUListElement;
  const doneItem = createTaskItem(
    taskItem.querySelector(".task-text")!.textContent || "",
    true,
    isMobile
  );
  doneTaskList.appendChild(doneItem);
  saveTasks(); // Save tasks to local storage after moving
}

// Function to move a task back to the Todo list
function moveToTodo(taskItem: HTMLLIElement, isMobile: boolean) {
  taskItem.remove();
  const todoListId = isMobile ? "taskListMobile" : "taskListDesktop";
  const taskList = document.getElementById(todoListId) as HTMLUListElement;
  const todoItem = createTaskItem(
    taskItem.querySelector(".task-text")!.textContent || "",
    false,
    isMobile
  );
  taskList.appendChild(todoItem);
  saveTasks(); // Save tasks to local storage after moving
}

// Save tasks to local storage
function saveTasks() {
  // Save tasks for desktop
  const todoTasksDesktop = Array.from(
    document.querySelectorAll("#taskListDesktop .task-text")
  ).map((task) => task.textContent || "");
  const doneTasksDesktop = Array.from(
    document.querySelectorAll("#doneTaskListDesktop .task-text")
  ).map((task) => task.textContent || "");

  localStorage.setItem("todoTasksDesktop", JSON.stringify(todoTasksDesktop));
  localStorage.setItem("doneTasksDesktop", JSON.stringify(doneTasksDesktop));

  console.log("Saved desktop tasks:", {
    todoTasksDesktop,
    doneTasksDesktop,
  });

  // Save tasks for mobile
  const todoTasksMobile = Array.from(
    document.querySelectorAll("#taskListMobile .task-text")
  ).map((task) => task.textContent || "");
  const doneTasksMobile = Array.from(
    document.querySelectorAll("#doneTaskListMobile .task-text")
  ).map((task) => task.textContent || "");

  localStorage.setItem("todoTasksMobile", JSON.stringify(todoTasksMobile));
  localStorage.setItem("doneTasksMobile", JSON.stringify(doneTasksMobile));

  console.log("Saved mobile tasks:", {
    todoTasksMobile,
    doneTasksMobile,
  });
}

// Load tasks from local storage
function loadTasks() {
  // Load tasks for desktop
  const todoTasksDesktop: string[] = JSON.parse(
    localStorage.getItem("todoTasksDesktop") || "[]"
  );
  const doneTasksDesktop: string[] = JSON.parse(
    localStorage.getItem("doneTasksDesktop") || "[]"
  );

  todoTasksDesktop.forEach((task: string) =>
    addTask("taskInputDesktop", "taskListDesktop", false, task)
  );
  doneTasksDesktop.forEach((task: string) =>
    addTask("taskInputDesktop", "doneTaskListDesktop", false, task)
  );

  // Load tasks for mobile
  const todoTasksMobile: string[] = JSON.parse(
    localStorage.getItem("todoTasksMobile") || "[]"
  );
  const doneTasksMobile: string[] = JSON.parse(
    localStorage.getItem("doneTasksMobile") || "[]"
  );

  console.log("Todo tasks for mobile:", todoTasksMobile);
  console.log("Done tasks for mobile:", doneTasksMobile);

  todoTasksMobile.forEach((task: string) =>
    addTask("taskInputMobile", "taskListMobile", true, task)
  );
  doneTasksMobile.forEach((task: string) =>
    addTask("taskInputMobile", "doneTaskListMobile", true, task)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks(); // Load tasks when the page is loaded

  // Desktop view
  const addTaskBtnDesktop = document.getElementById(
    "addTaskBtnDesktop"
  ) as HTMLButtonElement;
  addTaskBtnDesktop.addEventListener("click", () =>
    addTask("taskInputDesktop", "taskListDesktop")
  );

  const taskInputDesktop = document.getElementById(
    "taskInputDesktop"
  ) as HTMLInputElement;
  taskInputDesktop.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask("taskInputDesktop", "taskListDesktop");
    }
  });

  // Mobile view
  const addTaskBtnMobile = document.getElementById(
    "addTaskBtnMobile"
  ) as HTMLButtonElement;
  addTaskBtnMobile.addEventListener("click", () =>
    addTask("taskInputMobile", "taskListMobile", true)
  );

  const taskInputMobile = document.getElementById(
    "taskInputMobile"
  ) as HTMLInputElement;
  taskInputMobile.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask("taskInputMobile", "taskListMobile", true);
    }
  });

  // Save tasks when the page is unloaded
  window.addEventListener("beforeunload", saveTasks);
});
