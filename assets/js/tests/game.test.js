/** test ability to display random number on html page */
const testApiText = () => {
    btn.addEventListener('click', () => {
        console.log('function executing');
        loadPokemon(8).then(results => {
            game.innerText = JSON.stringify(results);
        });    
    });
};
testApiText();

// test with sample pikachu data
const pikachu = {
    name: 'Pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    type: 'Electric'
}
const testPikachu = () => {
    btn.addEventListener('click', () => {
        const testCard = createCard(loadPokemon(1));
        game.appendChild(testCard)  
    });
};
testPikachu();

// test live api
const testPokeApi = async () => {
    const pokemons = await loadPokemon(1);
    const testCard = createCard(pokemons[0]);
    game.appendChild(testCard);
}

/** run tests */
btn.addEventListener('click', testPokeApi);

testPokeApi();