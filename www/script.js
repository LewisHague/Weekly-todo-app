const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const list = document.getElementById('taskList');
const daySelector = document.getElementById('daySelector');

let currentDay = daySelector.value;
let tasks = JSON.parse(localStorage.getItem('tasks-' + currentDay)) || [];

// 📭 Empty message
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

// Load initial tasks
tasks.forEach(task => addTaskToDOM(task.text, task.done));
updateEmptyMessage();

// Change day
daySelector.addEventListener('change', () => {
  saveTasks();
  currentDay = daySelector.value;
  loadTasks();
});

// Add task
addBtn.addEventListener('click', () => {
  if (!input.value) return;

  addTaskToDOM(input.value, false, true);
  tasks.push({ text: input.value, done: false });
  saveTasks();

  input.value = '';
  updateEmptyMessage();
});

// Clear all
clearBtn.addEventListener('click', () => {
  list.innerHTML = '';
  tasks = [];
  saveTasks();
  updateEmptyMessage();
});

// Create task
function addTaskToDOM(text, done, animate=false) {
  const li = document.createElement('li');

  const spanText = document.createElement('span');
  spanText.textContent = text;
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

  if (done) spanText.classList.add('done');

  if (animate) {
    li.classList.add('bounce');
    setTimeout(() => li.classList.remove('bounce'), 200);
  }

  doneIcon.addEventListener('click', () => {
    spanText.classList.toggle('done');
    li.classList.add('bounce');
    setTimeout(() => li.classList.remove('bounce'), 200);
    updateTasksArray();
    saveTasks();
  });

  deleteIcon.addEventListener('click', () => {
    li.remove();
    updateTasksArray();
    saveTasks();
    updateEmptyMessage();
  });

  list.appendChild(li);
}

// Update tasks array
function updateTasksArray() {
  tasks = [];
  list.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('span').textContent;
    const done = li.querySelector('span').classList.contains('done');
    tasks.push({ text, done });
  });
  updateEmptyMessage();
}

// Save
function saveTasks() {
  localStorage.setItem('tasks-' + currentDay, JSON.stringify(tasks));
}

// Load
function loadTasks() {
  list.innerHTML = '';
  tasks = JSON.parse(localStorage.getItem('tasks-' + currentDay)) || [];
  tasks.forEach(task => addTaskToDOM(task.text, task.done));
  updateEmptyMessage();
}
