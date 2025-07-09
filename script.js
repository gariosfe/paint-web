const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentTool = 'brush';
let drawing = false;
let startX = 0, startY = 0;
let currentColor = '#000000';
let strokeWidth = 3;         // grosor del pincel
let eraserWidth = 30;        // grosor del borrador

const tools = document.querySelectorAll('.tool');
const colors = document.querySelectorAll('.color');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

// Herramienta activa
function setActiveTool(tool) {
    currentTool = tool;
    tools.forEach(btn => btn.classList.toggle('active', btn.dataset.tool === tool));
    updateCursor();
}

// Color activo
function setActiveColor(color) {
    currentColor = color;
    colors.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
}

// Cambiar cursor según herramienta
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

// Selección de herramientas
tools.forEach(btn => {
    btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
});

// Selección de colores
colors.forEach(btn => {
    btn.addEventListener('click', () => setActiveColor(btn.dataset.color));
});

// Limpiar canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Guardar como imagen
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'paint-uide.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Funciones de dibujo
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

// Mouse Down
canvas.addEventListener('mousedown', e => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.lineCap = 'round';

    if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.lineWidth = currentTool === 'eraser' ? eraserWidth : strokeWidth;
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

// Mouse Move
canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.lineCap = 'round';

    if (currentTool === 'brush') {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.lineWidth = eraserWidth;
        ctx.strokeStyle = '#ffffff';
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        // Aquí se puede implementar dibujo en vivo de línea/rectángulo/círculo (opcional)
    }
});

// Mouse Up
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
