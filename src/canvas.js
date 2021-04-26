import { height, width } from "./constants";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const imageData = context.createImageData(width, height);

const buffer = new SharedArrayBuffer(imageData.data.buffer.byteLength);
const view = new Uint8ClampedArray(buffer);

export {
  buffer,
}

export function applayBuffer() {
  imageData.data.set(view);
  context.putImageData(imageData, 0, 0);
}
