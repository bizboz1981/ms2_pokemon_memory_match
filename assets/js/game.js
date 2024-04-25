const pokeBaseURL = 'https://pokeapi.co/api/v2/pokemon/';
const game = document.getElementById('game');
const btn = document.getElementById('btn');
const randID = () => {
    return Math.ceil(Math.random() * 100);
}

const displayResourceTest = () => {
    btn.addEventListener('click', () => {
        console.log('function executing');
        game.innerText = `Text rendering: ${randID()}`;
    });
};

displayResourceTest();