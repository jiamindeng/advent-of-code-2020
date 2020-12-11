const fs = require("fs");

let input = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => line.split(""));
