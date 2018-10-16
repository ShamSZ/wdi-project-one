console.log('Prepare for Warp!');

const grid = document.querySelector('.grid');
const scoreCounter = document.querySelector('.score');
const warpMeter = document.querySelector('.warpspeed');
// const video = document.querySelector('#background');
const splashMenu = document.querySelector('.splash-menu-intro');
const splashGameMode = document.querySelector('.splash-game-mode');
const splashShipSelect = document.querySelector('.splash-ship-select');
const splashInstructions = document.querySelector('.splash-instructions');
const splashPause = document.querySelector('.splash-pause');
const splashLeaders = document.querySelector('.splash-leaders');

const leaderboard = document.querySelector('.leaderboard');

// video.pause();

// User path
// NOTE: use toggleElement to show where user is on user path
// - splashMenu = true; / false;

// allways show:
  //H1
// on load show:
  //splashMenu
  //

  //on load hide:
  toggleElement(warpMeter);
  toggleElement(scoreCounter);

  toggleElement(splashGameMode);
  isSplashGameMode = false;
  toggleElement(splashInstructions);
  isSplashInstr = false;
  toggleElement(splashShipSelect);
  isSplashShipSel = false;
  toggleElement(splashPause);
  isSplashPause = false;
  toggleElement(grid);
  isSplashGrid = false;
  toggleElement(splashLeaders);
  isSplashLeaders = false;

createGrid();

let spacecraftPos = 194;
let spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
spacecraft.classList.add('spacecraft');



//debris data
let debrisPos1 = 0;
let debrisPos2 = 0;
let debris1;
let debris2;
let incomingDebris1 = false;
let debrisSlowness = 340;
let fallingDown;
let debrisClass1;
let debrisClass2;
const arrayOfDebrisImgClass = ['debris1', 'debris2', 'debris3', 'debris4', 'debris5'];

//bonus points data
let bonusPos;
let isBonusAvailable = false;
let bonus;
let introduceBonus;

//game progress data
let score = 0;
let warpSpeed = 0;
let isUserAlive;
let speedIncrease;
let gameIsRunning = false;
let playerName;
let leaders = [];

//all keyboard listeners
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
      if (playerName === null){
        playerName = 'Anonymous Star Lord';
      }
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
    console.log(debrisSlowness);
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
  spacecraft.classList.remove('spacecraft');
  spacecraftPos = 194;
  spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
  spacecraft.classList.add('spacecraft');
}

