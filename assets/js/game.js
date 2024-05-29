// Backup module
import { backupPokemon } from "./backupPokemon.js";

// Constants
const pokeBaseURL = "https://pokeapi.co/api/v2/pokemon/";
const backImgLink =
"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/00749e58-41ca-4e6e-add6-55da22501c91/dexc4ag-47c47f39-89a4-477e-919c-f13d72286a64.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAwNzQ5ZTU4LTQxY2EtNGU2ZS1hZGQ2LTU1ZGEyMjUwMWM5MVwvZGV4YzRhZy00N2M0N2YzOS04OWE0LTQ3N2UtOTE5Yy1mMTNkNzIyODZhNjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OHUH-qup0p6ki77yTrbOcet5UrnBXLDSZ67SoahcC8Q";

// DOM elements
const game = document.getElementById("game");
const btnPlay = document.getElementById("btn-play");
const btnNewGame = document.getElementById("btn-new-game");
const gameOptions = document.getElementById("game-options");
const btnHighScores = document.getElementById("btn-high-scores");
const btnHowToPlay = document.getElementById("btn-how-to-play");
const btnBack = document.getElementById("btn-back");
const mainMenu = document.getElementById("main-menu");
const howToPlay = document.getElementById("how-to-play");
const scoreElement = document.getElementById("score");
const dropdown = document.getElementById("dropdown");
const youWin = document.getElementById("you-win");

// Global Variables
let numberOfPairs = parseInt(dropdown.value);
let flippedCards = 0;
let matchedPairs = 0;
let score = 0;
let turns = 0;
let clicks = 0;
let intervalId;
let totalSec = 0;

// Navigation Functions
const showGameOptions = () => {
    mainMenu.style.display = "none";
    gameOptions.classList.remove("hidden");
};

const showHowToPlay = () => {
    mainMenu.style.display = "none";
    howToPlay.classList.remove("hidden");
    howToPlay.style.display = "flex";
};

const showMainMenu = () => {
    mainMenu.style.display = "flex";
    gameOptions.classList.add("hidden");
    howToPlay.classList.add("hidden");
    highScoreDiv.classList.add("hidden");
};

// Helper Functions

// Generate random number between 1 and 1025 (the number of Pokemon in the database)
const randNum = () => {
    return Math.ceil(Math.random() * 1025);
};

// Shuffle array according to Durstenfeld algorithm
const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};

 // Set the grid dimensions based on the number of pairs
const setGridDimensions = () => {
    let numberOfColumns;
    let numberOfRows;
    switch (numberOfPairs) {
        case 4:
            numberOfColumns = 4;
            numberOfRows = 2;
            break;
        case 6:
            numberOfColumns = 4;
            numberOfRows = 3;
            break;
        case 8:
            numberOfColumns = 4;
            numberOfRows = 4;
            break;
        case 10:
            numberOfColumns = 5;
            numberOfRows = 4;
            break;
        case 12:
            numberOfColumns = 6;
            numberOfRows = 4;
            break;
        default:
            numberOfColumns = 6;
            numberOfRows = 4;
            break;
    }

    // set number of columns & rows
    game.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
    game.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
};

// Increment turns counter on UI
const incrementTurns = () => {
    let numTurns = document.getElementById("turns");
    numTurns.innerText = turns;
};
/**
 * Some Pokemon have very long names that overflow the edges of the card
 * This function decrements the text size of long names until the text fits on the card
 */
const resizeText = (text) => {
    let card = document.getElementsByClassName("card")[0];
    if (!card) {
        return;
    }
    let cardSize = document.getElementsByClassName("card")[0].offsetWidth;
    let fontSize = parseInt(window.getComputedStyle(text).fontSize);
    while (text.offsetWidth > cardSize) {
        fontSize--;
        text.style.fontSize = `${fontSize}px`;
        text.style.bottom = "3px";
    }
};

// Game start and end

// Start a new game by hiding any visible divs, resetting stats and displaying cards
const newGame = () => {
    game.innerHTML = "";
    game.classList.remove("hidden");
    gameOptions.classList.add("hidden");
    displayCards(numberOfPairs);
    resetGlobalVariables();
    resetGameStatsUI();
    setGridDimensions();
};

// When all pairs are matched, show cards for 2 seconds, show 'You Win' for 2 seconds, then show high scores
const endGame = () => {
    setTimeout(() => {
        game.classList.add("hidden");
        youWin.classList.remove("hidden");
        setTimeout(() => {
            youWin.classList.add("hidden");
            calculateScore();
            saveHighScores(score);
            showHighScore();
        },2000);    
    }, 2000);
};

