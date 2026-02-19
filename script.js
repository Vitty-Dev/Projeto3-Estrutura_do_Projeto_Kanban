let timer;
let timeRemaining = 0;
const chartCtx = document.getElementById('taskChart').getContext('2d');

// GRÁFICO
let taskChart = new Chart(chartCtx, {
    type: 'doughnut',
    data: {
        labels: ['A Fazer', 'Fazendo', 'Feito'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#fbbf24', '#38bdf8', '#22c55e'],
            borderWidth: 0
        }]
    },
    options: { cutout: '80%', plugins: { legend: { display: false } } }
});

// CRONÔMETRO
function startTimer() {
    if (timer) return;
    const d = (parseInt(document.getElementById('t-days').value) || 0) * 86400;
    const h = (parseInt(document.getElementById('t-hours').value) || 0) * 3600;
    const m = (parseInt(document.getElementById('t-mins').value) || 0) * 60;
    const s = parseInt(document.getElementById('t-secs').value) || 0;
    
    if (timeRemaining === 0) timeRemaining = d + h + m + s;
    if (timeRemaining <= 0) return;

    timer = setInterval(() => {
        timeRemaining--;
        updateTimerView();
        if (timeRemaining <= 0) {
            clearInterval(timer);
            timer = null;
            document.getElementById('alarm-sound').play();
            alert("⏰ Tempo concluído!");
        }
    }, 1000);
}

function pauseTimer() { clearInterval(timer); timer = null; }
function resetTimer() { pauseTimer(); timeRemaining = 0; updateTimerView(); }

function updateTimerView() {
    const days = Math.floor(timeRemaining / 86400);
    const hrs = Math.floor((timeRemaining % 86400) / 3600);
    const mins = Math.floor((timeRemaining % 3600) / 60);
    const secs = timeRemaining % 60;
    document.getElementById('timer-display').innerText = 
        `${String(days).padStart(2,'0')}:${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

// KANBAN
function openModal() { document.getElementById('modal').style.display = 'grid'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function handleEnter(e) { if(e.key === 'Enter') addTask(); }

function addTask() {
    const desc = document.getElementById('task-desc').value;
    const time = document.getElementById('task-time').value;
    if(!desc) return;

    const id = 'task-' + Date.now();
    const card = document.createElement('div');
    card.className = 'task-card';
    card.id = id;
    card.draggable = true;
    card.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);

    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
            <p>${desc}</p>
            <i class="fas fa-trash" onclick="document.getElementById('${id}').remove(); updateCounts();" style="color:#ef4444; cursor:pointer; font-size:0.8rem"></i>
        </div>
        <span class="time-tag"><i class="far fa-clock"></i> ${time ? new Date(time).toLocaleString('pt-BR') : 'Sem prazo'}</span>
    `;

    document.getElementById('todo-list').appendChild(card);
    closeModal();
    updateCounts();
}

function allowDrop(e) { e.preventDefault(); }
function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const col = e.target.closest('.column');
    col.querySelector('.dropzone').appendChild(document.getElementById(id));
    if(col.id === 'done') document.getElementById('done-sound').play();
    updateCounts();
}

function updateCounts() {
    const todo = document.getElementById('todo-list').children.length;
    const doing = document.getElementById('doing-list').children.length;
    const done = document.getElementById('done-list').children.length;
    const total = todo + doing + done;

    taskChart.data.datasets[0].data = [todo, doing, done];
    taskChart.update();

    document.getElementById('chart-percentage').innerText = total > 0 ? Math.round((done/total)*100) + "%" : "0%";
    document.getElementById('todo-count').innerText = todo;
    document.getElementById('doing-count').innerText = doing;
    document.getElementById('done-count').innerText = done;
}
