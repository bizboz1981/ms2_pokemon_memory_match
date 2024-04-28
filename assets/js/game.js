const pokeBaseURL = 'https://pokeapi.co/api/v2/pokemon/';
const game = document.getElementById('game');
const btn = document.getElementById('btn');
let numberOfPairs = 8;

/** there are over 1000 pokemon in the database */
const randNum = () => {
    return Math.ceil(Math.random() * 1000);
}



/** Define Pokemon Class */
class Pokemon {
    constructor(name, sprite, type) {
        this.name = name;
        this.sprite = sprite;
        this.type = type;
    }
    // method to create card to go here?
}

/** This function performs an asynchronous loading of required number of pokemon 
 * We use async so that all pokemon are returned at the same time without pausing the rest of the code
 * Must return an array of pokemon data in json format
 * Inspired by https://github.com/jamesqquick/javascript-memory-match/blob/master/app.js
*/
const loadPokemon = async (numPairs) => {
    const randIds = new Set(); // Sets cannot contain duplicate values, so will be guarantee unique pokemon
    while(randIds.size < numPairs){ // Not 'numPairs + 1' - we want this loop to exit when length = numPairs, not run again as then we'd have 1 too many
        randIds.add(randNum())
    }
    const pokePromises = [...randIds].map(id => fetch(pokeBaseURL + id)); // Spread the randIds set into an array which supports .map. For each id in the array, fetch a promise from the base URL with random id appended. Returns an array of promises
    const results = await Promise.all(pokePromises); // returns a single promise that resolves when all pokePromises have resolved; returns an array
    return await Promise.all(results.map(res => res.json()));
}

/** Create a parent card div with 'front' and 'back' children
 *  This won't display cards, it just gives the displayCards function the data/objects it needs
 */
const createCard = (pokemon) => {
    // create parent card div as well as front and back children
    const card = document.createElement('div');
    const cardInner = document.createElement('div')
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');

    // add class attributes to card divs
    card.classList.add('card');
    cardInner.classList.add('card-inner')
    cardFront.classList.add('card-front');
    cardBack.classList.add('card-back');

    // add sprite image to front
    let spriteImage = document.createElement('img');
    spriteImage.src = pokemon.sprites.front_default;
    cardFront.appendChild(spriteImage);

    // add static image to back
    const backImage = document.createElement('img');
    backImage.src = 'https://github.com/PokeAPI/sprites/blob/master/sprites/badges/1.png?raw=true';
    cardBack.appendChild(backImage);

    // add unique id for card div
    card.setAttribute('data-pokemon', pokemon.name);

    //set structure
    card.appendChild(cardInner)
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);

    // return the completed card
    return card
}

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
}

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
        card.addEventListener('click', flipCard);
    });
    // handle visibility and flipping animation with css
}

const flipCard = (card) => {
    this.card.classList.add('flipped')
}

// displayCards();
btn.addEventListener('click', displayCards);

