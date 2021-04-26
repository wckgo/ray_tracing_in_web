const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const aspect_ratio = 16 / 9;
const height = 360;
const width = ~~(aspect_ratio * height);
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
