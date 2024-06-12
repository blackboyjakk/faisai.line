
function getAmountFormat(amount: number, place: number = 2): string {
  return Number(amount).toLocaleString(undefined, { minimumFractionDigits: place, maximumFractionDigits: place });
}