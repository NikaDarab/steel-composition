const calculateSteelComposition = (
  elements,
  totalWeight,
  initialElements,
  requiredRanges = null,
  deviationLimit = null,
  minimumEffect = null
) => {
  const finalPercentageSum = elements.reduce(
    (sum, element) => sum + element.final,
    0
  );

  if (finalPercentageSum !== 100) {
    throw new Error("Final percentages do not add up to 100%");
  }

  const result = {};

  for (const initialElement of initialElements) {
    const element = elements.find((e) => e.name === initialElement.name);
    if (!element) {
      throw new Error(
        `${initialElement.name} exists in the initial makeup but not in the final makeup. This batch of molten steel needs to go back to the melting area.`
      );
    }

    const initialPercentage = initialElement.initial ?? 0;
    const weightDiff = element.final - initialPercentage;

    if (weightDiff <= 0) {
      continue; // skip if the final percentage is lower than or equal to the initial percentage
    }

    if (deviationLimit !== null && minimumEffect !== null) {
      if (Math.abs(weightDiff) > deviationLimit) {
        throw new Error(`Deviation limit exceeded for ${element.name}`);
      }

      if (Math.abs(weightDiff) < minimumEffect) {
        throw new Error(`Minimum effect not reached for ${element.name}`);
      }
    }
    if (requiredRanges !== null) {
      // Check if the final percentage falls within the required range for this element
      const requiredRange = requiredRanges[element.name];
      if (
        requiredRange &&
        (element.final < requiredRange.min || element.final > requiredRange.max)
      ) {
        throw new Error(
          `Final percentage for ${element.name} is outside the required range of ${requiredRange.min}% to ${requiredRange.max}%`
        );
      }

      const valueToAdd = ((weightDiff * totalWeight) / 100).toFixed(2);
      result[element.name] = `Add ${valueToAdd} kg`;
    }
  }

  return result;
};

const totalWeight = 100;

const ss316Final = [
  { name: "Chromium", final: 17.0 },
  { name: "Nickel", final: 12.0 },
  { name: "Molybdenum", final: 2.5 },
  { name: "Carbon", final: 0.08 },
  { name: "Manganese", final: 2.0 },
  { name: "Phosphorus", final: 0.05 },
  { name: "Sulfur", final: 0.03 },
  { name: "Silicon", final: 0.75 },
  { name: "Nitrogen", final: 0.1 },
  { name: "Iron", final: 65.49 },
];

const ss316Initial = [
  { name: "Chromium", initial: 14.79 },
  { name: "Nickel", initial: 2.0 },
  { name: "Molybdenum", initial: 0.5 },
  { name: "Carbon", initial: 0.01 },
  { name: "Manganese", initial: 1.0 },
  { name: "Phosphorus", initial: 0.03 },
  { name: "Sulfur", initial: 0.02 },
  { name: "Silicon", initial: 0.6 },
  { name: "Nitrogen", initial: 0.05 },
  { name: "Iron", initial: 81.0 },
];

const requiredRanges = {
  Chromium: { min: 15, max: 20 },
  Nickel: { min: 11, max: 13 },
  Molybdenum: { min: 2, max: 17 },
  Carbon: { min: 0.07, max: 0.09 },
  Manganese: { min: 1.5, max: 2.5 },
  Phosphorus: { min: 0.03, max: 0.06 },
  Sulfur: { min: 0.01, max: 0.05 },
  Silicon: { min: 0.5, max: 1 },
  Nitrogen: { min: 0.08, max: 0.12 },
  Iron: { min: 60, max: 70 },
};

// Element exists in the initial makeup but not in the final makeup

const edgeCase1Final = [
  { name: "carbon", final: 0.2 },
  { name: "iron", final: 98 },
  { name: "silicon", final: 1.8 },
];

const edgeCase1Initial = [
  { name: "carbon", initial: 0.1 },
  { name: "iron", initial: 99 },
  { name: "manganese", initial: 0.5 },
  { name: "silicon", initial: 1 },
];

// Final percentages do not add up to 100% or exceeds 100%

const edgeCase2Final = [
  { name: "Carbon", final: 3.0 },
  { name: "Manganese", final: 4.0 },
  { name: "Iron", final: 95.0 },
];

const edgeCase2Initial = [
  { name: "Carbon", initial: 1.0 },
  { name: "Manganese", initial: 1.0 },
  { name: "Iron", initial: 98.0 },
];


// return an empty object since the final percentage is lower than or equal to the initial percentage

const edgeCase3Final = [
  { name: "Carbon", final: 0.5 },
  { name: "Manganese", final: 1.0 },
  { name: "Iron", final: 98.5 },
];

const edgeCase3Initial = [
  { name: "Carbon", initial: 1.0 },
  { name: "Manganese", initial: 1.0 },
  { name: "Iron", initial: 98.0 },
];

// Deviation limit exceeded for an element

const edgeCase4Final = [
  { name: "Carbon", final: 1.5 },
  { name: "Manganese", final: 2.0 },
  { name: "Iron", final: 96.5 },
];

const edgeCase4Initial = [
  { name: "Carbon", initial: 1.0 },
  { name: "Manganese", initial: 1.0 },
  { name: "Iron", initial: 98.0 },
];

const edgeCase4RequiredRanges = {
  Carbon: { min: 1.0, max: 2.0 },
  Manganese: { min: 1.0, max: 2.0 },
  Iron: { min: 95.0, max: 99.0 },
};

const edgeCase4DeviationLimit = 0.5;
const edgeCase4MinimumEffect = 0.5;

// Minimum effect not reached for an element

const edgeCase5Final = [
  { name: "Carbon", final: 1.5 },
  { name: "Manganese", final: 2.0 },
  { name: "Iron", final: 96.5 },
];

const edgeCase5Initial = [
  { name: "Carbon", initial: 1.0 },
  { name: "Manganese", initial: 1.0 },
  { name: "Iron", initial: 98.0 },
];

const edgeCase5RequiredRanges = {
  Carbon: { min: 1.0, max: 2.0 },
  Manganese: { min: 1.0, max: 2.0 },
  Iron: { min: 95.0, max: 99.0 },
};

const edgeCase5DeviationLimit = 2.0;
const edgeCase5MinimumEffect = 1.0;



console.log(
  calculateSteelComposition(
    ss316Final,
    totalWeight,
    ss316Initial,
    requiredRanges
  )
);

// console.log(
//   calculateSteelComposition(
//     edgeCase1Final,
//     totalWeight,
//     edgeCase1Initial
//   )
// );

// console.log(calculateSteelComposition(edgeCase2Final, totalWeight, edgeCase2Initial));

// console.log(
//   calculateSteelComposition(
//     edgeCase3Final,
//     totalWeight,
//     edgeCase3Initial,
//     edgeCase3RequiredRanges,
//     edgeCase3DeviationLimit,
//     edgeCase3MinimumEffect
//   )
// );

// console.log(
//   calculateSteelComposition(
//       edgeCase4Final,
//       totalWeight,
//       edgeCase4Initial,
//       edgeCase4RequiredRanges,
//       edgeCase4DeviationLimit,
//       edgeCase4MinimumEffect
//   )
// );

// console.log(
//   calculateSteelComposition(edgeCase5Final, totalWeight, edgeCase5initial)
// );