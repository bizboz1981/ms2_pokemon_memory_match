const pokeBaseURL = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById("game");
const btn = document.getElementById("btn");
const scoreElement = document.getElementById("score");
let flippedCards = 0;
let numberOfPairs = 8;
let matchedPairs = 0;
let score = 0;
let turns = 0;
let clicks = 0;
let intervalId;
let totalSec = 0;

/** there are over 1000 pokemon in the database */
const randNum = () => {
    return Math.ceil(Math.random() * 1000);
};

/** This function performs an asynchronous loading of required number of pokemon
 * We use async so that all pokemon are returned at the same time without pausing the rest of the code
 * Must return an array of pokemon data in json format
 * Inspired by https://github.com/jamesqquick/javascript-memory-match/blob/master/app.js
 */
const loadPokemon = async (numPairs) => {
    const randIds = new Set(); // Sets cannot contain duplicate values, so will be guarantee unique pokemon
    while (randIds.size < numPairs) {
        // Not 'numPairs + 1' - we want this loop to exit when length = numPairs, not run again as then we'd have 1 too many
        randIds.add(randNum());
    }
    const pokePromises = [...randIds].map((id) => fetch(pokeBaseURL + id)); // Spread the randIds set into an array which supports .map. For each id in the array, fetch a promise from the base URL with random id appended. Returns an array of promises
    const results = await Promise.all(pokePromises); // returns a single promise that resolves when all pokePromises have resolved; returns an array
    return await Promise.all(results.map((res) => res.json()));
};

/** Create a parent card div with 'front' and 'back' children
 *  This won't display cards, it just gives the displayCards function the data/objects it needs
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
    backImage.src =
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/00749e58-41ca-4e6e-add6-55da22501c91/dexc4ag-47c47f39-89a4-477e-919c-f13d72286a64.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAwNzQ5ZTU4LTQxY2EtNGU2ZS1hZGQ2LTU1ZGEyMjUwMWM5MVwvZGV4YzRhZy00N2M0N2YzOS04OWE0LTQ3N2UtOTE5Yy1mMTNkNzIyODZhNjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OHUH-qup0p6ki77yTrbOcet5UrnBXLDSZ67SoahcC8Q";
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

/** This function will display the cards face down on the html
 * ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */

const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};

const displayCards = async () => {
    // create empty array to hold cards
    let cardDeck = [];
    // create an array of pokemon by calling loadPokemon (with the argument set globally as numberOfPairs)
    let pokemons = await loadPokemon(8);
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
    // handle visibility and flipping animation with css
};

function flipCard() {
    if (
        this.classList.contains("flipped") ||
        this.classList.contains("paired")
    ) {
        return;
    }

    this.classList.add("flipped");
    clicks++;
    flippedCards++;
    if (flippedCards == 2) {
        checkCards();
        turns++;
        incrementTurns();
    }

    if (clicks === 1) {
        timer();
    }
}

const incrementTurns = () => {
    numTurns = document.getElementById("turns");
    numTurns.innerText = turns;
};

/** Game logic */

const checkCards = () => {
    let cardIds = [];
    const flippedToCheck = document.querySelectorAll(".flipped");
    flippedToCheck.forEach(function (card) {
        cardIds.push(card.dataset.pokemon);
    });

    if (cardIds[0] === cardIds[1]) {
        matchedPairs++;
        document.getElementById("score").innerHTML = score;
        flippedCards = 0;
        flippedToCheck.forEach(function (card) {
            card.classList.add("paired");
            card.classList.remove("flipped");
        });
    } else {
        cardIds = [];
        setTimeout(() => {
            flippedToCheck.forEach(function (card) {
                card.classList.remove("flipped");
            });
        }, 1000);
        flippedCards = 0;
    }
    if (matchedPairs === numberOfPairs) {
        clearInterval(intervalId);
        calculateScore();
        endGame();
        showHighScore();
    }
};

const endGame = () => {
    setTimeout(() => {
        game.innerHTML = "You Win!!";
        game.classList.add("celebrate");
    }, 2000);
};

// displayCards() for testing purposes;
btn.addEventListener("click", () => {
    game.innerHTML = "";
    displayCards();
    resetGameStats();
});

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

// resize nanes of pokemon that are wider than card
const resizeText = (text) => {
    let card = document.getElementsByClassName("card")[0];
    if (!card) {
        console.log("no card class found");
        return;
    }
    let cardSize = document.getElementsByClassName("card")[0].offsetWidth;
    let fontSize = parseInt(window.getComputedStyle(text).fontSize);
    while (text.offsetWidth > cardSize) {
        fontSize--;
        text.style.fontSize = `${fontSize}px`;
    }
};

// calculate score
// % correct guesses = numPairs/numTurns * 100
// bonus time points = (300 - totalSec) * 10
const calculateScore = () => {
    percCorrect = Math.floor(numberOfPairs / turns) * 100;
    bonusTimePts = (300 - totalSec) * 10;
    score = percCorrect + bonusTimePts;
    scoreElement.innerText = score.toString();
};

// scoreboard
// create array to hold high scores
// sort array
// clear game div
// create list elements from array
// set inner html of high-scores div to list
const showHighScore = () => {
    game.innerHTML = "";
    let highScores = [];
    let highScoreDiv = document.getElementById("high-scores");
    highScores.push(score);
    highScores.sort();
    for (i = 0; i < 5; i++) {
        highScoreDiv.innerHTML += `<li>${highScores[i]}</li>`;
    }
};

const resetGameStats = () => {
    turns = 0;
    document.getElementById("turns").innerHTML = "0";
    totalSec = 0;
    document.getElementById("timer").innerHTML = "00:00";
    document.getElementById("score").innerHTML = "0";
    hide("high-scores");
};
