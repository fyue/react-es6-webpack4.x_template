// 自定义全局定时器
const requestFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
let stopTicker = false;
let tweens = [];

const addTween = (t) => {
  if (tweens.includes(t)) return;
  tweens.push(t);
};

const removeTween = (t) => {
  tweens = tweens.filter(i => i !== t);
};

const pauseTicker = () => {
  stopTicker = true;
};

const ticker = () => {
  if (this.stopTicker) {
    return;
  }
  for (const tweenFuc of this.tweens) {
    if (tweenFuc) tweenFuc();
  }
  requestFrame(ticker);
};

const beginTicker = () => {
  requestFrame(ticker);
};

window.customTicker = {
  tweens,
  addTween,
  removeTween,
  pauseTicker,
  beginTicker,
};

window.onload = () => {
  window.customTicker.beginTicker();
};
