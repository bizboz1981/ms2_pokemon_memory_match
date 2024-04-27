const pokeBaseURL = 'https://pokeapi.co/api/v2/pokemon/';
const game = document.getElementById('game');
const btn = document.getElementById('btn');

/** there are over 1000 pokemon in the database */
const randNum = () => {
    return Math.ceil(Math.random() * 1000);
}

/** test ability to display random number on html page */

const pikachu = {
    name: 'Pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    type: 'Electric'
}
const testButton = () => {
    btn.addEventListener('click', () => {
        const testCard = createCard(pikachu);
        game.appendChild(testCard)  
    });
};
testButton();

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
    const front = document.createElement('dv');
    const back = document.createElement('div');

    // add class attributes to card divs
    card.classList.add('card');
    front.classList.add('front');
    back.classList.add('back');

    //set structure
    card.appendChild(back);
    card.appendChild(front);

    // return the completed card
    return card
}

// test to check that card renders on html
// test pokemon



