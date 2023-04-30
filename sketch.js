const game_container = document.querySelector('#game-container');
const score_element = document.querySelector('#score');
const grid = [];

const H = 15;
for(let i = 0; i < H*H; i++) { // Generate grid HxH
  const new_div = document.createElement('div');
  new_div.className = 'grid-item';
  new_div.style = i > H - 1
                ? `width: ${game_container.clientWidth / H}px; margin-top: -0.25rem;`
                : `width: ${game_container.clientWidth / H}px;`;
  
  game_container.appendChild(new_div);
  grid[i] = new_div;
}

const arrows = [];
const snake = [];

const randRange = (a, b) => Math.floor(a + (b - a)*Math.random() + 0.5);
const grid2arrind = (x, y) => (x - 1) + H*(y - 1);
const setPoint = (x, y, value) => grid[grid2arrind(x, y)].className = value == 1 ? 'grid-item grid-item-active' : 'grid-item';
const getValue = (x, y) => grid[grid2arrind(x, y)].className == 'grid-item grid-item-active' ? 1 : 0;
const loop = (a, b, x) => { if(x < a) return b;
                          if(x > b) return a;
                          return x; };
const isSnake = (x, y) => snake[grid2arrind(x, y)] == 1;
const oppositeDirection = dir => (dir + 2) % 4;
const directionMap = (x, y, dir) => {
  const arr = [];
  switch(dir) {
    case 0:
    case 2:
      arr[0] = loop(1, H, dir == 0 ? x + 1 : x - 1);
      arr[1] = y;
      break;
    case 1:
    case 3:
      arr[0] = x;
      arr[1] = loop(1, H, dir == 1 ? y + 1 : y - 1);
      break;
  }
  return arr;
};

let PLAYER_DIRECTION;
let LAST_DIRECTION;
/*
-0:right
-1:down
-2:left
-3:up
*/
let PLAYER_X;
let PLAYER_Y;

let SCORE;

const isPointingToSnake = (x, y) => {
  let mapd = directionMap(x, y, arrows[grid2arrind(x, y)]);

  return isSnake(...mapd) && !(mapd[0] == PLAYER_X && mapd[1] == PLAYER_Y);
};
let APPLE_X;
let APPLE_Y;

const setSnake = (x, y) => {
  snake[grid2arrind(x, y)] = 1;
  arrows[grid2arrind(x, y)] = oppositeDirection(PLAYER_DIRECTION);
  setPoint(x, y, 1);
};

const yeetSnake = (x, y) => {
  snake[grid2arrind(x, y)] = 0;
  setPoint(x, y, 0);
};

const createApple =_=> {
  do [APPLE_X, APPLE_Y] = [randRange(1, H), randRange(1, H)];
  while (isSnake(APPLE_X, APPLE_Y));

  SCORE++;
  setPoint(APPLE_X, APPLE_Y, 1);
};

const restart =_=> {
  PLAYER_X = 2;
  PLAYER_Y = 1;

  PLAYER_DIRECTION = 0;
  LAST_DIRECTION = 0;

  SCORE = -1;

  for(let g of grid)
    g.className = "grid-item";

  snake.length = 0;

  setSnake(1, 1);
  setSnake(2, 1);

  createApple();
};

let paused = false;
game_container.addEventListener('keydown', e => {
  const key = e.keyCode;

  if(key == 65) // A
    PLAYER_DIRECTION = loop(0, 3, PLAYER_DIRECTION - 1) == oppositeDirection(LAST_DIRECTION) ? PLAYER_DIRECTION : loop(0, 3, PLAYER_DIRECTION - 1);
  if(key == 68) // D
    PLAYER_DIRECTION = loop(0, 3, PLAYER_DIRECTION + 1) == oppositeDirection(LAST_DIRECTION) ? PLAYER_DIRECTION : loop(0, 3, PLAYER_DIRECTION + 1);  
  if(key == 80)
    paused = !paused;
});

function placeHead() {
  // this line of code moves the player in the direction they're heading
  [PLAYER_X, PLAYER_Y] = directionMap(PLAYER_X, PLAYER_Y, PLAYER_DIRECTION);
  // restart the game if the player collides with itself
  if(isSnake(PLAYER_X, PLAYER_Y)) {
    restart();
    return;
  }

  LAST_DIRECTION = PLAYER_DIRECTION;
  setSnake(PLAYER_X, PLAYER_Y);
}

function removeTail() {
  let rx = PLAYER_X, ry = PLAYER_Y;

  while(isPointingToSnake(rx, ry))
    [rx, ry] = directionMap(rx, ry, arrows[grid2arrind(rx, ry)]);

  yeetSnake(rx, ry);
}

let lastFrame;
function game() {
  requestAnimationFrame(game);
  if(Date.now() - lastFrame < 250 || paused) // 2 fps
    return;

  score_element.innerHTML = SCORE;

  let win = true;
  for(let i = 0; i < H*H; i++) {
    if(snake[i] == 0) {
      win = false;
      break;
    }
  }
  if(win)
    restart();

  if(PLAYER_X == APPLE_X && PLAYER_Y == APPLE_Y)
    createApple();
  else
    removeTail();

  placeHead();
  
  lastFrame = Date.now();
}

restart();
lastFrame = Date.now();
requestAnimationFrame(game);