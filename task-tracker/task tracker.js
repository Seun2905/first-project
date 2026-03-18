const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filter = document.getElementById('filter');
const prioritySelect = document.getElementById('priority');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const dueDateInput = document.getElementById('dueDate');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = true;

// Save tasks to LocalStorage
function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

// Render tasks
function renderTasks() {
  const searchText = searchInput.value.toLowerCase();
  const filterValue = filter.value;
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    if (filterValue === 'completed' && !task.completed) return;
    if (filterValue === 'pending' && task.completed) return;
    if (task.text.toLowerCase().indexOf(searchText) === -1) return;

    const li = document.createElement('li');
    li.className = task.completed ? `completed ${task.priority}` : task.priority;
    li.draggable = true;

    // Overdue check
    const now = new Date();
    if (task.dueDate && new Date(task.dueDate) < now && !task.completed) li.classList.add('overdue');

    li.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', index));
    li.addEventListener('dragover', e => e.preventDefault());
    li.addEventListener('drop', e => {
      e.preventDefault();
      const from = e.dataTransfer.getData('text/plain');
      const [moved] = tasks.splice(from, 1);
      tasks.splice(index, 0, moved);
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text + (task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleString()})` : '');
    li.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.className = 'complete';
    completeBtn.onclick = () => { task.completed = !task.completed; saveTasks(); renderTasks(); };
    actions.appendChild(completeBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit';
    editBtn.onclick = () => {
      const newText = prompt('Update task:', task.text);
      if (newText && newText.trim() !== '') { task.text = newText.trim(); saveTasks(); renderTasks(); }
    };
    actions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete';
    delBtn.onclick = () => {
      li.style.opacity = '0';
      li.style.transform = 'translateY(20px)';
      setTimeout(() => { tasks.splice(index, 1); saveTasks(); renderTasks(); }, 300);
    };
    actions.appendChild(delBtn);

    li.appendChild(actions);
    taskList.appendChild(li);
    setTimeout(() => li.classList.add('show'), 10);
  });
}

// Add task
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return alert('Enter a task!');
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value ? dueDateInput.value : null;
  tasks.push({ text, completed: false, priority, dueDate });
  taskInput.value = '';
  dueDateInput.value = '';
  saveTasks();
  renderTasks();
});

// Filter and Search
filter.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

// Theme Toggle
themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  themeToggle.textContent = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Export Tasks
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import Tasks
importInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) { tasks = tasks.concat(imported); saveTasks(); renderTasks(); }
    } catch(err) { alert('Invalid JSON file'); }
  };
  reader.readAsText(file);
  importInput.value = '';
});

// Notification for overdue tasks (checks every minute)
setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.completed && task.dueDate && new Date(task.dueDate) <= now && !task.notified) {
      if (Notification.permission === "granted") {
        new Notification("Task Reminder", { body: `${task.text} is due!` });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
      task.notified = true;
      saveTasks();
      renderTasks();
    }
  });
}, 60000);

// Initial render
renderTasks();