// Reset global variables to prepare for new game
const resetGlobalVariables = () => {
    clearInterval(intervalId);
    clicks = 0;
    turns = 0;
    matchedPairs = 0;
    totalSec = 0;
    score = 0;
    intervalId = null;
};

// Reset UI stats ready for new game
const resetGameStatsUI = () => {
    document.getElementById("turns").innerHTML = "0";
    document.getElementById("timer").innerHTML = "00:00";
    document.getElementById("score").innerHTML = "0";
    let highScoreDiv = document.getElementById("high-scores");
    highScoreDiv.innerHTML = "";
}

// Core Game Functions and Logic

/** 
 * Asynchronously load the required number of Pokemon
 * Returns an array parsed to json format
 * If api fails (returns non-200 range response) backup Pokemon get loaded instead
 * Inspired by https://github.com/jamesqquick/javascript-memory-match/blob/master/app.js
 */
const loadPokemon = async (numberOfPairs) => {
    try {
        // Use Set to ensure no duplicates
        const randIds = new Set(); 
        while (randIds.size < numberOfPairs) { // Exit loop when length == numberOfPairs
            randIds.add(randNum());
        }
        // Spread the randIds set into an array which supports .map
        // For each id in the array, fetch a promise from the base URL with random id appended
        // Returns an array of promises
        const pokePromises = [...randIds].map((id) => fetch(pokeBaseURL + id)); 
        // returns a single promise that resolves when all pokePromises have resolved
        const results = await Promise.all(pokePromises); 
        // checks each response and throws an error if non-200 range
        for (let result of results) {
            if (!result.ok) {
                throw new Error("Pokemon failed with error");
            }
        }
        // Returns an array of Pokemon, used by createCard() to create the cards
        return await Promise.all(results.map((res) => res.json()));
    } catch {
        return backupPokemon.slice(0, numberOfPairs);
    }
};

/** 
 * Create a parent card div with 'front' and 'back' children
 * This won't display cards, it just gives the displayCards function the data/objects it needs
 */
const createCard = (pokemon) => {
    // create parent card div as well as front and back children
    const card = document.createElement("div");
    const cardInner = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");

    // add class attributes to card divs
    card.classList.add("card");
    cardInner.classList.add("card-inner");
    cardFront.classList.add("card-front");
    cardBack.classList.add("card-back");

    // add sprite image to front
    let spriteImage = document.createElement("img");
    spriteImage.src = pokemon.sprites.front_default;
    cardFront.appendChild(spriteImage);

    // add pokemon name to card
    let pokeName = document.createElement("h6");
    pokeName.innerHTML = pokemon.name;
    cardFront.appendChild(pokeName);

    // add static image to back
    const backImage = document.createElement("img");
    backImage.src = backImgLink;
    cardBack.appendChild(backImage);

    // add unique id for card div
    card.setAttribute("data-pokemon", pokemon.name);
    card.setAttribute("data-pokemon-type", pokemon.types[0].type.name);

    //set structure
    card.appendChild(cardInner);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    // return the completed card
    return card;
};

/** 
 * This function will display the cards face down on the html
 * ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */

const displayCards = async (numberOfPairs) => {
    // create empty array to hold cards
    const cardDeck = [];
    // create an array of pokemon by calling loadPokemon (with the argument set globally as numberOfPairs)
    let pokemons = await loadPokemon(numberOfPairs);
    // call createCard on each element if the array returned by loadPokemon and push to array twice
    pokemons.forEach((pokemon) => {
        cardDeck.push(createCard(pokemon));
        cardDeck.push(createCard(pokemon));
    });
    // shuffle
    const shuffledDeck = shuffleArray(cardDeck);
    // append to game div
    shuffledDeck.forEach((card) => {
        game.appendChild(card);
        card.addEventListener("click", flipCard);

        let pokeName = card.querySelector("h6");
        resizeText(pokeName);
    });
};

/**
 * This function checks for cards that are already 'flipped' or 'paired' and ignores clicks
 * If not already paired or flipped, it adds the 'flipped' css class, which triggers the flip animation
 */
function flipCard() {
    // Check if already flipped or paired; if so, ignore clicks...
    if (
        this.classList.contains("flipped") ||
        this.classList.contains("paired")
    ) {
        return;
    }
    // ... Otherwise, add class 'flipped to trigger animation and increment vars
    this.classList.add("flipped");
    clicks++;
    flippedCards++;
    // When 2 cards are turned over, check if they match
    if (flippedCards == 2) {
        checkCards();
        turns++;
        incrementTurns();
    }
    // If this is the first card clicked, start the game timer
    if (clicks === 1) {
        timer();
    }
}

