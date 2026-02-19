const modal = document.getElementById('task-modal');
const input = document.getElementById('input-task');
const sound = document.getElementById('success-sound');

function openModal() { modal.style.display = 'grid'; input.focus(); }
function closeModal() { modal.style.display = 'none'; input.value = ''; }

// Função para enviar com Enter
function handleEnter(event) {
    if (event.key === 'Enter') {
        createNewTask();
    }
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const targetColumn = ev.target.closest('.kanban-column');
    const dropzone = targetColumn.querySelector('.task-zone');
    
    dropzone.appendChild(document.getElementById(data));
    
    // Tocar som se cair na coluna "Feito"
    if (targetColumn.id === 'done') {
        sound.currentTime = 0;
        sound.play();
    }
    
    updateCounts();
}

function createNewTask() {
    if (input.value.trim() === "") return;

    const id = 'task-' + Date.now();
    const task = document.createElement('div');
    task.className = 'task-card';
    task.id = id;
    task.draggable = true;
    task.ondragstart = drag;

    task.innerHTML = `
        <p>${input.value}</p>
        <i class="fas fa-trash delete-icon" onclick="removeTask('${id}')"></i>
    `;

    document.getElementById('todo-list').appendChild(task);
    closeModal();
    updateCounts();
}

function removeTask(id) {
    document.getElementById(id).remove();
    updateCounts();
}

function updateCounts() {
    document.getElementById('todo-count').innerText = document.getElementById('todo-list').children.length;
    document.getElementById('doing-count').innerText = document.getElementById('doing-list').children.length;
    document.getElementById('done-count').innerText = document.getElementById('done-list').children.length;
}
