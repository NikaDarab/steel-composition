# steel-composition

## Steel Composition Calculator

This is a simple function that calculates the amount of each element that needs to be added to a batch of molten steel in order to meet the desired composition.

The function takes the following parameters:

- `elements`: an array of objects representing the final composition of the steel, with each object containing the name of the element and its final percentage.
- `totalWeight`: the total weight of the steel in kg.
- `initialElements`: an array of objects representing the initial composition of the steel, with each object containing the name of the element and its initial percentage.
- `requiredRanges`: an optional object that specifies the desired range for each element in the final composition.
- `deviationLimit`: an optional number that specifies the maximum allowable deviation from the initial composition.
- `minimumEffect`: an optional number that specifies the minimum effect that adding an element will have on the final composition.

The function returns an object containing the amount of each element that needs to be added to the steel to achieve the desired composition.

The repo contains some example use cases of the function and edge cases to test its robustness.
