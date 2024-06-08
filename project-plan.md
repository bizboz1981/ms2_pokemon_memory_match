## Workflow

✅ Tested and working
🔸 Partially Implemented
🛑 Not yet implemented
💀 Feature abandoned

1. Make connection to Poke API ✅
2. Randomly select specified number of pokemon (n=8 for a 4x4 grid; n=12 for 4x6 etc) ✅

-   this function should return a promise with selected number of pokemon and their attributes in json format ✅
-   print to innerHTML of 'game' div to check ✅

3. Extract relevant data (type, name and sprite) from random pokemon fetched in step ✅
4. Define Pokemon Class - this will need to include a class method to generate the html for that card element 💀
5. Create class instances (objects) of each pokemon selected by the random api calls and map them to the cards 💀
6. create front and back of cards ✅
7. Place the cards face down on the table ✅
8. Define game logic and features (match/no match, increment score, leaderboard etc.)\

-   Flip cards✅
    -   add 'flipped' class to card on click ✅
    -   hide back and show front of card✅
    -   increment counter by 1✅
    -   when counter == 2, invoke compareCards function, reset counter to 0✅
-   check cards:
    -   compare custom data types (name of pokemon) on cards with 'flipped' class✅
    -   if the same, do not turn back over✅
    -   increment score by 1✅
    -   check if all cards are flipped✅

9.  Add turn counter ✅
10. Add leaderboard 🔸
11. Add timer ✅
12. add option for player to choose number of pairs (between 4 & 12)? ✅
13. different levels? 💀
14. Define end game (win/lose) ✅
15. Reset game ✅
16. New branch to attempt implementation of OOP / Pokemon class 💀
17. Style the game & make responsive ✅
18. 'You Won' animation 💀
19. Pokemon name and type ✅
20. improve responsiveness (add breakpoints) ✅
21. How to play gif 💀
22. reset high scores button 💀
23. readme ✅
24. prevent 3 cards being turned at once ✅