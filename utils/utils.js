import fs from 'node:fs';

export const readFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8')

        // Si c’est un fichier JSON, on parse
        if (filePath.endsWith('.json')) {
            return JSON.parse(content)
        }

        // Sinon, on retourne le contenu brut (texte, CSS, HTML…)
        return content
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

export const fetchStudent = (students, id) => {
    try {

        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(!id || isNaN(id)) {
            throw new Error('ID incorrect')
        }

        const result = students.find(student => student.id === id)

        if (!result || result.length < 1) {
            throw new Error('Cet id ne correspond à aucun élève')
        }

        return result

    } catch (err) {
        console.error("Erreur lors de la recherche de student: ", err.message)
        return null
    }
}

export const addStudent = (students, newStudent) => {
     try {

        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(!newStudent || !newStudent.name || !newStudent.birth ) {
            throw new Error('Tous les champs doivent être complétés')
        }

        const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1

        const updatedStudents = [...students, {id: newId, name: newStudent.name, birth: newStudent.birth}]

        return updatedStudents

    } catch (err) {
        console.error("Erreur lors de l'ajout d'un student: ", err.message)
        return students
    }
}

export const updateStudent = (students, updatedStudent) => {
    try {

        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(!updatedStudent || !updatedStudent.id || !updatedStudent.name || !updatedStudent.birth) {
            throw new Error('Tous les champs doivent être complétés')
        }

        const updatedStudents = students.map(student => 
            student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student
        )

        return updatedStudents

    } catch (err) {
        console.error("Erreur lors de la modification du student: ", err.message)
        return students
    }
}

export const deleteStudent = (students, id) => {
    try {

        if(!Array.isArray(students)) {
            throw new Error('Liste des élèves incorrecte')
        }

        if(isNaN(id) ) {
            throw new Error('ID incorrect')
        }

        const updatedStudents = students.filter(student => student.id !== Number(id))

        return updatedStudents

    } catch (err) {
        console.error("Erreur lors de la suppression du student: ", err.message)
        return students
    }
}