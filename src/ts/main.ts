import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

// Get references to DOM elements
document.addEventListener('DOMContentLoaded', () => {
     const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
     const taskInput = document.getElementById('taskInput') as HTMLInputElement;
     const taskList = document.getElementById('taskList') as HTMLUListElement;
     const doneTaskList = document.getElementById('doneTaskList') as HTMLUListElement;
 
     const createTaskItem = (taskText: string): HTMLLIElement => {
         const li = document.createElement('li');
         li.className = 'list-group-item d-flex align-items-center';
 
         // Create and add checkbox
         const checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.className = 'form-check-input me-2';
         checkbox.onclick = () => {
             if (checkbox.checked) {
                 finishTask(li);
             }
         };
 
         // Create and add text
         const text = document.createElement('span');
         text.textContent = taskText;
         text.className = 'flex-grow-1';
 
         // Create and add buttons
         const buttonGroup = document.createElement('div');
         buttonGroup.className = 'btn-group btn-group-sm';
 
         const deleteBtn = document.createElement('button');
         deleteBtn.className = 'btn btn-danger';
         deleteBtn.textContent = 'Delete';
         deleteBtn.onclick = () => li.remove();
 
         buttonGroup.appendChild(deleteBtn);
 
         // Append elements to the list item
         li.appendChild(checkbox);
         li.appendChild(text);
         li.appendChild(buttonGroup);
 
         return li;
     };
 
     const addTask = () => {
         const taskText = taskInput.value.trim();
         if (taskText === '') return;
 
         const taskItem = createTaskItem(taskText);
         taskList.appendChild(taskItem);
         taskInput.value = '';
     };
 
     const finishTask = (taskItem: HTMLLIElement) => {
         taskItem.remove();
 
         const doneItem = document.createElement('li');
         doneItem.className = 'list-group-item d-flex align-items-center';
         doneItem.textContent = taskItem.querySelector('span')?.textContent || '';
 
         doneTaskList.appendChild(doneItem);
     };
 
     addTaskBtn.addEventListener('click', addTask);
 
     taskInput.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
             addTask();
         }
     });
 });

// function createTaskItem(taskText: string): HTMLLIElement {
//   const li = document.createElement("li");
//   li.className =
//     "list-group-item d-flex justify-content-between align-items-center";

//   const text = document.createElement("span");
//   text.textContent = taskText;

//   const deleteBtn = document.createElement("button");
//   deleteBtn.className = "btn btn-danger btn-sm";
//   deleteBtn.textContent = "Delete";
//   deleteBtn.onclick = () => {
//     li.remove();
//   };

//   li.appendChild(text);
//   li.appendChild(deleteBtn);
//   return li;
// }

// function addTask() {
//   const taskText = taskInput.value.trim();
//   if (taskText) {
//     const taskItem = createTaskItem(taskText);
//     taskList.appendChild(taskItem);
//     taskInput.value = "";
//   }
// }

// addTaskBtn.addEventListener('click', addTask);

// taskInput.addEventListener('keypress', (e) => {
//      if (e.key === 'Enter') {
//        addTask();
//      }
//    });