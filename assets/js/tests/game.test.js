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