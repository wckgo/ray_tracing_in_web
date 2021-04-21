import { HEIGHT, WIDTH } from "../constants";
import { buffer, applayBuffer } from "../canvas";

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
