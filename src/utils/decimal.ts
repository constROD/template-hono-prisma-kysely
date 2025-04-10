function add(a: string, b: string): string {
  const aNum = Math.round(parseFloat(a) * 100);
  const bNum = Math.round(parseFloat(b) * 100);
  return ((aNum + bNum) / 100).toFixed(2);
}

function subtract(a: string, b: string): string {
  const aNum = Math.round(parseFloat(a) * 100);
  const bNum = Math.round(parseFloat(b) * 100);
  return ((aNum - bNum) / 100).toFixed(2);
}

function multiply(a: string, b: string): string {
  return (parseFloat(a) * parseFloat(b)).toFixed(2);
}

function divide(a: string, b: string): string {
  return (parseFloat(a) / parseFloat(b)).toFixed(2);
}

function calculatePercentage(args: { value: string; total: string }): string {
  return multiply(divide(args.value, args.total), '100');
}

function getValueFromPercentage(args: { percentage: string; total: string }): string {
  return multiply(divide(args.percentage, '100'), args.total);
}

function addPercent(args: { value: string; percentage: string }): string {
  const increase = getValueFromPercentage({
    percentage: args.percentage,
    total: args.value,
  });
  return add(args.value, increase);
}

function subtractPercent(args: { value: string; percentage: string }): string {
  const decrease = getValueFromPercentage({
    percentage: args.percentage,
    total: args.value,
  });
  return subtract(args.value, decrease);
}

export const decimal = {
  add,
  subtract,
  multiply,
  divide,
  calculatePercentage,
  getValueFromPercentage,
  addPercent,
  subtractPercent,
};
