const game_container = document.querySelector('#game-container');
const grid = [];
const arrows = [];

for(let i = 0; i < 25; i++) { // Generate grid 5x5
  const new_div = document.createElement('div');
  new_div.className = 'grid-item';
  
  new_div.style = i > 4 
                ? `width: ${game_container.clientWidth / 5}px; margin-top: -0.25rem;`
                : `width: ${game_container.clientWidth / 5}px;`;
  
  game_container.appendChild(new_div);
  grid.push(new_div);
}
grid[2 + 5*2].className = 'grid-item grid-item-active';
arrows[2 + 5*2] = 2;

let PLAYER_DIRECTION = 0;
/*
-0:right
-1:down
-2:left
-3:up
*/
let PLAYER_X = 3;
let PLAYER_Y = 3;

let getPoint = (x, y) => grid[(x - 1) + 5*(y - 1)];
let setPoint = (x, y, value) => grid[(x - 1) + 5*(y - 1)].className = value == 1 ? 'grid-item grid-item-active' : 'grid-item';
let getValue = (x, y) => getPoint(x, y).className == 'grid-item grid-item-active' ? 1 : 0;
let loop = (a, b, x) => { if(x < a) return b;
                          if(x > b) return a;
                          return x; };

game_container.addEventListener('keydown', e => {
  const key = e.keyCode;

  if(key == 65) { // A
    PLAYER_DIRECTION--;
    PLAYER_DIRECTION = loop(0, 3, PLAYER_DIRECTION);
  }
  if(key == 68) { // D
    PLAYER_DIRECTION++;
    PLAYER_DIRECTION = loop(0, 3, PLAYER_DIRECTION);
  }
});

function placeHead() {
  switch(PLAYER_DIRECTION) {
    case 0:
      PLAYER_X++;
      break;
    case 1:
      PLAYER_Y++;
      break;
    case 2:
      PLAYER_X--;
      break;
    case 3:
      PLAYER_Y--;
      break;
  }
  PLAYER_X = loop(1, 5, PLAYER_X);
  PLAYER_Y = loop(1, 5, PLAYER_Y);

  getPoint(PLAYER_X, PLAYER_Y).className = 'grid-item grid-item-active';
  arrows[(PLAYER_X - 1) + 5*(PLAYER_Y - 1)] = loop(0, 3, PLAYER_DIRECTION+2);
}

let isArrowToSnake = (x, y, d) => {
  switch(d) {
    case 0:
      return getPoint(x+1, y).className == 'grid-item grid-item-active';
    case 1:
      return getPoint(x, y+1).className == 'grid-item grid-item-active';
    case 2:
      return getPoint(x-1, y).className == 'grid-item grid-item-active';
    case 3:
      return getPoint(x, y-1).className == 'grid-item grid-item-active';
  }
}

function removeTail() {
  let x = PLAYER_X, y = PLAYER_Y, 
      d = arrows[(x - 1) + 5*(y - 1)];
  
  let arrowToSnake = isArrowToSnake(x, y, d);
  while(arrowToSnake) {
    switch(d) {
      case 0:
        x++;
      case 1:
        y++;
      case 2:
        x--;
      case 3:
        y--;
    }
    x = loop(1, 5, x);
    y = loop(1, 5, y);

    arrowToSnake = isArrowToSnake(x, y, d);
  }

  getPoint(x, y).className = 'grid-item';
}

let frame = 1;
function game() {
  placeHead();
  
  removeTail();

  frame++;
}

setInterval(game, 1000);