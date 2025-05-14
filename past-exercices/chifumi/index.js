import readline from 'node:readline'
import { playGame } from './utils.js'
import { groupEnd } from 'node:console'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// === Interface CLI ===

const showMenu = () => {
    console.log('\n=== MENU ===')
    console.log('1. Lancement du Chifumi')
    console.log("2. Afficher l'historique")
    console.log("3. Reset l'historique")
    console.log('4. Quitter')

    rl.question('\nVotre choix : ', handleChoice)
};

const gameResults = []

const handleChoice = (choice) => {
    switch (choice.trim()) {
        case '1':
            rl.question("Nombre de manches maximum: ", (maxSet) => {
                const result = playGame(maxSet)

                if(result) {
                    gameResults.push(result)
                    console.log("Prêt pour une autre partie?")
                }
                
                showMenu();
            })
            break

        case '2':

            if (gameResults.length < 1) {
                console.log("Aucune partie en mémoire")
            } else {
                console.group("Historique des parties: ")
                console.table(gameResults)
                console.groupEnd()
            }

            showMenu()
            break
        
        case '3':
            gameResults.splice(0, gameResults.length)
            console.log("Historique remis à zéro")
            showMenu()
            break

        case '4':
            console.log('Au revoir!')
            rl.close()
            process.exit(0)
            break;

        default:
            console.log("Choix invalide.")
            showMenu()
    }
};

// === Démarrage ===

showMenu()