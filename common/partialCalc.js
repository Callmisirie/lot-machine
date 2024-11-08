export default function partialCalc(lotSize, finalTP, partialTPs) {
  let partialLotSize;
  let remainingLotSize = lotSize;

  return partialTPs.map((partialTP) => {
    partialLotSize = remainingLotSize / (finalTP / partialTP);
    remainingLotSize = remainingLotSize - partialLotSize;
    return parseFloat(partialLotSize).toFixed(2);
  });
}