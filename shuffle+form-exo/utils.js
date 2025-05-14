export const shuffleArray = (array) => {
    try {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error("Veuillez envoyer un tableau rempli en paramètre");
        }

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // swap in-place
        }

        return array; // optionnel, car c’est le même objet
    } catch (err) {
        console.error("Erreur lors du mélange du tableau : ", err.message);
    }
};