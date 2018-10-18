# General Assembly WDI Project 1: Warp Factor


[GitHub Pages](https://shamsz.github.io/wdi-project-one/).

[GitHub Repo](https://github.com/ShamSZ/wdi-project-one).

Warp Factor is an entertaining browser-based arcade style game. Challenge your reaction skills by avoiding the obstacles as you travel at Warp Factor speeds through space and accumulate bonus points to make into the Hall of Fame.

Warp Factor is my first project from General Assembly's Web Development Immersive. It was an individual project built in a week, and was both the first proper game I had built, and my first real-world type practice with JavaScript.

## Screenshots of all screens

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
* JavaScript (ECMAScript 6)
* Git
* GitHub
* Google Fonts

## Approach Taken

### Grid Layout & Generation of objects on screen
### Functionality
#### Manoeuvring
#### Keypresses
### Audio
### Featured Piece of Code no. 1

This functioned is called upon after the user has crashed the spacecraft, to create an object with their name and score; this is then pushed into an array that is sorted by highest scores, top 5 objects are selected and populated as `li` DOM objects in the Hall of Fame. From `/app.js`.
``` JavaScript
addPLayerToHoF(){

}
```
### Gameplay at MVP

screenshot

### After some styling


### Featured Piece of Code no. 2

This piece of CSS gives the grid its distinctive perspective look; adding that to the background this immerses the player into warp-travel. From `/style.css`.
``` CSS
.grid {
  transform: perspective(5px) rotateX(1deg);
}
```

## Wins and Blockers


## Future Content

Along with adding the shooting functionality, there are a number of potential future features I'd like to implement, such as:
* Boss game-mode, where the player must destroy an alien being that fires multiple projectiles at the player
* An additional player(2nd spacecraft) that can help with Boss mode or just play Arcade mode to see who can score more points
* Ability to choose from a variety of spacecraft with different images, survivability and weaponry
* Ability to increase the grid size
* Authentication so users can keep track of their highest scores, compare it to other players globally, develop their spacecraft with upgrades and achievements
* And much more!
