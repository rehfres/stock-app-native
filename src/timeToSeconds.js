export default function timeToSeconds(time) {
  time = time.toString();
  if (typeof time !== 'string' || !time.includes(':')) {
    // console.log('%c⧭', 'color: #c71f16', time);
    time = time - 5 * 3600 * 1000; // utc to est
    time = new Date(+time).toISOString().split('T')[1].slice(0, -1);
  }
  let coef = 3600
  let result = null
  for (const number of time.split('.')[0].split(':')) {
    result += number * coef;
    coef = coef / 60;
  }
  return result;
}