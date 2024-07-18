document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
  
    const loadTodos = () => {
      const todos = JSON.parse(localStorage.getItem('todos')) || [];
      todos.forEach(todo => addTodoToDOM(todo));
    };
  
    const saveTodos = (todos) => {
      localStorage.setItem('todos', JSON.stringify(todos));
    };
  
    const addTodoToDOM = (todo) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = todo;
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        li.remove();
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const newTodos = todos.filter(t => t !== todo);
        saveTodos(newTodos);
      };
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    };
  
    addTodoBtn.addEventListener('click', () => {
      const todo = todoInput.value.trim();
      if (todo) {
        addTodoToDOM(todo);
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        saveTodos(todos);
        todoInput.value = '';
      }
    });
  
    loadTodos();
  });
  
  // Function to show or hide the maintenance overlay
  const toggleMaintenanceOverlay = (isUnderMaintenance) => {
    const overlay = document.getElementById('maintenance-overlay');
    if (isUnderMaintenance) {
      overlay.classList.remove('d-none');
    } else {
      overlay.classList.add('d-none');
    }
  };
  
  // Listen for messages from the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.type === 'maintenance') {
        toggleMaintenanceOverlay(event.data.isUnderMaintenance);
      }
    });
  
    // Check for maintenance mode on page load
    fetch('/static/isUnderMaintenance.json')
      .then(response => {
        if (response.ok) {
          toggleMaintenanceOverlay(true);
        } else {
          toggleMaintenanceOverlay(false);
        }
      })
      .catch(() => {
        toggleMaintenanceOverlay(false);
      });
  }
  