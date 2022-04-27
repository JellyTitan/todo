// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event lilsteners
loadEventListners();

function loadEventListners() {
  // Dom Load event
  document.addEventListener('DOMContentLoaded', getTasks);

  // Add task event
  form.addEventListener('submit', addTask);

  // Remove ttask event
  taskList.addEventListener('click', removeTask);

  // Clear task event
  clearBtn.addEventListener('click', clearTasks);

  // Filter tasks event
  filter.addEventListener('keyup', filterTasks);
}

// Add Task
function addTask(e) {
  if (taskInput.value === '' ) {
    alert('Add a task');
    return;
  }
  // Create li element
  const li = document.createElement('li');
  // Add class
  li.className = "collection-item";
  
  // Create text node and append to li
  li.appendChild(document.createTextNode(taskInput.value));
  
  // Create new link element
  const link = document.createElement('a');
  // Add class 
  link.className = 'delete-item secondary-content';
  // Add icon html 
  link.innerHTML = '<i class="fa fa-remove"></i>';


  // Append the link to the li
  li.appendChild(link);
  
  // Append li to ul
  taskList.appendChild(li);
  
  // Store in LS
  storeTaskInLocalStorage(taskInput.value);
  //clear input
  taskInput.value = '';
  e.preventDefault();
}

// Remove Task
function removeTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    console.log(e.target);
    e.target.parentElement.parentElement.remove();
    // Remove from LS
    removeTaskFromLocalStorage(e.target.parentElement.parentElement);
  }
}

// Remove task from storage.
function removeTaskFromLocalStorage(taskItem) {
  // Get tasks from LS.
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  // Remove task from Array.
  tasks.forEach((task, index) => {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Get tasks from LS.
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || {};
  // Remove task.
  // @todo if there are multiple tasks with the same text, this will delete them
  // all. Rewire to check task text & prioirty.
  if (tasksObj.hasOwnProperty(taskItem.textContent)) {
    delete tasksObj[taskItem.textContent];
  }

  // Set back to local storage.
  localStorage.setItem('tasksObj', JSON.stringify(tasksObj));
}

// Clear tasks
function clearTasks() {
  if (confirm('Are You sure?')) {
    // Wipe out all li from the ul.
    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
    // Clear from LS
    clearTasksFromLocalStorage();
  }
}

// Clear from LS
function clearTasksFromLocalStorage() {
  if (localStorage.getItem('tasks') !== null) {
    localStorage.removeItem('tasks');
  }
  if (localStorage.getItem('tasksObj') !== null) {
    localStorage.removeItem('tasksObj');
  }
}

// Filter tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.collection-item').forEach
  (function(task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
  console.log(text);
}

// Get tasks from LS
// @todo - inside the foreach is duplicated - DRY
function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  } 
  tasks.forEach(function(task) {
     // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = "collection-item";
    // Create text node and append to li - pulling from the storage here instead of field content.
    li.appendChild(document.createTextNode(task));
    // Create new link element
    const link = document.createElement('a');
    // Add class 
    link.className = 'delete-item secondary-content';
    // Add icon html 
    link.innerHTML = '<i class="fa fa-remove"></i>';
    // Append the link to the li
    li.appendChild(link);
    // Append li to ul
    taskList.appendChild(li);
  })
}

// Store in LS
function storeTaskInLocalStorage(task) {
  // Get tasks from LS.
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  // Add the new task
  tasks.push(task);
  // Set back to local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Get tasks from LS.
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || {};
  // Add the new task.
  tasksObj[task] = { 
    'created': new Date().getTime(),
    'sequence' : 1,
    'reoccuring' : 0,
    'time-estimate': 0,
    'tags': [],
  }
  // Set back to local storage.
  // @todo: post to Google sheets API for portability.
  localStorage.setItem('tasksObj', JSON.stringify(tasksObj));
  // console.dir(tasksObj);
}
