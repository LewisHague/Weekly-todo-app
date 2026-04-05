const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const list = document.getElementById('taskList');
const daySelector = document.getElementById('daySelector');

let currentDay = daySelector.value;
let tasks = [];

// Create Empty Message Element
const emptyMessage = document.createElement('p');
emptyMessage.innerHTML = "📭 No tasks yet for this day";
emptyMessage.classList.add('empty-message');
list.after(emptyMessage);

function updateEmptyMessage() {
  if (tasks.length === 0) {
    emptyMessage.classList.add('show');
  } else {
    emptyMessage.classList.remove('show');
  }
}

// Initial Load
loadTasks();

// Change day listener
daySelector.addEventListener('change', () => {
  currentDay = daySelector.value;
  loadTasks();
});

// Add task listener
addBtn.addEventListener('click', () => {
  if (!input.value.trim()) return;

  addTaskToDOM(input.value, false, true);
  tasks.push({ text: input.value, done: false });
  saveTasks();

  input.value = '';
  updateEmptyMessage();
});

// Allow "Enter" key to add task
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Clear all tasks
clearBtn.addEventListener('click', () => {
  list.innerHTML = '';
  tasks = [];
  saveTasks();
  updateEmptyMessage();
});

// Build the task in the UI
function addTaskToDOM(text, done, animate = false) {
  const li = document.createElement('li');

  const spanText = document.createElement('span');
  spanText.textContent = text;
  if (done) spanText.classList.add('done');
  li.appendChild(spanText);

  const iconContainer = document.createElement('div');
  iconContainer.classList.add('icon-container');

  const doneIcon = document.createElement('span');
  doneIcon.textContent = '✔️';
  doneIcon.classList.add('icon');

  const deleteIcon = document.createElement('span');
  deleteIcon.textContent = '🗑️';
  deleteIcon.classList.add('icon');

  iconContainer.appendChild(doneIcon);
  iconContainer.appendChild(deleteIcon);
  li.appendChild(iconContainer);

  if (animate) {
    li.classList.add('bounce');
    setTimeout(() => li.classList.remove('bounce'), 200);
  }

  // Done click
  doneIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    spanText.classList.toggle('done');
    li.classList.add('bounce');
    setTimeout(() => li.classList.remove('bounce'), 200);
    updateTasksArray();
    saveTasks();
  });

  // Delete click
  deleteIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    updateTasksArray();
    saveTasks();
    updateEmptyMessage();
  });

  list.appendChild(li);
}

function updateTasksArray() {
  tasks = [];
  list.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('span').textContent;
    const done = li.querySelector('span').classList.contains('done');
    tasks.push({ text, done });
  });
}

function saveTasks() {
  localStorage.setItem('tasks-' + currentDay, JSON.stringify(tasks));
}

function loadTasks() {
  // This line triggers your CSS background colors!
  document.body.setAttribute('data-day', currentDay);
  
  list.innerHTML = '';
  tasks = JSON.parse(localStorage.getItem('tasks-' + currentDay)) || [];
  tasks.forEach(task => addTaskToDOM(task.text, task.done));
  updateEmptyMessage();
}