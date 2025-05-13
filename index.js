import { fetchNames, fetchStudent, readFile, writeFile, findStudentAverageMarkUpTo, addMarkToStudent } from './utils.js'
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "student.json")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// === Interface CLI ===

const showMenu = () => {
    console.log('\n=== MENU ===');
    console.log('1. Afficher tous les noms');
    console.log('2. Rechercher un élève par nom');
    console.log('3. Afficher les élèves ayant une moyenne supérieure à une note');
    console.log('4. Ajouter une note à un élève');
    console.log('5. Quitter');

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
            rl.question("Note minimale (ex: 12) : ", (mark) => {
                findStudentAverageMarkUpTo(studentsData, parseFloat(mark));
                showMenu();
            });
            break;

        case '4':
            rl.question("Elève recherché: ", (name) => {
                const students = fetchStudent(studentsData, name);
                if(students.length < 1 ) {
                    showMenu();
                } else if (students.length === 1) {
                    rl.question(`Note à ajouter à ${students[0].name}: `, (mark) => {
                        studentsData = addMarkToStudent(studentsData, students[0].name, mark)
                        writeFile(filePath, studentsData)
                    })
                    showMenu();
                } else {
                    rl.question(`Quel élève choisissez-vous? (ex: 1)`, (index) => {
                        if (isNaN(index) || index < 0 || index >= students.length) {
                        console.log("Choix invalide.");
                        return showMenu();
                        }

                        rl.question(`Note à ajouter à ${students[index].name}: `, (mark) => {
                            studentsData = addMarkToStudent(studentsData, students[index].name, mark)
                            writeFile(filePath, studentsData)
                            showMenu();
                        })
                    })
                }
            });
            break;

        case '5':
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