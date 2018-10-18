console.log('Prepare for Warp!');


const grid = document.querySelector('.grid');
const scoreCounter = document.querySelector('.score');
const warpMeter = document.querySelector('.warpspeed');
const splashMenu = document.querySelector('.splash-menu-intro');
const splashGameMode = document.querySelector('.splash-game-mode');
const splashShipSelect = document.querySelector('.splash-ship-select');
const splashInstructions = document.querySelector('.splash-instructions');
const splashPause = document.querySelector('.splash-pause');
const splashLeaders = document.querySelector('.splash-leaders');
const leaderboard = document.querySelector('.leaderboard');
const warpTenHeading = document.querySelector('.grid h3');
//Sound and music
let isMusicPlaying = false;
let areSoundsOn = true;
let bonusSound;
const music = document.querySelector('#bgmusic');
const sfx = document.querySelector('#sfx');
const toggleMusicIcon = document.querySelectorAll('.sound-controls i')[0];
const toggleSoundIcon = document.querySelectorAll('.sound-controls i')[1];
toggleSoundIcon.addEventListener('click', toggleSoundsIcon);
toggleMusicIcon.addEventListener('click', toggleMusic);

//Pause menu buttons
const toggleSoundsButton = document.querySelector('.sounds');
const toggleMusicButton = document.querySelector('.music');
const restartButton = document.querySelector('.restart');
const mainMenuButton = document.querySelector('.main-menu');
restartButton.addEventListener('click', restartGame);
mainMenuButton.addEventListener('click', goToMainMenu);
toggleSoundsButton.addEventListener('click', toggleSounds);
toggleMusicButton.addEventListener('click', toggleMusic);


//Different menus/screens:
toggleElement(warpMeter);
toggleElement(scoreCounter);
toggleElement(splashGameMode);
toggleElement(splashInstructions);
toggleElement(splashShipSelect);
toggleElement(splashPause);
toggleElement(grid);
toggleElement(splashLeaders);
let isSplashMenu = true;
let isSplashGameMode = false;
let isSplashInstr = false;
let isSplashShipSel = false;
let isSplashPause = false;
let isSplashGrid = false;
let isSplashLeaders = false;

//Game Mode
let isSinglePlayer = false;
let isArcadeMode = false;
const singlePlayer = document.querySelector('.single-player');
const arcadeGameMode = document.querySelector('.arcade');
singlePlayer.addEventListener('click', selectSinglePLayer);
arcadeGameMode.addEventListener('click', selectArcadeMode);

createGrid();

//Spacecraft data
let spacecraftPos = 194;
let spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
spacecraft.classList.add('spacecraft');

//Debris data
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

//Bonus points data
let bonusPos;
let isBonusAvailable = false;
let bonus;
let introduceBonus;

//Game progress data
let score = 0;
let warpSpeed = 0;
let isUserAlive;
let speedIncrease;
let gameIsRunning = false;
let playerName;
let leaders = [];

