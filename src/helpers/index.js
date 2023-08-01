export function calculateDaysLeft(expiryDate) {
  const now = new Date();
  const differenceInMilliseconds = new Date(expiryDate) - now;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(differenceInMilliseconds / millisecondsPerDay);
}

export function formatNumber(num) {
  if (Math.abs(num) > 1000000) {
    return Math.floor(Math.abs(num) / 1000000) + "M";
  } else if (Math.abs(num) > 1000) {
    return Math.floor(Math.abs(num) / 1000) + "K";
  } else {
    return Math.abs(num);
  }
}
