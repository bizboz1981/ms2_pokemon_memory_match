# Pokemon Memory Match
## Workflow
✅ Tested and working
🔸 Partially Implemented
🛑 Not yet implemented
💀 Feature abandoned

1. Make connection to Poke API ✅
2. Randomly select specified number of pokemon (n=8 for a 4x4 grid; n=12 for 4x6 etc) 🔸
  - this function should return a promise with selected number of pokemon and their attributes in json format ✅
  - print to innerHTML of 'game' div to check ✅
3. Extract relevant data (type, name and sprite) from random pokemon fetched in step ✅
4. Define Pokemon Class - this will need to include a class method to generate the html for that card element 🔸
5. Create class instances (objects) of each pokemon selected by the random api calls and map them to the cards 🛑
6. create front and back of cards ✅
7. Place the cards face down on the table ✅
8.  Define game logic and features (match/no match, increment score, leaderboard etc.)\
  - Flip cards✅
    - add 'flipped' class to card on click ✅
    - hide back and show front of card✅
    - increment counter by 1✅
    - when counter == 2, invoke compareCards function, reset counter to 0✅
  - check cards:
    - compare custom data types (name of pokemon) on cards with 'flipped' class✅
    - if the same, do not turn back over✅
    - increment score by 1✅
    - check if all cards are flipped✅
9.  Add turn counter
10. Add leaderboard
11. Add timer
12. add option for player to choose number of pairs (between 4 & 12)?
13. different levels?
14. Define end game (win/lose) ✅
15. Reset game
16. New branch to attempt implementation of OOP / Pokemon class 
17. Style the game & make responsive
18. 'You Won' animation
19. Pokemon name and type

References/Resources
- https://photics.com/flipping-a-card-with-html-css-javascript/
- https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
- https://www.w3schools.com/howto/howto_css_flip_card.asp
- https://github.com/Cushione/four-seasons-memory-game/tree/main
- https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
- https://stackoverflow.com/questions/45960216/insert-array-of-elements-into-the-dom // insert array of elements to DOM?
- https://photics.com/flipping-a-card-with-html-css-javascript/
- https://stackoverflow.com/questions/55175428/the-this-keyword-not-working-with-arrow-functions /// cannot use 'this.' inside arrow functions, refactor to regular func
- https://stackoverflow.com/questions/17123327/align-text-to-the-bottom-of-a-div - align text in cardgood 
- https://css-tricks.com/almanac/selectors/a/attribute/ - use data attr as css selectors
- https://www.pokemon.com/us/pokemon-virtual-backgrounds/ = background image

w3schools animation doesn't seem to work