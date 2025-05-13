import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config()

const MENTION_10TO12=process.env.MENTION_10TO12
const MENTION_12TO14=process.env.MENTION_12TO14
const MENTION_14TO16=process.env.MENTION_14TO16
const MENTION_16TO20=process.env.MENTION_16TO20

// === Fonctions ===

export const readFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)

        return data
    } catch (err) {
        console.error('Erreur de lecture: ', err.message)
    }
}

export const writeFile = (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2)
        fs.writeFileSync(filePath, jsonData, 'utf-8');
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

export const giveMention = (students) => {
    try {
        const updatedStudents = students.map(student => {
            const average = student.notes.reduce((sum, note) => sum + note, 0) / student.notes.length;
            if(average < 10) {
                return student
            } else if (average < 20) {
                return {
                    ...student,
                    mention: 
                        average < 12 ? 
                            MENTION_10TO12
                        : average < 14 ?
                            MENTION_12TO14
                            : average < 16 ?
                                MENTION_14TO16
                                :
                                    MENTION_16TO20
                }
            } else {
                throw new Error (`Erreur moyenne supérieur à 20 pour ${student.name}`)
            }
        })
        console.table(updatedStudents)
        return updatedStudents

    } catch (err) {
        console.error("Erreur lors de l'affectation des mentions: ", err.message)
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
        console.log(`La note de ${mark} a correctement été ajoutée`)
        return updatedStudents

    } catch(err) {
        console.error("Erreur lors de l'ajout de la note: ", err.message)
    }
}