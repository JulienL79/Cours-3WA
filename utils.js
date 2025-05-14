export const shuffleArray = (array) => {
    try {
        if(!Array.isArray(array) || !array) {
            throw new Error ("Veuillez envoyer un tableau rempli en paramètre")
        }

        let lastArray = [...array]
        let newArray = []

        while (lastArray.length > 0) {
            const randomIndex = Math.floor(Math.random() * lastArray.length)
            newArray.push(lastArray[randomIndex])
            lastArray.splice(randomIndex, 1)
            console.table(newArray)
            console.table(lastArray)
        }

        return newArray

    } catch (err) {
        console.error("Erreur de le mélange du tableau: ", err.message)
    }


}