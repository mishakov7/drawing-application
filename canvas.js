const canvas = document.querySelector("#mycanvas");
const ctx = canvas.getContext("2d");

const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    true,
    "pointer",
    false,
    "source-over",
    5,
    "rgb(255, 255, 255)"
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "pointer",
    false,
    "destination-out",
    5,
    "rgba(255, 255, 255, 0)"
);

addCanvasStroke();

function addCanvasStroke() {
    canvas.addEventListener('mousemove', PaintBrush.drawStroke.bind(this));
    canvas.addEventListener('mouseup', PaintBrush.finishStroke.bind(this));
    canvas.addEventListener('mousedown', PaintBrush.startStroke.bind(this));
}

function removeCanvasStroke() {
    canvas.removeEventListener('mousemove', PaintBrush.drawStroke);
    canvas.removeEventListener('mouseup', PaintBrush.finishStroke);
    canvas.removeEventListener('mousedown', PaintBrush.startStroke);
}

