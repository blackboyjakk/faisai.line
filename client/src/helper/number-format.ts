
export const getAmountFormat = (amount: number, place: number = 2)=>{
  return Number(amount).toLocaleString(undefined, { minimumFractionDigits: place, maximumFractionDigits: place });
}