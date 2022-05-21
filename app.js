const canvas = document.querySelector("canvas");
const tilesetContainer = document.querySelector(".tileset-container");
const tilesetSelection = document.querySelector(".tileset-container_selection");
const tilesetImage = document.querySelector("#tileset-source");

let selection = [0, 0];

var currentLayer = 0;
var layers = [
    //Bottom
    {},
    //Top
    {},
];
function draw() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    var sizeOfCrop = 43;

    layers.forEach(layer => {
        Object.keys(layer).forEach(key => {
            var positionX = Number(key.split("-")[0]);
            var positionY = Number(key.split("-")[1]);
            var [tilesheetX, tilesheetY] = layer[key];

            ctx.drawImage(
                tilesetImage,
                tilesheetX * 100, tilesheetY * 100,
                100, 100,
                positionX * 43, positionY * 43,
                sizeOfCrop, sizeOfCrop
            )
        })
    })

}
function getCoords(e) {
    const { x, y } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / 43), Math.floor(mouseY / 43)];
}

tilesetContainer.addEventListener("mousedown", event => {
    console.log(getCoords(event));
    selection = getCoords(event);
    tilesetSelection.style.left = selection[0] * 43 + "px";
    tilesetSelection.style.top = selection[1] * 43 + "px";
})

var isMouseDown = false;
canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        addTile(event);
    }
});

function addTile(mouseEvent) {
    var clicked = getCoords(event);
    var key = clicked[0] + "-" + clicked[1];

    if (mouseEvent.shiftKey) {

    } else {
        layers[currentLayer][key] = [selection[0], selection[1]]
    }

    draw();
}

function setLayer(newLayer) {
    currentLayer = newLayer;

    var oldActiveLayer = document.querySelector(".layer.active");
    if (oldActiveLayer) {
        oldActiveLayer.classList.remove("active");
    }
    document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
}

function clearCanvas() {
    layers = [{}, {}, {}];
    draw();
}

tilesetImage.onload = function () {
    //init
    draw();
    setLayer(1);
}

function exportImage() {
    var data = canvas.toDataURL();
    var image = new Image();
    image.src = data;

    var w = window.open("");
    w.document.write(image.outerHTML);

}

console.log("poop")
tilesetImage.src = "DBTileSet.png";
