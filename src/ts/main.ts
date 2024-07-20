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
       <input type="checkbox" class="form-check-input me-2" ${
         isChecked ? "checked" : ""
       }>
       <span class="task-text">${taskText}</span>
       ${
         isMobile
           ? '<button class="btn btn-danger btn-sm ms-2 delete-btn">Delete</button>'
           : ""
       }
       <button class="btn btn-secondary btn-sm ms-2 edit-btn">Edit</button>
     `;

  const checkbox = li.querySelector(".form-check-input") as HTMLInputElement;
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      moveToDone(li, isMobile);
    } else {
      moveToTodo(li, isMobile);
    }
  });

  const editBtn = li.querySelector(".edit-btn") as HTMLButtonElement;
  editBtn.addEventListener("click", () => {
    editTask(li);
  });

  if (isMobile) {
    const deleteBtn = li.querySelector(".delete-btn") as HTMLButtonElement;
    deleteBtn.addEventListener("click", () => {
      li.remove();
    });
  }

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
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-primary btn-sm ms-2";
  saveBtn.textContent = "Save";
  taskItem.replaceChild(
    saveBtn,
    taskItem.querySelector(".edit-btn") as HTMLButtonElement
  );

  saveBtn.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText !== "") {
      // Update the text content and switch back to the original view
      taskTextElement.textContent = newText;
      taskItem.replaceChild(taskTextElement, input);

      // Reinsert the edit button
      taskItem.replaceChild(createEditButton(), saveBtn);
    }
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveBtn.click();
    }
  });
}

// Helper function to create an edit button
function createEditButton(): HTMLButtonElement {
     const editBtn = document.createElement('button');
     editBtn.className = 'btn btn-secondary btn-sm ms-2 edit-btn';
     editBtn.textContent = 'Edit';
     return editBtn;
   }

// Function to add a task
function addTask(inputId: string, listId: string, isMobile: boolean = false) {
  const taskInput = document.getElementById(inputId) as HTMLInputElement;
  const taskList = document.getElementById(listId) as HTMLUListElement;
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const taskItem = createTaskItem(taskText, false, isMobile);
  taskList.appendChild(taskItem);
  taskInput.value = "";
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
}

document.addEventListener("DOMContentLoaded", () => {
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
});
