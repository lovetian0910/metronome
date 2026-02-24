// scheduler-worker.js
// Minimal timer worker - fires tick messages at a steady interval.
// Web Workers are less aggressively throttled than main-thread setTimeout
// on Android Chrome when the page is in the background.
let timerID = null;

self.onmessage = function (e) {
  if (e.data.command === 'start') {
    if (timerID !== null) clearInterval(timerID);
    const interval = e.data.interval || 25;
    timerID = setInterval(function () {
      self.postMessage({ command: 'tick' });
    }, interval);
  } else if (e.data.command === 'stop') {
    if (timerID !== null) {
      clearInterval(timerID);
      timerID = null;
    }
  }
};