function startGame() {
  // video.play();
  gameIsRunning = true;
  generateDebris();
  startGeneratingBonus();
  isUserAlive = setInterval(function() {
    if (incomingDebris1 === false) {
      generateDebris();
      incrementScoreBy(1000);
      document.querySelectorAll('.grid div').forEach(element => element.classList.remove('tilt-left'));
    } else if (spacecraft.classList.contains('debris')) {
      console.log('Game Over! You have crashed.');
      stopGame();
      takeHighScore();
    }
    if (spacecraft.classList.contains('bonus')){
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
  if(spacecraftPos % 10 !== 0){
    spacecraft.classList.remove('spacecraft');
    spacecraftPos--;
    spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
    spacecraft.classList.add('spacecraft');
    spacecraft.classList.add('tilt-left');
    setTimeout(function () {
      spacecraft.classList.remove('tilt-left');
    }, 300);
  } else {
    grid.classList.add('grid-border-left');
    setTimeout(function () {
      grid.classList.remove('grid-border-left');
    }, 300);
  }
}

function moveRight(){
  if(spacecraftPos.toString().split('').pop() !== '9'){
    spacecraft.classList.remove('spacecraft');
    spacecraftPos++;
    spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
    spacecraft.classList.add('spacecraft');
    spacecraft.classList.add('tilt-right');
    setTimeout(function () {
      spacecraft.classList.remove('tilt-right');
    }, 300);
  } else {
    grid.classList.add('grid-border-right');
    setTimeout(function () {
      grid.classList.remove('grid-border-right');
    }, 300);
  }
}

function moveUp(){
  if(spacecraftPos > 9){
    spacecraft.classList.remove('spacecraft');
    spacecraftPos = spacecraftPos - 10;
    spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
    spacecraft.classList.add('spacecraft');
  } else {
    grid.classList.add('grid-border-top');
    setTimeout(function () {
      grid.classList.remove('grid-border-top');
    }, 300);
  }
}

function moveDown(){
  if(spacecraftPos < 190){
    spacecraft.classList.remove('spacecraft');
    spacecraftPos = spacecraftPos + 10;
    spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
    spacecraft.classList.add('spacecraft');
  } else {
    grid.classList.add('grid-border-bottom');
    setTimeout(function () {
      grid.classList.remove('grid-border-bottom');
    }, 300);
  }
}

function generateDebris() {
  if (spacecraft.classList.contains('debris') === false){
    debrisClass1 = arrayOfDebrisImgClass[Math.floor(Math.random()*arrayOfDebrisImgClass.length)];
    debrisClass2 = arrayOfDebrisImgClass[Math.floor(Math.random()*arrayOfDebrisImgClass.length)];
    incomingDebris1 = true;
    debrisPos1 = (Math.floor(Math.random() * 9));
    debrisPos2 = debrisPos1 + Math.floor(Math.random()*19);
    debris1 = document.querySelectorAll('.grid div')[debrisPos1];
    debris2 = document.querySelectorAll('.grid div')[debrisPos2];
    debris1.classList.add('debris', debrisClass1);
    debris2.classList.add('debris', debrisClass2);
    fallingDown = setInterval(function(){
      if (debrisPos2 < 200 && debrisPos2.toString().slice(0,2) !== '19'){
        debrisPos1 = debrisPos1+10;
        debrisPos2 = debrisPos2+10;
        debris1.classList.remove('debris', debrisClass1);
        debris2.classList.remove('debris', debrisClass2);
        debris1 = document.querySelectorAll('.grid div')[debrisPos1];
        debris2 = document.querySelectorAll('.grid div')[debrisPos2];
        debris1.classList.add('debris', debrisClass1);
        debris2.classList.add('debris', debrisClass2);
      } else {
        incomingDebris1 = false;
        clearInterval(fallingDown);
        debris1.classList.remove('debris', debrisClass1);
        debris2.classList.remove('debris', debrisClass2);
      }
    }, debrisSlowness);
  }
}

function removeBonus(){
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('bonus'));
  isBonusAvailable = false;
}

function removeAllDebris(){
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris'));
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris1'));
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris2'));
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris3'));
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris4'));
  document.querySelectorAll('.grid div').forEach(element => element.classList.remove('debris5'));
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





//NOTE: EXTRA - background music and sfx
//NOTE: EXTRA - at warp 10, popup pulsing heading showing max warp factor reached
//NOTE: EXTRA - add extra ships to choose from with added functionality
// weapons - shoot projecticles to destroy debris
// hullIntegrity to survive impact with debris - bonus to restore hullIntegrity
// NOTE: EXTRA - Player 2 - additional spacecraft
// NOTE: EXTRA - Boss for joint/solo missions

// const arrayOfSpaceshipImgClasses = ['spacecraft1', 'spacecraft2', 'spacecraft3', 'spacecraft4'];
//
// const spacecraft1 = {
//   name: 'Wraith',
//   hullIntegrity: 300,
//   imgClass: 'spacecraft1',
//   weapon: 'photonTorpedoes'
// };
// const spacecraft2 = {
//   name: 'Blade',
//   hullIntegrity: 200,
//   imgClass: 'spacecraft2',
//   weapon: 'laserPulse'
// };
// const spacecraft3 = {
//   name: 'Valkyrie',
//   hullIntegrity: 400,
//   imgClass: 'spacecraft3',
//   weapon: 'ionCannon'
// };
// const spacecraft4 = {
//   name: 'Vortex',
//   hullIntegrity: 300,
//   imgClass: 'spacecraft4',
//   weapon: 'plasmaGun'
// };


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