/** 
 * Core logic for checking cards and invoking endGame when all pairs are matched
 */
const checkCards = () => {
    // Push flipped card ids to an empty array
    let cardIds = [];
    const flippedToCheck = document.querySelectorAll(".flipped");
    flippedToCheck.forEach(function (card) {
        cardIds.push(card.dataset.pokemon);
    });

    // If cards have the same id, they match, so add 'paired' class to keep them flipped...
    if (cardIds[0] === cardIds[1]) {
        matchedPairs++;
        document.getElementById("score").innerHTML = score;
        flippedCards = 0;
        flippedToCheck.forEach(function (card) {
            card.classList.add("paired");
            card.classList.remove("flipped");
        });
    // ... Else turn back over
    } else {
        cardIds = [];
        setTimeout(() => {
            flippedToCheck.forEach(function (card) {
                card.classList.remove("flipped");
            });
        }, 1000);
        flippedCards = 0;
    }

    // If all pairs matched, end game
    if (matchedPairs === numberOfPairs) {
        clearInterval(intervalId);
        endGame();
    }
};

// create timer and increment in seconds
function timer() {
    let min = 0;
    let sec = 0;
    let timeDiv = document.getElementById("timer");
    intervalId = setInterval(function () {
        if (totalSec < 60) {
            min = "00";
            sec = String(totalSec).padStart(2, "0");
        } else {
            min = String(Math.floor(totalSec / 60)).padStart(2, "0");
            sec = String(totalSec % 60).padStart(2, "0");
        }
        timeDiv.innerHTML = `${min}:${sec}`;
        totalSec++;
    }, 1000);
}

/**
 * Score is calculated by taking the percentage of correct guesses plus bonus time points
 * Score is written to the UI
 */
const calculateScore = () => {
    let percCorrect = Math.floor(numberOfPairs / turns) * 100;
    let bonusTimePts = (numberOfPairs * 10 - totalSec) * 10;
    score = percCorrect + bonusTimePts;
    scoreElement.innerText = score.toString();
};

// If highscores exist in local storage, get them, otherwise create empty object
const getHighScoresLocal = () => {
    return JSON.parse(localStorage.getItem("highScores")) || [];
}

// save highscores to local storage
const saveHighScores = (score) => {
    let highScores = getHighScoresLocal(); // retrieve high score array
    highScores.push(score); // push score to the array
    highScores.sort((a, b) => b - a); // sort numerically
    highScores = highScores.slice(0, 5); // get top 5 scores
    localStorage.setItem("highScores", JSON.stringify(highScores)); // push array to local storage
};

/**
 * Display list of highscores retrieved from local storage
 * Append scores iteratively to html string, along with h2 and button (this prevents open tags being automatically closed)
 * finally set innerHTML equal to html string and add functionality to button
 */
const showHighScore = () => {
    game.classList.add("hidden");
    let highScores = getHighScoresLocal();
    // show the high score div and clear any existing innerHTML
    let highScoreDiv = document.getElementById("high-scores");
    highScoreDiv.classList.remove("hidden");
    highScoreDiv.innerHTML = "";
    // iteratively create html content as 'html' var
    let html = "<h2>High Scores</h2><ol>";
    for (let i = 0; i < highScores.length; i++) {
        html += `<li>${highScores[i]}</li>`;
    }
    html += `</ol><button id="btn-back-1" class="btn">Back</button>`;
    // Set inner html to completed 'html' string
    highScoreDiv.innerHTML = html;
    highScoreDiv.style.display = "block";
    // add functionality to 'back' button
    let btnBack = document.getElementById("btn-back-1");
    btnBack.addEventListener("click", function () {
        highScoreDiv.classList.add("hidden");
        mainMenu.style.display = "flex";
    });
};

// Add Event Listeners
btnPlay.addEventListener("click", newGame);
btnNewGame.addEventListener("click", showGameOptions);
btnHowToPlay.addEventListener("click", showHowToPlay);
btnBack.addEventListener("click", showMainMenu);
dropdown.addEventListener("change", function () {
    numberOfPairs = parseInt(this.value);
});
// attach event listener to high scores button and call showHighScore function after function declared
btnHighScores.addEventListener("click", function () {
    mainMenu.style.display = "none";
    showHighScore();
});
