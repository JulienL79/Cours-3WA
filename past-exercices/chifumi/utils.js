import dotenv from 'dotenv'

dotenv.config()

const CHOICE_1= process.env.CHOICE_1
const CHOICE_2= process.env.CHOICE_2
const CHOICE_3= process.env.CHOICE_3

const randomAction = () => {
    const action = Math.ceil(Math.random() * 3)
    return action === 1 ? CHOICE_1 : action === 2 ? CHOICE_2 : CHOICE_3
}

const playASet = () => {
    try {
        const firstPlayerChoice = randomAction()
        const secondPlayerChoice = randomAction()

        if(firstPlayerChoice === secondPlayerChoice) {
            return 0
        } else if(firstPlayerChoice === CHOICE_1 & secondPlayerChoice === CHOICE_2) {
            return 2
        } else if(firstPlayerChoice === CHOICE_1 & secondPlayerChoice === CHOICE_3) {
            return 1
        } else if(firstPlayerChoice === CHOICE_2 & secondPlayerChoice === CHOICE_1) {
            return 1
        } else if(firstPlayerChoice === CHOICE_2 & secondPlayerChoice === CHOICE_3) {
            return 2
        } else if(firstPlayerChoice === CHOICE_3 & secondPlayerChoice === CHOICE_1) {
            return 2
        } else if(firstPlayerChoice === CHOICE_3 & secondPlayerChoice === CHOICE_2) {
            return 1
        } else {
            throw new Error ('Choix invalide')
        }

    } catch (err) {
        console.error("Erreur dans le déroulement de la manche: ", err.message)
    }
}

export const playGame = (maxSet) => {
    try {
        if(isNaN(maxSet) || maxSet < 0) {
            throw new Error ("Veuillez saisir un nombre de manche correct")
        }

        let firstPlayerWin = 0
        let secondPlayerWin = 0

        while (firstPlayerWin < maxSet && secondPlayerWin < maxSet) {
            const setResult = playASet()
            if(setResult === 0) {
                continue
            } else if (setResult === 1) {
                firstPlayerWin++
            } else if (setResult === 2) {
                secondPlayerWin++
            }
        }

        console.log(`Le gagnant est le joueur ${firstPlayerWin == maxSet ? 1 : 2}`)
        console.log(`Victoire de ${firstPlayerWin == maxSet ? firstPlayerWin : secondPlayerWin} à ${firstPlayerWin == maxSet ? secondPlayerWin : firstPlayerWin}`)
        return {
            winner : `Joueur ${firstPlayerWin == maxSet ? 1 : 2}`,
            firstPlayerWin, 
            secondPlayerWin
        }
    } catch (err) {
        console.error("Erreur dans le déroulement de la partie: ", err.message)
    }
    
}