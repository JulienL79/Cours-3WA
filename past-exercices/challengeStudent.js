const fsAsync = require('fs').promises
const path = require("node:path")
const filePath = path.join(__dirname, "data", "student.json")
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// === Fonctions ===

const readFile = async (filePath) => {
    try {
        const content = await fsAsync.readFile(filePath, 'utf-8')
        const data = JSON.parse(content)

        return data
    } catch (err) {
        console.error('Erreur de lecture: ', err.message)
    }
}

const fetchNames = (students) => {
    try {
        const nameList = students.map(student => student.name).sort((a, b) => a.localeCompare(b))
        console.group(`Liste des noms: `)
        console.table(nameList)
        console.groupEnd()
        return nameList
    } catch(err) {
        console.error("Erreur lors de la récupération des noms: ", err.message)
    }
}

const fetchStudent = (students, name) => {
    try {
        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(!name || typeof name !== 'string') {
            throw new Error('Nom incorrect')
        }

        const results = students.filter(student => student.name.toLowerCase().includes(name.toLocaleLowerCase()))

        if (!results || results.length < 1) {
            throw new Error('Ce nom ne correspond à aucun élève')
        }

        console.group(`Elèves dont le nom contient: ${name} : `)
        console.table(results)
        console.groupEnd()
        return results

    } catch (err) {
        console.error("Erreur lors de la recherche de student: ", err.message)
    }
}

const findStudentAverageMarkUpTo = (students, mark) => {
    try {
        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(isNaN(mark)) {
            throw new Error('Note saisie au format incorrect')
        }

        const goodStudents = students
            .map(student => {
                const average = student.notes.reduce((sum, note) => sum + note, 0) / student.notes.length;
                return { ...student, average };
            })
            .filter(student => student.average > mark);

        console.group(`Liste des élèves filtrés par la moyenne de ${mark}`)
        console.table(goodStudents)
        console.groupEnd()
        return goodStudents

    } catch(err) {
        console.error("Erreur lors du filtre des étudiants: ", err.message)
    }
}

// === Interface CLI ===

const showMenu = () => {
    console.log('\n=== MENU ===');
    console.log('1. Afficher tous les noms');
    console.log('2. Rechercher un élève par nom');
    console.log('3. Afficher les élèves ayant une moyenne supérieure à une note');
    console.log('4. Quitter');

    rl.question('\nVotre choix : ', handleChoice);
};

let studentsData = [];

const handleChoice = (choice) => {
    switch (choice.trim()) {
        case '1':
            fetchNames(studentsData);
            return showMenu();

        case '2':
            rl.question("Entrez une partie du nom à rechercher : ", (input) => {
                fetchStudent(studentsData, input);
                showMenu();
            });
            break;

        case '3':
            rl.question("Note minimale (ex: 12) : ", (note) => {
                findStudentAverageMarkUpTo(studentsData, parseFloat(note));
                showMenu();
            });
            break;

        case '4':
            console.log("Au revoir !");
            rl.close();
            process.exit(0);
            break;

        default:
            console.log("Choix invalide.");
            showMenu();
    }
};

// === Démarrage ===

const mainScript = async () => {
    studentsData = await readFile(filePath);
    showMenu();
};

mainScript();