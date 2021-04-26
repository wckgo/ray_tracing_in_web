const progress = document.querySelector("progress");

export const updateProgress = (function () {
  let runing = false;
  return function (value) {
    if(runing) return;
    runing = true;
    requestAnimationFrame(() => {
      runing = false;
      progress.value = value;
    })
  }
})();

export function startTime() {
  performance.mark("start");
}

export function endTime() {
  performance.mark("end");
  performance.measure("time", "start", "end");
  const duration = performance.getEntriesByName("time")[0].duration.toFixed(2);
  const mask = document.querySelector("#progress");
  mask.classList.remove("show");
  mask.classList.add("hidden");
  const time = document.querySelector("#time")
  time.innerText = `Rendering takes ${duration} ms.`;
  time.classList.add("show");
  time.classList.remove("hidden");
}