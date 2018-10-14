console.log('Prepare for Warp!');

const grid = document.querySelector('.grid');
const controls = document.querySelector('.controls');
const leftButton = document.createElement('div');
const rightButton = document.createElement('div');
controls.appendChild(leftButton).setAttribute('id', 'left');
controls.appendChild(rightButton).setAttribute('id', 'right');
leftButton.textContent = '<<< Left';
rightButton.textContent = 'Right >>>';
const scoreCounter = document.querySelector('.score');
const warpMeter = document.querySelector('.warpspeed');

createGrid();

let carPos = 194;
let car1 = document.querySelectorAll('.grid div')[carPos];
car1.classList.add('car');
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);

window.addEventListener('keydown', function(e) {
  if (e.which === 38) {
    moveUp();
  } else if (e.which === 40) {
    moveDown();
  } else if (e.which === 37) {
    moveLeft();
  } else if (e.which === 39) {
    moveRight();
  }
});

//obstacle data
let obstaclePos1 = 0;
let obstaclePos2 = 0;
let obstacle1;
let obstacle2;
let incomingObjects1 = false;
let obstacleSlowness = 340;

// let obstaclePos3 = 0;
// let obstaclePos4 = 0;
// let obstacle3;
// let obstacle4;
// let incomingObjects2 = false;
// let obstacleSlowness2 = 325;

generateObstacle();
// generateObstacle2();

let score = 0;
let warpSpeed = 1;
const isUserAlive = setInterval(function() {
  if (incomingObjects1 === false) {
    // if (incomingObjects2 === false) {
    //   generateObstacle2();
    // }
    generateObstacle();
    score = score + 100;
    scoreCounter.textContent = `Score: ${score}`;
  } else if (car1.classList.contains('obstacle')) {
    alert('Game Over! You have crashed.');
    clearInterval(isUserAlive);
  }
}, 1);
const speedIncrease = setInterval(function() {
  obstacleSlowness = obstacleSlowness - 30;
  // obstacleSlowness2 = obstacleSlowness2 - 30;
  warpSpeed = warpSpeed + 1;
  warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
  console.log('Increasing warp speed...', warpSpeed);
  if (warpSpeed === 10 || incomingObjects1 === false){
    console.log('Warp speed 10 achieved!', warpSpeed);
    clearInterval(speedIncrease);
  }
}, 1000 );

function createGrid(){
  for(let i = 0; i < 200; i++){
    const newGrid = document.createElement('div');
    grid.appendChild(newGrid).setAttribute('id', i);
  }
}

function moveLeft(){
  if(carPos % 10 !== 0){
    car1.classList.remove('car');
    carPos--;
    car1 = document.querySelectorAll('.grid div')[carPos];
    car1.classList.add('car');
  } else {
    console.log('too far left!!');
  }
}

function moveRight(){
  if(carPos.toString().split('').pop() !== '9'){
    car1.classList.remove('car');
    carPos++;
    car1 = document.querySelectorAll('.grid div')[carPos];
    car1.classList.add('car');
  } else {
    console.log('too far right!!');
  }
}

function moveUp(){
  if(carPos > 9){
    car1.classList.remove('car');
    carPos = carPos - 10;
    car1 = document.querySelectorAll('.grid div')[carPos];
    car1.classList.add('car');
  } else {
    console.log('too far up!!');
  }
}
function moveDown(){
  if(carPos < 190){
    car1.classList.remove('car');
    carPos = carPos + 10;
    car1 = document.querySelectorAll('.grid div')[carPos];
    car1.classList.add('car');
  } else {
    console.log('too far down!!');
  }
}

function generateObstacle() {
  if (car1.classList.contains('obstacle') === false){
    incomingObjects1 = true;
    obstaclePos1 = (Math.floor(Math.random() * 9));
    obstaclePos2 = obstaclePos1 + Math.floor(Math.random()*15);
    obstacle1 = document.querySelectorAll('.grid div')[obstaclePos1];
    obstacle2 = document.querySelectorAll('.grid div')[obstaclePos2];
    obstacle1.classList.add('obstacle');
    obstacle2.classList.add('obstacle');
    const fallingDown = setInterval(function(){
      if (obstaclePos2 < 200 && obstaclePos2.toString().slice(0,2) !== '19'){
        obstaclePos1 = obstaclePos1+10;
        obstaclePos2 = obstaclePos2+10;
        obstacle1.classList.remove('obstacle');
        obstacle2.classList.remove('obstacle');
        obstacle1 = document.querySelectorAll('.grid div')[obstaclePos1];
        obstacle2 = document.querySelectorAll('.grid div')[obstaclePos2];
        obstacle1.classList.add('obstacle');
        obstacle2.classList.add('obstacle');
      } else {
        incomingObjects1 = false;
        clearInterval(fallingDown);
        obstacle1.classList.remove('obstacle');
        obstacle2.classList.remove('obstacle');
      }
    }, obstacleSlowness);
  }
}

// Second obstacle - buggy...
// function generateObstacle2() {
//   if (incomingObjects2 === false){
//     incomingObjects2 === true;
//     obstaclePos3 = (Math.floor(Math.random() * 9));
//     obstaclePos4 = 9 - obstaclePos3;
//     obstacle3 = document.querySelectorAll('.grid div')[obstaclePos3];
//     obstacle4 = document.querySelectorAll('.grid div')[obstaclePos4];
//     obstacle3.classList.add('obstacle');
//     obstacle4.classList.add('obstacle');
//     const fallingDown2 = setInterval(function(){
//       if (obstaclePos4 < 200 && obstaclePos4.toString().slice(0,2) !== '19'){
//         obstaclePos3 = obstaclePos3+10;
//         obstaclePos4 = obstaclePos4+10;
//         obstacle3.classList.remove('obstacle');
//         obstacle4.classList.remove('obstacle');
//         obstacle3 = document.querySelectorAll('.grid div')[obstaclePos3];
//         obstacle4 = document.querySelectorAll('.grid div')[obstaclePos4];
//         obstacle3.classList.add('obstacle');
//         obstacle4.classList.add('obstacle');
//       } else {
//         clearInterval(fallingDown2);
//         obstacle3.classList.remove('obstacle');
//         obstacle4.classList.remove('obstacle');
//       }
//     }, obstacleSlowness2);
//   }
// }
