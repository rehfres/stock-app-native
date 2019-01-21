var canvasWidth, canvasHeight, coefTimeToCanvas, secondsInaDay = 6 * 60 * 60 + 30 * 60;

export function initCanvasSize(size) {
  console.log('%c⧭', 'color: #c74b16', size);
  canvasWidth = size.width;
  canvasHeight = size.height;
  coefTimeToCanvas = canvasWidth / secondsInaDay;
}

function drawPreviousCloseLine(context, previousClose) {
  // previousClose = canvasHeight / 2;
  context.beginPath();
  context.moveTo(0, canvasHeight - previousClose);
  context.lineTo(canvasWidth, canvasHeight - previousClose);
  context.lineWidth = 1;
  context.strokeStyle = '#0000001a';
  context.stroke();
}

export function drawChart(context, prices, previousClose, lastPriceModifiedForCanvasIfMarketIsOpen) {

  drawPreviousCloseLine(context, previousClose);
  for (const sign of ['positive', 'negative']) {
    let lastData = {
      index: null,
      time: null
    }
    context.beginPath();
    context.moveTo(0, canvasHeight - previousClose);
    for (const { index, timeInSeconds, price } of prices[sign]) {
      const lineOrMoveTo = (index - lastData.index > 1) ? 'moveTo' : 'lineTo'
      // console.log('%c⧭', sign === 'positive' ? 'color: #16c774' : 'color: #c71f16', index, timeInSeconds, price, sign, lineOrMoveTo);
      context[lineOrMoveTo](timeInSeconds * coefTimeToCanvas, canvasHeight - price);
      lastData.time = timeInSeconds;
      lastData.index = index;
    }
    context.lineWidth = 1;
    context.strokeStyle = sign === 'positive' ? 'green' : 'red';
    context.stroke();
    context.lineTo(lastData.time * coefTimeToCanvas, canvasHeight - previousClose);
    fillChart(sign, context, previousClose);
  }
  const lastPoint = {
    timeInSeconds: 50,
    price: 5,
    sign: 'positive'
  }
  context.beginPath();
  context.arc(lastPoint.timeInSeconds, canvasHeight - lastPoint.price, 1.5, 0, 2 * Math.PI);
  context.strokeStyle = lastPoint.sign === 'positive' ? 'green' : 'red';
  context.fillStyle = context.strokeStyle;
  context.fill();
  context.stroke();
  // console.timeEnd(1)
}

function fillChart(sign, context, previousClose) {
  // previousClose = canvasHeight / 2;
  context.save();
  context.clip();
  if (sign === 'positive') {
    context.fillStyle = '#ccebd6';
    context.fillRect(0, 0, canvasWidth, canvasHeight - previousClose);
  } else {
    context.fillStyle = '#ffd6d8';
    context.fillRect(0, canvasHeight - previousClose, canvasWidth, canvasHeight);
  }
  context.restore();
}