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
  li.setAttribute("draggable", true);
  // Create status faux radio button.
  checkButton = createCheckButton();
  // Append close button to the li
  li.appendChild(checkButton);

  // Create text node and append to li
  li.appendChild(document.createTextNode(taskInput.value));

  // Create repeat button element.
  repeatButton = createRepeatButton();
  // Append the link to the li
  li.appendChild(repeatButton);

  // Create close button element.
  closeButton = createCloseButton();
  // Append close button to the li.
  li.appendChild(closeButton);

  // Append li to ul
  taskList.appendChild(li);

  li.addEventListener('dragstart', handleDragStart);
  li.addEventListener('dragend', handleDragEnd);

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
    // Add class to visually indicate on/off status.
    e.target.parentElement.classList.toggle('repeat-on');
    e.target.parentElement.classList.contains('repeat-on') ? updateRepeatStatus(e.target.parentElement.parentElement, 1) : updateRepeatStatus(e.target.parentElement.parentElement, 0);
  } else if (e.target.parentElement.classList.contains('complete-status')) {
    // Add class to visually indicate on/off status.
    e.target.parentElement.classList.toggle('completed');
    // @todo: this could be a one-liner using map array:
    // ['left-to-right', 'right-to-left'].map(v=> group.classList.toggle(v) ) 
    e.target.classList.toggle('fa-circle-dot');
    e.target.classList.toggle('fa-circle-check');
    e.target.parentElement.classList.contains('completed') ? updateCompleteStatus(e.target.parentElement.parentElement, 1) : updateCompleteStatus(e.target.parentElement.parentElement, 0);
  }
}

/**
 * Update repeat status in the task object.
 * 
 * @todo verbose error handling.
 */
function updateRepeatStatus(taskItem, repeatStatus = 0) {
  // Get tasks from LS.
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || {};
  // Update repeat status.
  if (tasksObj.hasOwnProperty(taskItem.textContent)) {
    tasksObj[taskItem.textContent].repeat = repeatStatus;
  }
  // console.dir(tasksObj);
  // Set back to local storage.
  localStorage.setItem('tasksObj', JSON.stringify(tasksObj));
}

/**
 * Update complete status in the task object.
 * 
 * @todo verbose error handling.
 */
function updateCompleteStatus(taskItem, completeStatus = 0) {
  // Get tasks from LS.
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || {};
  // Update repeat status.
  if (tasksObj.hasOwnProperty(taskItem.textContent)) {
    tasksObj[taskItem.textContent].complete = completeStatus;
  }
  // Set back to local storage.
  localStorage.setItem('tasksObj', JSON.stringify(tasksObj));
  console.dir(tasksObj);
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

/**
 * Updates task sequence in tasks object
 */
function updateSequence(tasksObj) {
  // @todo - there must be a more elegant way to do this?
  // let i = 1;
  // for (const [task_text, task_attributes] of Object.entries(tasksObj)) {
  //   task_attributes.sequence = i;
  //   i++;
  // }
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
    li.setAttribute("draggable", true);

    // Create status faux radio button.
    checkButton = createCheckButton();
    // Append close button to the li
    li.appendChild(checkButton);

    // Create text node and append to li - pulling from the storage here instead of field content.
    li.appendChild(document.createTextNode(task_text));
    
    // Create close button element.
    closeButton = createCloseButton();
    // Append close button to the li
    li.appendChild(closeButton);

    // Create repeat button element.
    repeatButton = createRepeatButton(task_attributes.repeat);
    // Append the link to the li
    li.appendChild(repeatButton);

    // Append li to ul
    taskList.appendChild(li);

    // Set draggable event listener.
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
  }
}

/**
 * Returns html element for a close button.
 * 
 * @see getTasks()
 * @see addTask()
 * @todo strip down font stack and serve locally.
 * @todo Add padding to buttons for easier mobile tap.
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

/**
 * Returns html element for a 'repeat' icon.
 * 
 * @param: repeat_status bool
 * 
 * @see getTasks()
 * @see addTask()
 * @todo strip down font stack and serve locally.
 */
function createRepeatButton(repeat_status = 0) {
  // create repeat button.
  const repeat = document.createElement('a');
  // Add class 
  repeat.className = 'repeat-item secondary-content';
  // Add additional class status.
  repeat.className += repeat_status ? ' repeat-on' : '';
  // Add icon html 
  repeat.innerHTML = '<i class="fa-solid fa-repeat fa-spin">';
  // Send it back.
  return repeat;
}

/**
 * Returns html element for a 'check' icon.
 * 
 * @param: repeat_status bool
 * 
 * @see getTasks()
 * @see addTask()
 * @todo strip down font stack and serve locally.
 */
function createCheckButton(check_status = 0) {
  // create repeat button.
  const checkButton = document.createElement('a');
  // Add class 
  checkButton.className = 'complete-status ';
  // Add additional class status.
  checkButton.className += check_status ? '' : 'completed';
  // Add additional class status.
  checkButtonClass = check_status ? 'fa-circle-check' : 'fa-circle-dot';
  // Add icon html 
  checkButton.innerHTML = `<i class="fa-solid ${checkButtonClass}">`;
  // Send it back.
  return checkButton;
}

// Store in LS
function storeTaskInLocalStorage(task) {
  // Get tasks from LS.
  let tasksObj = JSON.parse(localStorage.getItem('tasksObj')) || {};
  // Add the new task.
  tasksObj[task] = { 
    'complete' : 0,
    'created': new Date().getTime(),
    'repeat' : 0,
    'sequence' : Object.keys(tasksObj).length + 1,
    'tags': [],
    'time-estimate': 0,
  }
  // Set back to local storage.
  // @todo: post to Google sheets API for portability.
  localStorage.setItem('tasksObj', JSON.stringify(tasksObj));
  console.dir(tasksObj);
}

function handleDragStart(e) {
  this.style.opacity = '0.1';
}

function handleDragEnd(e) {
  this.style.opacity = '1';
}
