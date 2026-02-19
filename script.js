function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const dropzone = ev.target.closest('.column').querySelector('.task-list');
    dropzone.appendChild(document.getElementById(data));
}

function addTask() {
    const input = document.getElementById('task-input');
    if (input.value.trim() === "") return;

    const taskId = 'task-' + Date.now();
    const task = document.createElement('div');
    task.className = 'task';
    task.id = taskId;
    task.draggable = true;
    task.ondragstart = drag;
    task.innerText = input.value;

    document.getElementById('todo-list').appendChild(task);
    input.value = "";
}
