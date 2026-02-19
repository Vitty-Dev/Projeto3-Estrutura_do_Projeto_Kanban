// Abrir/Fechar Modal
const modal = document.getElementById('modal');
const input = document.getElementById('task-text');

function openModal() { modal.style.display = 'grid'; input.focus(); }
function closeModal() { modal.style.display = 'none'; input.value = ''; }

// Arrastar e Soltar
function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const dropzone = ev.target.closest('.column').querySelector('.tasks-container');
    dropzone.appendChild(document.getElementById(data));
    updateCounters();
}

// Criar Tarefa
function addTask() {
    if (input.value.trim() === "") return;

    const id = 'task-' + Date.now();
    const task = document.createElement('div');
    task.className = 'task-card';
    task.id = id;
    task.draggable = true;
    task.ondragstart = drag;

    task.innerHTML = `
        <p>${input.value}</p>
        <button class="btn-delete" onclick="deleteTask('${id}')">
            <i class="fas fa-trash"></i>
        </button>
    `;

    document.getElementById('todo-list').appendChild(task);
    closeModal();
    updateCounters();
}

// Excluir Tarefa
function deleteTask(id) {
    const task = document.getElementById(id);
    task.style.opacity = '0';
    setTimeout(() => {
        task.remove();
        updateCounters();
    }, 200);
}

// Atualizar Contadores
function updateCounters() {
    document.getElementById('todo-count').innerText = document.getElementById('todo-list').children.length;
    document.getElementById('doing-count').innerText = document.getElementById('doing-list').children.length;
    document.getElementById('done-count').innerText = document.getElementById('done-list').children.length;
}
