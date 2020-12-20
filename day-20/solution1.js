const fs = require('fs');

let input = fs.readFileSync('./input.txt', 'utf-8').split(/\r\n\r\n/);

const tiles = input.map((string) => {
  const lines = string.split(/\r\n/);
  const tile = {
    id: lines[0].replace(/Tile /, '').replace(/:/, ''),
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
    neighbors: 0,
  };
  return tile;
});

const labelAdjacentTiles = (currentTile) => {
  for (tile of tiles) {
    if (tile.id !== currentTile.id) {
      for (currentProp in currentTile) {
        for (prop in tile) {
          if (
            prop !== 'neighbors' &&
            currentProp !== 'neighbors' &&
            currentTile[currentProp] === tile[prop]
          ) {
            console.log(currentTile.id, tile.id, { currentProp, prop });
            currentTile[currentProp] = `${tile.id}:${prop}`;
            tile[prop] = `${currentTile.id}:${currentProp}`;
            currentTile.neighbors++;
            tile.neighbors++;
          } else if (
            prop !== 'neighbors' &&
            currentProp !== 'neighbors' &&
            currentTile[currentProp] === tile[prop].split('').reverse().join('')
          ) {
            console.log(currentTile.id, tile.id, { currentProp, prop });
            currentTile[currentProp] = `${tile.id}:${prop}:reversed`;
            tile[prop] = `${currentTile.id}:${currentProp}:reversed`;
            currentTile.neighbors++;
            tile.neighbors++;
          }
        }
      }
    }
  }
};

tiles.forEach((tile) => labelAdjacentTiles(tile));

let corners = tiles
  .filter((tile) => tile.neighbors === 2)
  .map((tile) => parseInt(tile.id))
  .reduce((acc, current) => acc * current);

console.log(tiles.map((tile) => tile.neighbors));
