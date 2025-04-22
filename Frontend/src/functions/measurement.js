export const getBodyShape = ({ shoulders, bust, waist, hips }) => {
  const within = (a, b, percent = 5) =>
    Math.abs(a - b) <= (percent / 100) * Math.max(a, b);

  if (within(bust, hips) && waist < bust * 0.75) {
    return "Hourglass";
  }

  if (hips > bust && waist < bust * 0.8) {
    return "Pear";
  }

  if (bust > hips && waist > bust * 0.8) {
    return "Apple";
  }

  if (
    within(shoulders, hips) &&
    within(shoulders, bust) &&
    within(bust, hips) &&
    within(waist, bust, 10)
  ) {
    return "Rectangle";
  }

  if (shoulders > hips * 1.05 || bust > hips * 1.05) {
    return "Inverted Triangle";
  }

  return "Undefined or Balanced Shape";
};
