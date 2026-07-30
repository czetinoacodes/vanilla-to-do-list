import './style.css'

let tasks = [];
let taskId = 1;
let currentFilter = 'all';


window.onload = function() {
    let savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        taskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }
    
    document.getElementById('addBtn').onclick = addTask;
    
    let filterButtons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].onclick = function() {
            filterTasks(this.getAttribute('data-filter'));
        };
    }
    
    document.getElementById('taskInput').onkeypress = function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    
    renderTasks();
    updateStats();
};

function addTask() {
    let input = document.getElementById('taskInput');
    let textoNuevaTarea = input.value;
    
    if (textoNuevaTarea == '') {
        alert('Por favor escribe una tarea');
        return;
    }
    

    let newTask = {
        id: taskId++,
        text: textoNuevaTarea,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();    
    input.value = '';
    
    renderTasks();
    updateStats();
}


function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 

    let filteredTasks = tasks;
    if (currentFilter == 'active') {
        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });
    } else if (currentFilter == 'completed') {
        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }
    

    for (let i = 0; i < filteredTasks.length; i++) {
        let taskDiv = crearElementoTarea(filteredTasks[i]);
        taskList.appendChild(taskDiv);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay tareas para mostrar</p>';
    }
}

function toggleTask(id) {
    let tarea = obtenerTareaPorId(id);
    
    if (tarea) {
        tarea.completed = !tarea.completed;
    }
    saveTasks();
    updateView();
}

function deleteTask(id) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id != id) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    saveTasks();    
    updateView();
}

function filterTasks(filter) {
    currentFilter = filter;
    
    let buttons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    if (filter == 'all') {
        buttons[0].classList.add('active');
    } else if (filter == 'active') {
        buttons[1].classList.add('active');
    } else {
        buttons[2].classList.add('active');
    }
    
    updateView();
}

function updateStats() {
    let total = tasks.length;
    let completed = 0;
    let active = 0;
    
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        } else {
            active++;
        }
    }
    
    let statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = 'Total: ' + total + ' | Completadas: ' + completed + ' | Activas: ' + active;
}

function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateView() {
    renderTasks();
    updateStats();
}

function obtenerTareaPorId(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
    return null;
}  

function crearElementoTarea(tarea) {
    let taskDiv = document.createElement('div');
    taskDiv.className = tarea.completed ? 'task-item completed' : 'task-item';
    
    taskDiv.innerHTML = 
        `<span>${tarea.text}</span>
        <div class="task-buttons">
          <button class="complete-btn" data-id="${tarea.id}">
            ${tarea.completed ? "Reactivar" : "Completar"}
          </button>
          <button class="delete-btn" data-id="${tarea.id}">Eliminar</button>
        </div>`;
    
    let completeBtn = taskDiv.querySelector('.complete-btn');
    let deleteBtn = taskDiv.querySelector('.delete-btn');
    
    completeBtn.onclick = function() {
        toggleTask(parseInt(this.getAttribute('data-id')));
    };
    
    deleteBtn.onclick = function() {
        deleteTask(parseInt(this.getAttribute('data-id')));
    };
    
    return taskDiv;
}