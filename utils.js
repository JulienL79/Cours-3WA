import { promises as fsAsync } from 'fs';

// === Fonctions ===

export const readFile = async (filePath) => {
    try {
        const content = await fsAsync.readFile(filePath, 'utf-8')
        const data = JSON.parse(content)

        return data
    } catch (err) {
        console.error('Erreur de lecture: ', err.message)
    }
}

export const writeFile = async (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2)
        await fsAsync.writeFile(filePath, jsonData, 'utf-8');
        console.log('Fichier mis à jour avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'écriture :', err.message);
    }
};

export const fetchNames = (students) => {
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

export const fetchStudent = (students, name) => {
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

export const findStudentAverageMarkUpTo = (students, mark) => {
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

export const addMarkToStudent = (students, name, mark) => {
    try {

        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(isNaN(mark)) {
            throw new Error('Note saisie au format incorrect')
        }

        const updatedStudents = students.map(student => {
            if(student.name === name) {
                
                return {
                    ...student,
                    notes: [...(student.notes || []), mark]
                }
            }
            return student
        })
        console.log("Note correctement ajoutée")
        return updatedStudents

    } catch(err) {
        console.error("Erreur lors de l'ajout de la note: ", err.message)
    }
}