//Keyboard listeners
window.addEventListener('keydown', function(e) {
  if (e.which === 38) { // up arrow
    if(gameIsRunning){
      moveUp();
    }
  } else if (e.which === 40) { //down arrow
    if(gameIsRunning){
      moveDown();
    }
  } else if (e.which === 37) { //left arrow
    if(gameIsRunning){
      moveLeft();
    }
  } else if (e.which === 39) { //up arrow
    if(gameIsRunning){
      moveRight();
    }
  } else if (e.which === 32) { //spacebar key
    if (isSplashMenu){
      toggleElement(splashMenu);
      isSplashMenu = false;
      toggleElement(splashGameMode);
      isSplashGameMode = true;
    } else if (isSplashGameMode){
      if(isSinglePlayer && isArcadeMode){
        proceedToSelectShip();
      } else {
        suggestNextStep();
      }
    } else if (isSplashShipSel){
      toggleElement(splashShipSelect);
      isSplashShipSel = false;
      toggleElement(splashInstructions);
      isSplashInstr = true;
    } else if (isSplashInstr){
      toggleElement(splashInstructions);
      isSplashInstr = false;
      toggleElement(grid);
      isSplashGrid = true;
      if (isSplashGrid && (gameIsRunning === false)){
        startGame();
        toggleElement(warpMeter);
        toggleElement(scoreCounter);
        if(areSoundsOn){
          sfx.setAttribute('src', 'sounds/start-warp.wav');
          sfx.play();
        }
      }
    } else if (isSplashGrid && gameIsRunning) {
      //add shooting function here
      if(areSoundsOn){
        sfx.setAttribute('src', 'sounds/photon-torpedo.mp3');
        sfx.play();
      }
      setTimeout(function () {
        fire();
      }, 500);
    }
  } else if (e.which === 27) { //Escape key
    if(isSplashGrid && gameIsRunning){
      pauseGame();
    } else if (isSplashPause && !gameIsRunning){
      resumeGame();
    } else if (isSplashLeaders){
      toggleElement(splashLeaders);
      isSplashLeaders = false;
      toggleElement(splashMenu);
      isSplashMenu = true;
    }
  } else if (e.which === 65) { //A key
    if (isSplashGameMode){
      selectArcadeMode();
    }
  } else if (e.which === 83) { //S key
    if (isSplashGameMode){
      selectSinglePLayer();
    }
    if (isSplashPause){
      toggleSounds();
    }
  } else if (e.which === 77) { //M key
    if (isSplashPause){
      goToMainMenu();
    }
  } else if (e.which === 82) { //R key
    if (isSplashPause){
      restartGame();
    }
  } else if (e.which === 85) { //U key
    if (isSplashPause){
      toggleMusic();
    }
  }
});
//================Fire testing==========================
let laserPos = spacecraftPos;
let laser;
let laserTrajectory;
function fire(){
  console.log('Charging photon torpedoes!');
  laserPos = spacecraftPos - 10;
  laser = document.querySelectorAll('.grid div')[laserPos];
  laser.classList.add('laser');
  laserTrajectory = setInterval(function(){
    if(laserPos >= 10){
      laserPos = laserPos - 10;
      laser.classList.remove('laser');
      laser = document.querySelectorAll('.grid div')[laserPos];
      laser.classList.add('laser');
    } else if (laserPos < 10){
      clearInterval(laserTrajectory);
      laser.classList.remove('laser');
    }
  }, 100);
}

// setInterval(function(){
//   if((laserPos === debrisPos1) || (laserPos === debrisPos2)){
//     // console.log('hit');
//     incrementScoreBy(10000);
//   }
// }, 1);
//================Fire testing==========================


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

function generateBonus(){
  bonusPos = (Math.floor(Math.random() * 190));
  bonus = document.querySelectorAll('.grid div')[bonusPos];
  bonus.classList.add('bonus');
  isBonusAvailable = true;
}

