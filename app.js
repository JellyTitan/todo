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
  // Modify task event
  taskList.addEventListener('click', modifyTask);
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

  // // create repeat button.
  // const repeat = '<a href="#" class="repeat off"><i class="fa-solid fa-repeat"></i></a>';

  // create repeat button.
  const repeat = document.createElement('a');
  // Add class 
  repeat.className = 'repeat-item secondary-content';
  // Add icon html 
  repeat.innerHTML = '<i class="fa-solid fa-repeat fa-spin">';
  // Append the link to the li
  li.appendChild( repeat);

  // Create close button element.
  closeButton = createCloseButton();
  // Append close button to the li.
  li.appendChild(closeButton);

  // Append li to ul
  taskList.appendChild(li);
  // Store in LS
  storeTaskInLocalStorage(taskInput.value);
  //clear input
  taskInput.value = '';
  e.preventDefault();
}

// Remove Task
function modifyTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    console.log(e.target);
    e.target.parentElement.parentElement.remove();
    // Remove from LS
    removeTaskFromLocalStorage(e.target.parentElement.parentElement);
  }
  else if (e.target.parentElement.classList.contains('repeat-item')) {
    console.log(e.target);
    // e.target.parentElement.parentElement.remove();
  }
}

// Remove task from storage.
function removeTaskFromLocalStorage(taskItem) {
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
  // Get tasks from LS
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || []; 
  for (const [task_text, task_attributes] of Object.entries(tasksObj)) {
    // console.log(`${task_text}: ${task_attributes}`);
    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = "collection-item";
    // Create text node and append to li - pulling from the storage here instead of field content.
    li.appendChild(document.createTextNode(task_text));
    // Create close button element.
    closeButton = createCloseButton();
    // Append close button to the li
    li.appendChild(closeButton);
    // Append li to ul
    taskList.appendChild(li);
  }
}

/**
 * Returns html element for a close button.
 * 
 * @see getTasks()
 * @see addTask()
 * @todo strip down font stack and serve locally.
 */
function createCloseButton() {
  // Create new link element.
  const link = document.createElement('a');
  // Add classes.
  link.className = 'delete-item secondary-content';
  // Add icon html.
  link.innerHTML = '<i class="fa fa-remove"></i>';
  // Send it back.
  return link;
}

// Store in LS
function storeTaskInLocalStorage(task) {
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
