const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentTool = 'brush';
let drawing = false;
let startX = 0, startY = 0;
let currentColor = '#000000';
let strokeWidth = 3;

const tools = document.querySelectorAll('.tool');
const colors = document.querySelectorAll('.color');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

function setActiveTool(tool) {
    currentTool = tool;
    tools.forEach(btn => btn.classList.toggle('active', btn.dataset.tool === tool));
    updateCursor();
}

function setActiveColor(color) {
    currentColor = color;
    colors.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
}

function updateCursor() {
    switch(currentTool) {
        case 'brush':
            canvas.style.cursor = 'crosshair';
            break;
        case 'eraser':
            canvas.style.cursor = 'cell';
            break;
        default:
            canvas.style.cursor = 'crosshair';
    }
}

// Eventos toolbar
tools.forEach(btn => {
    btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
});
colors.forEach(btn => {
    btn.addEventListener('click', () => setActiveColor(btn.dataset.color));
});

// Limpiar canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Guardar imagen PNG
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'paint-uide.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Dibujo
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawRect(x1, y1, x2, y2) {
    const width = x2 - x1;
    const height = y2 - y1;
    ctx.strokeRect(x1, y1, width, height);
}

function drawCircle(x1, y1, x2, y2) {
    const radius = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

canvas.addEventListener('mousedown', e => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';

    if (currentTool === 'brush') {
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#fff';
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        // Para línea, rect y círculo dibujaremos en 'mousemove' solo si quieres
        // Aquí simple solución para borrar y volver a dibujar con imagen guardada
        // Mejor hacerlo en mouseup con snapshot, pero para simplificar no lo implemento aquí
    }
});

canvas.addEventListener('mouseup', e => {
    if (!drawing) return;
    drawing = false;
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = currentColor;

    if (currentTool === 'line') {
        drawLine(startX, startY, x, y);
    } else if (currentTool === 'rect') {
        drawRect(startX, startY, x, y);
    } else if (currentTool === 'circle') {
        drawCircle(startX, startY, x, y);
    }
});

// Estado inicial
setActiveTool('brush');
setActiveColor('#000000');
