import readline from 'node:readline';
import { playGame } from './utils.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// === Interface CLI ===

const showMenu = () => {
    console.log('\n=== MENU ===');
    console.log('1. Lancement du Chifumi');
    console.log('2. Quitter');

    rl.question('\nVotre choix : ', handleChoice);
};

let gameResult = {
    firstPlayerWIn: 0,
    secondPlayerWin: 0
}

const handleChoice = (choice) => {
    switch (choice.trim()) {
        case '1':
            rl.question("Nombre de manches maximum: ", (maxSet) => {
                gameResult = playGame(maxSet)
                console.log("Prêt pour une autre partie?")
                showMenu();
            })
            break

        case '2':
            console.log('Au revoir!')
            rl.close()
            process.exit(0)
            break;

        default:
            console.log("Choix invalide.");
            showMenu();
    }
};

// === Démarrage ===

showMenu()