console.log('Prepare for Warp!');

const grid = document.querySelector('.grid');
const controls = document.querySelector('.controls');
const leftButton = document.createElement('div');
const rightButton = document.createElement('div');
controls.appendChild(leftButton).setAttribute('id', 'left');
controls.appendChild(rightButton).setAttribute('id', 'right');
leftButton.textContent = '<<< Portside';
rightButton.textContent = 'Starboard >>>';
const scoreCounter = document.querySelector('.score');
const warpMeter = document.querySelector('.warpspeed');
// const video = document.querySelector('#background');
const splashMenu = document.querySelector('.splash-menu');
const splashLeaders = document.querySelector('.splash-leaders');
const leaderboard = document.querySelector('.leaderboard');
createGrid();

let carPos = 194;
let car1 = document.querySelectorAll('.grid div')[carPos];
car1.classList.add('car');
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);




//debris data
let debrisPos1 = 0;
let debrisPos2 = 0;
let debris1;
let debris2;
let incomingObjects1 = false;
let debrisSlowness = 340;

//game progress data
let score = 0;
let warpSpeed = 1;
let isUserAlive;
let speedIncrease;
let gameIsRunning = false;
let playerName;
const leaders = [];

toggleElement(splashLeaders);

function toggleElement(element) {
  if (element.style.display === 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

window.addEventListener('keydown', function(e) {
  if (e.which === 38) {
    moveUp();
  } else if (e.which === 40) {
    moveDown();
  } else if (e.which === 37) {
    moveLeft();
  } else if (e.which === 39) {
    moveRight();
  } else if (e.which === 32) {
    if(gameIsRunning === false){
      startGame();
      toggleElement(splashMenu);
    } else {
      console.log('Charging photon torpedoes!'); //add shooting function here
    }
  } else if (e.which === 27) {
    console.log('reset scores and take me to the main menu!');
    toggleElement(splashLeaders);
    toggleElement(splashMenu);
  }
});

function promptPlayerName(){
  playerName = window.prompt('Enter you name here Captain, and proceed to the Hall of Fame.', 'Captain');
}

function addPlayerToHoF(playerName, score){
  class Player{
    constructor(name, highScore){
      this.name = playerName;
      this.highScore = score;
      console.log(`${name} has scored ${highScore}`);
    }
  }
  while (leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }
  leaders.push(new Player(playerName, score));
  leaders.sort(compare);
  leaders.forEach(function(element){
    const newElement = document.createElement('li');
    newElement.textContent = `${element.highScore} - ${element.name}`;
    leaderboard.appendChild(newElement);
  });
}

function incrementSpeed(){
  speedIncrease = setInterval(function() {
    debrisSlowness = debrisSlowness - 30;
    // debrisSlowness2 = debrisSlowness2 - 30;
    warpSpeed = warpSpeed + 1;
    warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
    console.log('Increasing warp speed...', warpSpeed);
    if (warpSpeed === 10 || incomingObjects1 === false){
      console.log('Warp speed 10 achieved!', warpSpeed);
      clearInterval(speedIncrease);
    }
  }, 10000 );
}

function compare(a,b) {
  if (a.highScore > b.highScore)
    return -1;
  if (a.highScore < b.highScore)
    return 1;
  return 0;
}

function createGrid(){
  for(let i = 0; i < 200; i++){
    const newGrid = document.createElement('div');
    grid.appendChild(newGrid).setAttribute('id', i);
  }
}

// NOTE:  reset car to starting point
function startGame() {
  score = 0;
  scoreCounter.textContent = 'Score: 000';
  warpSpeed = 1;
  warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
  debrisSlowness = 340;
  gameIsRunning = true;
  generatedebris();
  isUserAlive = setInterval(function() {
    if (incomingObjects1 === false) {
      generatedebris();
      score = score + 100;
      scoreCounter.textContent = `Score: ${score}`;
    } else if (car1.classList.contains('debris')) {
      console.log('Game Over! You have crashed.');
      // video.pause();
      clearInterval(isUserAlive);
      clearInterval(incrementSpeed);
      gameIsRunning = false;
      promptPlayerName();
      toggleElement(splashLeaders);
      leaderboard.innerHtml = '';
      addPlayerToHoF(playerName, score);
    }
  }, 1);
  incrementSpeed();
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

function generatedebris() {
  if (car1.classList.contains('debris') === false){
    incomingObjects1 = true;
    debrisPos1 = (Math.floor(Math.random() * 9));
    debrisPos2 = debrisPos1 + Math.floor(Math.random()*15);
    debris1 = document.querySelectorAll('.grid div')[debrisPos1];
    debris2 = document.querySelectorAll('.grid div')[debrisPos2];
    debris1.classList.add('debris');
    debris2.classList.add('debris');
    const fallingDown = setInterval(function(){
      if (debrisPos2 < 200 && debrisPos2.toString().slice(0,2) !== '19'){
        debrisPos1 = debrisPos1+10;
        debrisPos2 = debrisPos2+10;
        debris1.classList.remove('debris');
        debris2.classList.remove('debris');
        debris1 = document.querySelectorAll('.grid div')[debrisPos1];
        debris2 = document.querySelectorAll('.grid div')[debrisPos2];
        debris1.classList.add('debris');
        debris2.classList.add('debris');
      } else {
        incomingObjects1 = false;
        clearInterval(fallingDown);
        debris1.classList.remove('debris');
        debris2.classList.remove('debris');
      }
    }, debrisSlowness);
  }
}

// Second debris - buggy...

// let debrisPos3 = 0;
// let debrisPos4 = 0;
// let debris3;
// let debris4;
// let incomingObjects2 = false;
// let debrisSlowness2 = 325;

//inside isUserAlive setInterval
// if (incomingObjects2 === false) {
//   generatedebris2();
// }

// generatedebris2();

// function generatedebris2() {
//   if (incomingObjects2 === false){
//     incomingObjects2 === true;
//     debrisPos3 = (Math.floor(Math.random() * 9));
//     debrisPos4 = 9 - debrisPos3;
//     debris3 = document.querySelectorAll('.grid div')[debrisPos3];
//     debris4 = document.querySelectorAll('.grid div')[debrisPos4];
//     debris3.classList.add('debris');
//     debris4.classList.add('debris');
//     const fallingDown2 = setInterval(function(){
//       if (debrisPos4 < 200 && debrisPos4.toString().slice(0,2) !== '19'){
//         debrisPos3 = debrisPos3+10;
//         debrisPos4 = debrisPos4+10;
//         debris3.classList.remove('debris');
//         debris4.classList.remove('debris');
//         debris3 = document.querySelectorAll('.grid div')[debrisPos3];
//         debris4 = document.querySelectorAll('.grid div')[debrisPos4];
//         debris3.classList.add('debris');
//         debris4.classList.add('debris');
//       } else {
//         clearInterval(fallingDown2);
//         debris3.classList.remove('debris');
//         debris4.classList.remove('debris');
//       }
//     }, debrisSlowness2);
//   }
// }
