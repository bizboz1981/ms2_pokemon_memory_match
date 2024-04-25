const pokeBaseURL = 'https://pokeapi.co/api/v2/pokemon/';
const game = document.getElementById('game');
const btn = document.getElementById('btn');

/** there are over 1000 pokemon in the database */
const randNum = () => {
    return Math.ceil(Math.random() * 1000);
}

/** test ability to display random number on html page */
const testButton = () => {
    btn.addEventListener('click', () => {
        console.log('function executing');
        loadPokemon(8).then(results => {
            game.innerText = JSON.stringify(results);
        });    
    });
};
testButton();

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