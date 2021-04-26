import { applayBuffer, buffer } from "./canvas";
import { scene } from "./scene";
import Worker from "./chunkedRender.worker.js";
import { updateProgress, startTime, endTime } from "./performance";

// init worker
let workerDoneCount = 0;
let completedLine = 0;
let image_height = 0;
const cores = navigator.hardwareConcurrency;
document.querySelector("#thread_count").innerText = cores;
const workers = [];
for (let i = 0; i < cores; i++) {
  const chunkRenderWorker = new Worker();
  chunkRenderWorker.addEventListener('message', event => {
    const { done } = event.data;
    completedLine++;
    applayBuffer();
    updateProgress(~~(completedLine / image_height * 100));
    if(done) {
      workerDoneCount++;
      if(workerDoneCount === cores) endTime();
    } 
  });
  workers.push(chunkRenderWorker);
}

export function render(width, height) {
  startTime();
  image_height = height;
  const chunkLength = ~~(height / cores);
  workers.forEach((worker, index) => {
    const h = index === workers.length - 1 ? height - (index * chunkLength) : chunkLength;
    worker.postMessage({
      chunkHeight: h,
      offset: index * chunkLength,
      width: width,
      height,
      scene,
      buffer
    });
  });
}
