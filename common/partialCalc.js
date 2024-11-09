export default function partialCalc(
  lotSize, finalTP, 
  partialTPs, templateState, 
  customTemplateValue
) {
  
  if (templateState === "D") {
    let partialLotSize;
    let remainingLotSize = lotSize;
    let updatedFinalTP = finalTP;
    let updatedPartialTP;
  
    return partialTPs.map((partialTP, idx) => {
      updatedPartialTP = partialTP;
      if (idx > 0) {
        updatedPartialTP = partialTP - partialTPs[idx - 1];
      }
      partialLotSize = remainingLotSize / (updatedFinalTP / updatedPartialTP);

      if (idx === 0) {
        updatedFinalTP = updatedFinalTP - partialTP;
      } else {
        updatedFinalTP = updatedFinalTP - partialTPs[idx - 1];
      }

      remainingLotSize = remainingLotSize - partialLotSize;
      return parseFloat(partialLotSize).toFixed(2);
    });
  }

  if (templateState === "C") {
    let partialLotSize;
    let remainingLotSize = lotSize;
  
    return partialTPs.map((partialTP) => {
      partialLotSize = (remainingLotSize * customTemplateValue) / 100;
      remainingLotSize = remainingLotSize - partialLotSize;
      return parseFloat(partialLotSize).toFixed(2);
    });
  }
}