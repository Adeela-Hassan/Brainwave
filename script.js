document.addEventListener('DOMContentLoaded', loadTodos);
document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('todo-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
document.getElementById('filter-tasks').addEventListener('change', filterTasks);
document.getElementById('clear-btn').addEventListener('click', clearAllTasks);

function addTask() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();

    if (task !== "") {
        const todo = { task, completed: false };
        saveToLocalStorage(todo);
        addTodoElement(todo);
        input.value = "";
    }
}

function addTodoElement(todo) {
    const todoList = document.getElementById('todo-list');

    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `<span>${todo.task}</span><button>Delete</button>`;

    if (todo.completed) {
        li.classList.add('completed');
    }

    li.querySelector('span').addEventListener('click', function() {
        toggleComplete(li, todo);
    });
    li.querySelector('button').addEventListener('click', function() {
        removeFromLocalStorage(todo);
        todoList.removeChild(li);
    });

    todoList.appendChild(li);
}

function toggleComplete(li, todo) {
    todo.completed = !todo.completed;
    
    if (todo.completed) {
        li.classList.add('completed');
    } else {
        li.classList.remove('completed');
    }

    updateLocalStorage(todo);
}

function saveToLocalStorage(todo) {
    const todos = getTodosFromLocalStorage();
    todos.push(todo);
    saveTodosToLocalStorage(todos);
}

function updateLocalStorage(updatedTodo) {
    const todos = getTodosFromLocalStorage();
    const index = todos.findIndex(todo => todo.task === updatedTodo.task);
    if (index !== -1) {
        todos[index] = updatedTodo;
        saveTodosToLocalStorage(todos);
    }
}

function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function loadTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(addTodoElement);
}

function removeFromLocalStorage(todoToRemove) {
    const todos = getTodosFromLocalStorage();
    const filteredTodos = todos.filter(todo => todo.task !== todoToRemove.task);
    saveTodosToLocalStorage(filteredTodos);
}

function filterTasks() {
    const filter = document.getElementById('filter-tasks').value;
    const todos = document.querySelectorAll('.todo-item');

    todos.forEach(todo => {
        switch (filter) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'active':
                todo.style.display = todo.classList.contains('completed') ? 'none' : 'flex';
                break;
        }
    });
}

function clearAllTasks() {
    localStorage.removeItem('todos');
    document.getElementById('todo-list').innerHTML = '';
}
