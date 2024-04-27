# Pokemon Memory Match
## Workflow
1. Make connection to Poke API
2. Randomly select specified number of pokemon (n=8 for a 4x4 grid; n=12 for 4x6 etc)
  - this function should return a promise with selected number of pokemon and their attributes in json format
  - print to innerHTML of 'game' div to check
3. Extract relevant data (type, name and sprite) from random pokemon fetched in step
4. Define Pokemon Class - this will need to include a class method to generate the html for that card element
5. Create class instances (objects) of each pokemon selected by the random api calls and map them to the cards
6. create front and back of cards
7. Place the cards face down on the table
8. Define the game loop & event listeners
9. Define player actions
10. Define game logic and features (match/no match, increment score, leaderboard etc.)
11. Define end game (win/lose)
12. Reset game

References/Resources
- https://photics.com/flipping-a-card-with-html-css-javascript/
- https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
- https://www.w3schools.com/howto/howto_css_flip_card.asp
- 