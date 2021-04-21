import { HEIGHT, WIDTH } from "./constants";

const main = document.querySelector("main");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
main.appendChild(canvas);

const imageData = context.createImageData(WIDTH, HEIGHT);

const buffer = new SharedArrayBuffer(imageData.data.buffer.byteLength);
const view = new Uint8ClampedArray(buffer);

export {
  buffer,
}

export function applayBuffer() {
  imageData.data.set(view);
  context.putImageData(imageData, 0, 0);
}
