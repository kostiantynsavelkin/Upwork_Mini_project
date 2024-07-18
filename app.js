document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
  
    // Load todos from local storage and add them to the DOM
    const loadTodos = () => {
      const todos = JSON.parse(localStorage.getItem('todos')) || [];
      todos.forEach(todo => addTodoToDOM(todo));
    };
  
    // Save todos to local storage
    const saveTodos = (todos) => {
      localStorage.setItem('todos', JSON.stringify(todos));
    };
  
    // Add a todo item to the DOM
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
  
    // Add event listener to the 'Add' button
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
  
    // Load todos on page load
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
  
  // Register the service worker and listen for messages
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
        console.log('Maintenance mode:', event.data.isUnderMaintenance);
        toggleMaintenanceOverlay(event.data.isUnderMaintenance);
      }
    });
  
    // Check for maintenance mode on page load
    fetch('/static/isUnderMaintenance.json')
      .then(response => {
        console.log('Fetch response status:', response.status);
        if (response.ok) {
          console.log('Maintenance file found.');
          toggleMaintenanceOverlay(true);
        } else {
          console.log('Maintenance file not found.');
          toggleMaintenanceOverlay(false);
        }
      })
      .catch(error => {
        console.log('Fetch error:', error);
        console.log('Maintenance file not found (catch).');
        toggleMaintenanceOverlay(false);
      });
  }
  