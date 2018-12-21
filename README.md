# **Project 1: Warp Factor** ![General Assembly](https://camo.githubusercontent.com/6ce15b81c1f06d716d753a61f5db22375fa684da/68747470733a2f2f67612d646173682e73332e616d617a6f6e6177732e636f6d2f70726f64756374696f6e2f6173736574732f6c6f676f2d39663838616536633963333837313639306533333238306663663535376633332e706e67)


## Overview
Warp Factor is an entertaining browser-based arcade style game. Challenge your reaction skills by avoiding the obstacles as you travel at Warp Factor speeds through space and accumulate bonus points to make into the Hall of Fame.

This was my first project from General Assembly's Web Development Immersive Course. It was an individual project built in a week, and was both the first proper game I had built, and my first real-world type practice with JavaScript.

Launch on [GitHub Pages](https://shamsz.github.io/wdi-project-one/). Check out the GitHub [Repo](https://github.com/ShamSZ/wdi-project-one).

![Gameplay demo](/images/readme-screenshots/warp-factor-demo.gif)

## Brief

* **Render a grid-based game in the browser**
* **Switch turns** between two players
* **Design logic for winning** & **visually display which player won**
* **Include separate HTML / CSS / JavaScript files**
* Use **Javascript or jQuery** for **DOM manipulation**
* **Deploy your game online**, using Github Pages, where the rest of the world can access it
* Use **semantic markup** for HTML and CSS (adhere to best practices)



## Technologies Used

* HTML5 with HTML5 audio
* CSS3 with animation
* JavaScript (ES6)
* Git
* GitHub
* Google Fonts

## Approach Taken

### Grid Layout & Generation of objects on screen

I decided the simplest way to represent the grid would be as an array of divs, wrapped within a flex-box, with each 'item' having an assigned CSS class to represent the items visually. This would mean representing the movement of items was straightforward using their indexes within the main array - for horizontal movement: +/- 1, and vertical movement: +/- 10(for a grid of width 10 boxes).

Debris would be generated at the top using Math.random to pick a random number between 0-9 for its starting position within the grid. Then using setInterval to 'move' it down at each interval, removing the debris class from the current position and adding it to the new position.

### Functionality
#### Collision
How would the app know if the user's spacecraft and and debris have collided?
I had to define what a collision was: when two or more items occupy the same space.
Each item had an index within the array, called position, if the position of the spacecraft and debris were the same, there was a collision:
``` JavaScript
if (spacecraftPos === debrisPos1){
  console.log('Game Over! You have crashed.');
}
```

#### Keypresses
From the start, I set myself a little challenge to enable the user to navigate the menus, start/pause and play the game using only the keyboard.

The user would have to manoeuvre the shuttle to avoid collision. I started off by adding clickable buttons to move left and right, it worked but wasn't exactly user friendly.
Once I figured out how to add keyboard interactivity by adding an event listener to the window, I mapped out all the keyboard buttons I'd need and wrote logic to perform a function depending on which menu the user was on:

``` JavaScript
window.addEventListener('keydown', function(e) {
  if (e.which === 38) { // up arrow
    if(gameIsRunning){
      moveUp();
    }
  }
});
```

#### Audio
In my previous projects, I had a lot of fun working with Audio, so I added a background track and sound effects for all button clicks/presses. As a bonus, I thought it would be good UX to enable toggling music and sounds, so I added these to the game pause menu and global clickable links at the top-right of the screen.
``` JavaScript
//enable all sounds
areSoundsOn = true;
console.log('sound effects have been switched on');
toggleSoundsButton.textContent = 'Sounds: ON';
if(areSoundsOn){
  sfx.setAttribute('src', 'sounds/click.mp3');
  sfx.play();
}
```

#### Featured Piece of Code no. 1

This function is called upon after the user has crashed the spacecraft, to create an object with their name and score; this is then pushed into an array that is sorted by highest scores, top 10 objects are selected and populated as `li` DOM objects in the Hall of Fame.
``` JavaScript
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
  leaders = leaders.slice(0,10);
  leaders.forEach(function(element){
    const newElement = document.createElement('li');
    newElement.textContent = `${element.highScore} >>> ${element.name}`;
    leaderboard.appendChild(newElement);
  });
}
```

#### Featured Piece of Code no. 2

This piece of CSS gives the grid its distinctive perspective look; adding that to the background this immerses the player into the feeling of warp-travel. From `/style.css`.
``` CSS
.grid {
  transform: perspective(5px) rotateX(1deg);
}
```

## Screenshots

**Gameplay at MVP**

![MVP Gameplay](/images/readme-screenshots/mvp.png)

**After some styling**

![After styling 1](/images/readme-screenshots/style1.png)
![After styling 2](/images/readme-screenshots/style2.png)

### Final Product
![Landing page](/images/readme-screenshots/home.png)

![Briefing page](/images/readme-screenshots/briefing.png)

![Game mode select page](/images/readme-screenshots/gamemode.png)

![Ship select page](/images/readme-screenshots/shipselect.png)

![Gameplay screenshot](/images/readme-screenshots/gameplay.png)

![Pause menu screenshot](/images/readme-screenshots/pausemenu.png)

![Scoreboard screenshot](/images/readme-screenshots/score.png)

## Bugs
Below is a list of some of the known bugs within the game:

* Shooting - it's not completed yet, however I left the visual effect in, as I found it cool!
  The bug with this, is that if you fire again before the first shot has managed to 'leave' the grid, the projectile remains frozen on the grid, until you shoot over it with another projectile.

* Debris Generation - sometimes, when debris is generated at the top, its position jumps.
  I believe this may be the interval timing of the previous wave clearing the new wave.

* Game restart - if during the game, the pause menu is called and then the game is resumed - all debris is cleared and regenerated as if new.

* Bonus - the collection of bonus items was intended to increment the score by a set number once; during testing I noticed that once the bonus had been collected and if the spacecraft remains on the bonus item's position, the points kept accumulating until the next bonus appeared elsewhere. This was due to the line of code responsible for score incrementation being inside the setInterval block.
I decided to use this as a feature for the game and kept it in.

## Wins and Blockers

One of the problems I had initially, was the removal of debris after it had left the grid; the console would return many errors stating it couldn't remove the class of undefined - I managed to get around this by limiting the movement of debris only within the 10x20 grid.

The biggest win, by far, was the amount of confidence I gained working with JavaScript during this project. I got the opportunity to apply my new learnings in a real-world project and achieved more than I had set out at the start.

## Future Content

Along with adding the shooting functionality, there are a number of potential future features I'd like to implement, such as:
* Boss game-mode, where the player must destroy an alien being that fires multiple projectiles at the player.
* An additional player(2nd spacecraft) that can help with Boss mode or just play Arcade mode to see who can score more points.
* More debris, different patterns of waves of debris.
* Ability to choose from a variety of spacecraft with different images, survivability and weaponry.
* Ability to increase the grid size.
* Authentication so users can keep track of their highest scores, compare it to other players globally and develop their spacecraft with upgrades and achievements.
* And much more!
