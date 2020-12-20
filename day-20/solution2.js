const fs = require('fs');

let input = fs.readFileSync('./input.txt', 'utf-8').split(/\r\n\r\n/);

let tiles = input.map((string) => {
  let lines = string.split(/\r\n/);
  let tile = {
    id: lines[0].replace(/Tile /, '').replace(/:/, ''),
    sides: {
      top: lines[1],
      bottom: lines[lines.length - 1],
      left: lines
        .slice(1)
        .map((line) => line[0])
        .join(''),
      right: lines
        .slice(1)
        .map((line) => line[line.length - 1])
        .join(''),
    },
    body: lines.slice(1),
    neighborTiles: [],
  };
  return tile;
});

const flipTile = (tile) => {
  tile.body = tile.body.reverse();
  [tile.sides.top, tile.sides.bottom] = [tile.sides.bottom, tile.sides.top];
  tile.sides.left = tile.sides.left.split('').reverse().join('');
  tile.sides.right = tile.sides.right.split('').reverse().join('');
};

const rotateTile = (tile) => {
  let bodyArray = tile.body.map((line) => line.split(''));
  bodyArray = bodyArray[0].map((_, colIndex) =>
    bodyArray.map((row) => row[colIndex])
  );

  tile.body = bodyArray.reverse().map((line) => line.join(''));
  let tmp = tile.sides.top;
  tile.sides.top = tile.sides.right;
  tile.sides.right = tile.sides.bottom;
  tile.sides.bottom = tile.sides.left;
  tile.sides.left = tmp;
};

const isCorrectPair = (currentProp, prop) => {
  return (
    (currentProp === 'top' && prop === 'bottom') ||
    (currentProp === 'bottom' && prop === 'top') ||
    (currentProp === 'left' && prop === 'right') ||
    (currentProp === 'right' && prop === 'left')
  );
};

const getConfigurations = (tile) => {
  const configurations = [];
  let notFlipped = false;
  let tileCopy = JSON.parse(JSON.stringify(tile));
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      if (i && !notFlipped) {
        flipTile(tileCopy);
        notFlipped = true;
      }
      rotateTile(tileCopy);
      configurations.push(JSON.parse(JSON.stringify(tileCopy)));
    }
  }

  return configurations;
};

const labelAdjacentTiles = (currentTile) => {
  for (tile of tiles) {
    if (tile.id !== currentTile.id) {
      for (currentProp in currentTile.sides) {
        for (prop in tile.sides) {
          if (
            prop !== 'neighbors' &&
            currentProp !== 'neighbors' &&
            currentTile.sides[currentProp] === tile.sides[prop]
          ) {
            currentTile.sides[currentProp] = `${tile.id}:${prop}`;
            tile.sides[prop] = `${currentTile.id}:${currentProp}`;
            currentTile.neighborTiles.push(tile.id);
            tile.neighborTiles.push(currentTile.id);
          } else if (
            prop !== 'neighbors' &&
            currentProp !== 'neighbors' &&
            currentTile.sides[currentProp] ===
              tile.sides[prop].split('').reverse().join('')
          ) {
            currentTile.sides[currentProp] = `${tile.id}:${prop}:reversed`;
            tile.sides[prop] = `${currentTile.id}:${currentProp}:reversed`;
            currentTile.neighborTiles.push(tile.id);
            tile.neighborTiles.push(currentTile.id);
          }
        }
      }
    }
  }
};

let configurations = {};
tiles.forEach((tile) =>
  Object.assign(configurations, { [tile.id]: getConfigurations(tile) })
);

let all = new Set(tiles.map((tile) => tile.id));
let puzzle = Array.from({ length: Math.sqrt(tiles.length) }, () =>
  Array.from({ length: Math.sqrt(tiles.length) }, () => 0)
);
tiles.forEach((tile) => labelAdjacentTiles(tile));

let corners = tiles.filter((tile) => tile.neighborTiles.length === 2);

let start = configurations[corners[0].id].filter((tile) => {
  let regExp = /[a-zA-Z]/g;
  return regExp.test(tile.sides.right) && regExp.test(tile.sides.bottom);
})[0];

puzzle[0][0] = start;
