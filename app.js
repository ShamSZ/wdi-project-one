console.log('Prepare for Warp!');

const grid = document.querySelector('.grid');
const scoreCounter = document.querySelector('.score');
const warpMeter = document.querySelector('.warpspeed');
// const video = document.querySelector('#background');
const splashMenu = document.querySelector('.splash-menu');
const splashLeaders = document.querySelector('.splash-leaders');
const leaderboard = document.querySelector('.leaderboard');
// video.pause();
createGrid();
toggleElement(splashLeaders);

let shuttlePos = 194;
let shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
shuttle1.classList.add('shuttle');

// //redunadnt left/right click buttons to be removed before final game deployment
// const controls = document.querySelector('.controls');
// const leftButton = document.createElement('div');
// const rightButton = document.createElement('div');
// controls.appendChild(leftButton).setAttribute('id', 'left');
// controls.appendChild(rightButton).setAttribute('id', 'right');
// leftButton.textContent = '<<< Portside';
// rightButton.textContent = 'Starboard >>>';
// leftButton.addEventListener('click', moveLeft);
// rightButton.addEventListener('click', moveRight);

//debris data
let debrisPos1 = 0;
let debrisPos2 = 0;
let debris1;
let debris2;
let incomingObjects1 = false;
let debrisSlowness = 340;
let fallingDown;

//bonus data
let bonusPos;
let isBonusAvailable = false;
let bonus;
let introduceBonus;

//game progress data
let score = 0;
let warpSpeed = 1;
let isUserAlive;
let speedIncrease;
let gameIsRunning = false;
let playerName;
let leaders = [];

window.addEventListener('keydown', function(e) {
  if (e.which === 38) {
    moveUp();
  } else if (e.which === 40) {
    moveDown();
  } else if (e.which === 37) {
    moveLeft();
  } else if (e.which === 39) {
    moveRight();
  } else if (e.which === 32) { //spacebar
    if(gameIsRunning === false){
      startGame();
      toggleElement(splashMenu);
    } else {
      console.log('Charging photon torpedoes!'); //add shooting function here
    }
  } else if (e.which === 27) { //escape key
    console.log('Reset scores and take me to the main menu!');
    resetGame();
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
  leaders = leaders.slice(0,5);
  leaders.forEach(function(element){
    const newElement = document.createElement('li');
    newElement.textContent = `${element.highScore} >>> ${element.name}`;
    leaderboard.appendChild(newElement);
  });
}

function incrementSpeed(){
  speedIncrease = setInterval(function() {
    debrisSlowness = debrisSlowness - 30;
    warpSpeed = warpSpeed + 1;
    warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
    console.log('Increasing warp speed...', warpSpeed);
    if (warpSpeed === 10){
      console.log('Warp speed 10 achieved!', warpSpeed);
      clearInterval(speedIncrease);
    }
  }, 5000 );
}

function resetGame(){
  stopGame();
  score = 0;
  scoreCounter.textContent = 'Score: 000';
  warpSpeed = 1;
  warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
  debrisSlowness = 340;
  shuttle1.classList.remove('shuttle');
  shuttlePos = 194;
  shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
  shuttle1.classList.add('shuttle');
}

function startGame() {
  // video.play();
  gameIsRunning = true;
  generateDebris();
  startGeneratingBonus();
  isUserAlive = setInterval(function() {
    if (incomingObjects1 === false) {
      generateDebris();
      incrementScoreBy(1000);
      // document.querySelectorAll('.grid div').forEach(element => element.classList.remove('tilt-left'));
    } else if (shuttle1.classList.contains('debris')) {
      console.log('Game Over! You have crashed.');
      stopGame();
      takeHighScore();
    }
    if (shuttle1.classList.contains('bonus')){
      bonus.classList.remove('bonus');
      isBonusAvailable = false;
      incrementScoreBy(Math.floor(Math.random() * 10000));
    }
  }, 1);
  incrementSpeed();
}

function stopGame(){
  // video.pause();
  clearInterval(isUserAlive);
  clearInterval(speedIncrease);
  clearInterval(introduceBonus);
  clearInterval(fallingDown);
  removeBonus();
  removeAllDebris();
  gameIsRunning = false;
}

function takeHighScore(){
  promptPlayerName();
  toggleElement(splashLeaders);
  leaderboard.innerHtml = '';
  addPlayerToHoF(playerName, score);
}

function toggleElement(element) {
  if (element.style.display === 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
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

function moveLeft(){
  if(shuttlePos % 10 !== 0){
    shuttle1.classList.remove('shuttle');
    shuttlePos--;
    shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
    shuttle1.classList.add('shuttle');
    //NOTE when shuttle1 is moved before timeout time can remove tilt class - the 'cell' remains tilted
    shuttle1.classList.add('tilt-left');
    setTimeout(function () {
      shuttle1.classList.remove('tilt-left');
    }, 50);
  } else {
    grid.classList.add('grid-border-left');
    setTimeout(function () {
      grid.classList.remove('grid-border-left');
    }, 300);
  }
}

function moveRight(){
  if(shuttlePos.toString().split('').pop() !== '9'){
    shuttle1.classList.remove('shuttle');
    shuttlePos++;
    shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
    shuttle1.classList.add('shuttle');
    //NOTE when shuttle1 is moved before timeout time can remove tilt class - the 'cell' remains tilted
    // shuttle1.classList.add('tilt-right');
    // setTimeout(function () {
    //   shuttle1.classList.remove('tilt-right');
    // }, 50);
  } else {
    grid.classList.add('grid-border-right');
    setTimeout(function () {
      grid.classList.remove('grid-border-right');
    }, 300);
  }
}

function moveUp(){
  if(shuttlePos > 9){
    shuttle1.classList.remove('shuttle');
    shuttlePos = shuttlePos - 10;
    shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
    shuttle1.classList.add('shuttle');
  } else {
    console.log('too far up!!');
  }
}

function moveDown(){
  if(shuttlePos < 190){
    shuttle1.classList.remove('shuttle');
    shuttlePos = shuttlePos + 10;
    shuttle1 = document.querySelectorAll('.grid div')[shuttlePos];
    shuttle1.classList.add('shuttle');
  } else {
    console.log('too far down!!');
  }
}

function generateDebris() {
  if (shuttle1.classList.contains('debris') === false){
    incomingObjects1 = true;
    debrisPos1 = (Math.floor(Math.random() * 9));
    debrisPos2 = debrisPos1 + Math.floor(Math.random()*19);
    debris1 = document.querySelectorAll('.grid div')[debrisPos1];
    debris2 = document.querySelectorAll('.grid div')[debrisPos2];
    debris1.classList.add('debris');
    debris2.classList.add('debris');
    fallingDown = setInterval(function(){
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

function removeBonus(){
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('bonus'));
  isBonusAvailable = false;
}

function removeAllDebris(){
  console.log('testing clear debris');
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris'));
}

function generateBonus(){
  bonusPos = (Math.floor(Math.random() * 190));
  bonus = document.querySelectorAll('.grid div')[bonusPos];
  bonus.classList.add('bonus');
  isBonusAvailable = true;
}

function startGeneratingBonus(){
  introduceBonus = setInterval(function(){
    if(gameIsRunning){
      removeBonus();
      generateBonus();
    }
  } , 5000);
}

function incrementScoreBy(points){
  score = score + points;
  scoreCounter.textContent = `Score: ${score}`;
}
