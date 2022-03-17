const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    false,
    "url('paintbrush.svg'), auto",
    false,
    "source-over",
    5,
    "rgb(255, 255, 255)"
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "url('eraser.svg'), auto",
    false,
    "destination-out",
    10,
    "rgb(255, 255, 255)"
);


PaintBrush.enable();
PaintBrush.setProps();
PaintBrush.addCanvasStroke();
