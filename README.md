# Pokemon Memory Match
## Workflow
- Make connection to Poke API
- Randomly select specified number of pokemon (n=8 for a 4x4 grid; n=12 for 4x6 etc)
  - this function should return a promise with selected number of pokemon and their attributes in json format
- Define Pokemon Class - this will need to include a class method to generate the html for that card element
- Create class instances (objects) of each pokemon selected by the random api calls
- Create front and back of card
- Place the cards face down on the table
- Define the game loop & event listeners
- Define player actions
- Define game logic (match/no match)
- Define end game (win/lose)
- Reset game
