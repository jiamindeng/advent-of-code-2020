const fs = require("fs");

let numbers = fs
  .readFileSync("./input.txt", "utf-8")
  .split("\n")
  .map((num) => {
    return parseInt(num);
  });

const solution1 = (numbers) => {
  for (let [i, num] of numbers.entries()) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (num + numbers[j] === 2020) {
        return num * numbers[j];
      }
    }
  }
  return -1;
};

const solution2 = (numbers) => {
  for (let [i, num] of numbers.entries()) {
    for (let j = i + 1; j < numbers.length; j++) {
      for (let k = j + 1; k < numbers.length; k++) {
        if (num + numbers[j] + numbers[k] === 2020) {
          return num * numbers[j] * numbers[k];
        }
      }
    }
  }
  return -1;
};

console.log(`Solution to Part One: ${solution1(numbers)}`);

console.log(`Solution to Part Two: ${solution2(numbers)}`);
