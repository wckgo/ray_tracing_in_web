const HEIGHT = 360;
const WIDTH = 640;

const main = document.querySelector("main");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
main.appendChild(canvas);

const imageData = context.createImageData(WIDTH, HEIGHT);

const buffer = new SharedArrayBuffer(imageData.data.buffer.byteLength);
const view$1 = new Uint8ClampedArray(buffer);

function applayBuffer() {
  imageData.data.set(view$1);
  context.putImageData(imageData, 0, 0);
}

const view = new Uint8ClampedArray(buffer);
const preLinePixelCount = WIDTH * 4;
for(let i = 0; i < HEIGHT; i++) {
  for(let j = 0; j < WIDTH; j++) {
    const r = ~~((j / WIDTH) * 255);
    const g = 128;
    const b = ~~((i / HEIGHT) * 255);
    const pixelIndex = i * preLinePixelCount + j * 4;
    view[pixelIndex] = r;
    view[pixelIndex + 1] = g;
    view[pixelIndex + 2] = b;
    view[pixelIndex + 3] = 255;
  }
}
applayBuffer();