function generateDebris() {
  if ((spacecraftPos !== debrisPos1) || (spacecraftPos !== debrisPos2)){
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
        debrisPos1 = debrisPos1 + 10;
        debrisPos2 = debrisPos2 + 10;
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

function goToMainMenu(){
  toggleElement(splashPause);
  isSplashPause = false;
  stopGame();
  toggleElement(warpMeter);
  toggleElement(scoreCounter);
  toggleElement(grid);
  isSplashGrid = false;
  toggleElement(splashMenu);
  isSplashMenu = true;
}

function incrementScoreBy(points){
  score = score + points;
  scoreCounter.textContent = `Score: ${score}`;
}

function incrementSpeed(){
  speedIncrease = setInterval(function() {
    debrisSlowness = debrisSlowness - 30;
    console.log(debrisSlowness);
    warpSpeed = warpSpeed + 1;
    warpMeter.textContent = `Warp Speed: ${warpSpeed}`;
    console.log('Increasing warp speed...', warpSpeed);
    if (warpSpeed === 10){
      warpTenHeading.classList.add('warp10');
      warpTenHeading.classList.remove('invisible');
      console.log('Warp speed 10 achieved!', warpSpeed);
      clearInterval(speedIncrease);
    }
  }, 5000 );
}

function moveDown(){
  if(spacecraftPos < 190){
    spacecraft.classList.remove('spacecraft');
    spacecraftPos = spacecraftPos + 10;
    spacecraft = document.querySelectorAll('.grid div')[spacecraftPos];
    spacecraft.classList.add('spacecraft');
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/move-spacecraft.mp3');
      sfx.play();
    }
  } else {
    grid.classList.add('grid-border-bottom');
    setTimeout(function () {
      grid.classList.remove('grid-border-bottom');
    }, 300);
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
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/move-spacecraft.mp3');
      sfx.play();
    }
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
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/move-spacecraft.mp3');
      sfx.play();
    }
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
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/move-spacecraft.mp3');
      sfx.play();
    }
  } else {
    grid.classList.add('grid-border-top');
    setTimeout(function () {
      grid.classList.remove('grid-border-top');
    }, 300);
  }
}

function pauseGame(){
  clearInterval(isUserAlive);
  clearInterval(speedIncrease);
  clearInterval(introduceBonus);
  clearInterval(fallingDown);
  gameIsRunning = false;
  toggleElement(splashPause);
  isSplashPause = true;
  removeAllDebris();
}

function playBonusSound(){
  const bonusSound = setInterval(function () {
    if(spacecraftPos === bonusPos){
      if(areSoundsOn){
        const bonusSound1 = sfx.setAttribute('src', 'sounds/bonus-acquired.mp3');
        sfx.play();
        clearInterval(bonusSound);
        bonusSound1.addEventListener('ended', function(){
          playBonusSound();
        });
      }
    }
  }, 10);
}

function proceedToSelectShip(){
  toggleElement(splashGameMode);
  isSplashGameMode = false;
  toggleElement(splashShipSelect);
  isSplashShipSel = true;
}

