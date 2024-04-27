# Pokemon Memory Match
## Workflow
1. Make connection to Poke API
2. Randomly select specified number of pokemon (n=8 for a 4x4 grid; n=12 for 4x6 etc)
  - this function should return a promise with selected number of pokemon and their attributes in json format
<<<<<<< HEAD
  - print to innerHTML of 'game' div to check
3. Extract relevant data (type, name and sprite) from random pokemon fetched in step
4. Define Pokemon Class - this will need to include a class method to generate the html for that card element
5. Create class instances (objects) of each pokemon selected by the random api calls and map them to the cards
6. Place the cards face down on the table
7. Define the game loop & event listeners
8. Define player actions
9. Define game logic and features (match/no match, increment score, leaderboard etc.)
10. Define end game (win/lose)
11. Reset game
=======
- Define Pokemon Class - this will need to include a class method to generate the html for that card element
- Create class instances (objects) of each pokemon selected by the random api calls
- Create front and back of card
- Place the cards face down on the table
- Define the game loop & event listeners
- Define player actions
- Define game logic (match/no match)
- Define end game (win/lose)
- Reset game
>>>>>>> 9a3d2c16b34bab9fd68ae890653ea99acde4e1b1
