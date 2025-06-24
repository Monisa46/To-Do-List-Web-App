// ===============================
// TO-DO LIST APP JAVASCRIPT LOGIC
// ===============================

// Data Structure
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM References
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const newTask = {
    text,
    completed: false,
    timestamp: new Date().toLocaleString()
  };

  tasks.push(newTask);
  saveTasks();
  taskInput.value = '';
  renderTasks(currentFilter);
}

// Edit Task
function editTask(index) {
  const updatedText = prompt('Edit task:', tasks[index].text);
  if (updatedText !== null && updatedText.trim() !== '') {
    tasks[index].text = updatedText.trim();
    saveTasks();
    renderTasks(currentFilter);
  }
}

// Delete Task
function deleteTask(index) {
  if (confirm('Delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(currentFilter);
  }
}

// Toggle Completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(currentFilter);
}

// Current Filter
let currentFilter = 'all';

// Filter Tasks
function filterTasks(type) {
  currentFilter = type;
  renderTasks(type);
}

// Render Tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    if (
      (filter === 'completed' && !task.completed) ||
      (filter === 'pending' && task.completed)
    ) return;

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div class="form-check">
        <input type="checkbox" class="form-check-input me-2" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <span class="${task.completed ? 'task-complete' : ''}">${task.text}</span>
        <small class="text-muted d-block">${task.timestamp}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-info me-1" onclick="editTask(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  if (tasks.length === 0) {
    taskList.innerHTML = `<li class="list-group-item text-center text-muted">No tasks yet.</li>`;
  }
}

// Clear All Tasks (Optional Function)
function clearAllTasks() {
  if (confirm('Clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Search Tasks (Optional Enhancement)
function searchTasks(keyword) {
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(keyword.toLowerCase()));
  renderFilteredList(filtered);
}

// Render Searched List
function renderFilteredList(filteredTasks) {
  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="list-group-item text-center text-muted">No matching tasks.</li>`;
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div class="form-check">
        <input type="checkbox" class="form-check-input me-2" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <span class="${task.completed ? 'task-complete' : ''}">${task.text}</span>
        <small class="text-muted d-block">${task.timestamp}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-info me-1" onclick="editTask(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Event: Enter key adds task
taskInput.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Auto-Focus on Input
window.onload = function () {
  renderTasks();
  taskInput.focus();
};