function promptPlayerName(){
  playerName = window.prompt('Enter you name here Captain, and proceed to the Hall of Fame.', 'Captain');
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

function runGame(){
  isUserAlive = setInterval(function() {
    if (incomingDebris1 === false) {
      generateDebris();
      incrementScoreBy(1000);
      document.querySelectorAll('.grid div').forEach(element => element.classList.remove('tilt-left'));
    } else if ((spacecraftPos === debrisPos1) || (spacecraftPos === debrisPos2)) {
      console.log('Game Over! You have crashed.');
      toggleElement(scoreCounter);
      toggleElement(warpMeter);
      toggleElement(grid);
      takeHighScore();
      stopGame();
    } else if (spacecraftPos === bonusPos){
      bonus.classList.remove('bonus');
      isBonusAvailable = false;
      incrementScoreBy(Math.floor(Math.random() * 1000 * warpSpeed));
    }
  }, 1);
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

function restartGame(){
  toggleElement(splashPause);
  isSplashPause = false;
  stopGame();
  startGame();
  if(areSoundsOn){
    sfx.setAttribute('src', 'sounds/start-warp.wav');
    sfx.play();
  }
}

function resumeGame(){
  gameIsRunning = true;
  generateDebris();
  startGeneratingBonus();
  runGame();
  incrementSpeed();
  toggleElement(splashPause);
  isSplashPause = false;
}

function selectSinglePLayer(){
  singlePlayer.classList.add('selected');
  isSinglePlayer = true;
  if(areSoundsOn){
    sfx.setAttribute('src', 'sounds/game-mode.wav');
    sfx.play();
  }
}

function selectArcadeMode() {
  arcadeGameMode.classList.add('selected');
  isArcadeMode = true;
  if(areSoundsOn){
    sfx.setAttribute('src', 'sounds/challenge-type.wav');
    sfx.play();
  }
}

function startGame() {
  // video.play();
  resetGame();
  gameIsRunning = true;
  generateDebris();
  startGeneratingBonus();
  runGame();
  incrementSpeed();
}

function startGeneratingBonus(){
  introduceBonus = setInterval(function(){
    if(gameIsRunning){
      removeBonus();
      generateBonus();
    }
    playBonusSound();
  } , 5000);
}

function stopGame(){
  // video.pause();
  clearInterval(isUserAlive);
  clearInterval(speedIncrease);
  clearInterval(introduceBonus);
  clearInterval(fallingDown);
  clearInterval(bonusSound);
  removeBonus();
  removeAllDebris();
  warpTenHeading.classList.remove('warp10');
  warpTenHeading.classList.add('invisible');
  gameIsRunning = false;
  if(areSoundsOn){
    sfx.setAttribute('src', 'sounds/end-warp.wav');
    sfx.play();
  }
}

function suggestNextStep(){
  const suggestion = document.createElement('span');
  suggestion.textContent = 'Please select Game Mode and Challenge Type to proceed.';
  splashGameMode.insertBefore(suggestion, document.querySelector('.splash-game-mode').children[4]);
  setTimeout(function () {
    splashGameMode.removeChild(suggestion);
  }, 2000);
}

function takeHighScore(){
  promptPlayerName();
  toggleElement(splashLeaders);
  isSplashLeaders = true;
  leaderboard.innerHtml = '';
  addPlayerToHoF(playerName, score);
}

function toggleElement(element) {
  if (element.style.display === 'none') {
    element.style.display = 'flex';
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/click.mp3');
      sfx.play();
    }
  } else {
    element.style.display = 'none';
  }
}

function toggleSounds(){
  if (areSoundsOn) {
    //disable all sounds
    areSoundsOn = false;
    console.log('sounds effects have been switched off');
    toggleSoundsButton.textContent = 'Sounds: OFF';
  } else {
    //enable all sounds
    areSoundsOn = true;
    console.log('sounds effects have been switched on');
    toggleSoundsButton.textContent = 'Sounds: ON';
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/click.mp3');
      sfx.play();
    }
  }
}

function toggleSoundsIcon(){
  if(areSoundsOn){
    toggleSounds();
    toggleSoundIcon.classList.remove('fa-volume-up');
    toggleSoundIcon.classList.add('fa-volume-off');
  } else {
    toggleSounds();
    toggleSoundIcon.classList.remove('fa-volume-off');
    toggleSoundIcon.classList.add('fa-volume-up');
  }
}

function toggleMusic(){
  if (isMusicPlaying){
    music.pause();
    isMusicPlaying = false;
    toggleMusicButton.textContent = 'Music: OFF';
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/click.mp3');
      sfx.play();
    }
  } else {
    music.play();
    isMusicPlaying = true;
    toggleMusicButton.textContent = 'Music: ON';
    if(areSoundsOn){
      sfx.setAttribute('src', 'sounds/click.mp3');
      sfx.play();
    }
  }
}

//NOTE: EXTRA - at warp 10, popup pulsing heading showing max warp factor reached
//NOTE: EXTRA - add extra ships to choose from with added functionality
// weapons - shoot projecticles to destroy debris
// hullIntegrity to survive impact with debris - bonus to restore hullIntegrity
// NOTE: EXTRA - Player 2 - additional spacecraft
// NOTE: EXTRA - Boss for joint/solo missions

// const arrayOfSpaceshipImgClasses = ['spacecraft1', 'spacecraft2', 'spacecraft3', 'spacecraft4'];
//
// const iconSpacecraft1 = document.createElement('img').setAttribute('src', 'images/spacecraft1.png');
// splashMenu.appendChild(iconSpacecraft1).setAttribute('src', 'images/spacecraft1.png');
// const spacecraft1 = {
//   name: 'Wraith',
//   hullIntegrity: 300,
//   imgClass: 'spacecraft1',
//   weapon: 'photonTorpedoes',
//   icon: iconSpacecraft1
// };
//
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
