const fsAsync = require('fs').promises
const path = require("node:path")
const filePath = path.join(__dirname, "data", "student.txt")

const readFile = async (filePath) => {
    try {
        const content = await fsAsync.readFile(filePath, 'utf-8')
        const data = await JSON.parse(content)

        return data
    } catch (err) {
        console.error('Erreur de lecture: ', err.message)
    }
}

const writeFile = async (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2)
        await fsAsync.writeFile(filePath, jsonData, 'utf-8');
        console.log('Fichier mis à jour avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'écriture :', err.message);
    }
};

const findStudentMarkUpTo = (students, mark) => {
    const goodStudents = students.filter(student => {
        const average = student.notes.reduce((sum, note) => sum + note, 0) / student.notes.length
        return average > mark
    })
    return goodStudents
}

const findBestNoteStudent = (students) => {
    let bestStudent = null;
    let bestNote = 0;

    for (const student of students) {
        const maxNote = Math.max(...student.notes);
        if (maxNote > bestNote) {
            bestNote = maxNote;
            bestStudent = student;
        }
    }

    return bestStudent;
};

const sortStudentsByName = (students) => {
    return students.slice().sort((a, b) => a.name.localeCompare(b.name));
};

const mainScript = async () => {

    const students = await readFile(filePath)
    
    students.push({name: 'Sonia', notes: [17], address: "Paris" })
    students.push({name: 'Clarisse', notes: [18], address: "Marseille" })

    const orderedStudents = sortStudentsByName(students)

    const goodStudents = findStudentMarkUpTo(orderedStudents, 17)

    const bestStudent = findBestNoteStudent(orderedStudents)

    const upperCaseStudent = orderedStudents.map(student => {
        return {
            ...student,
            name: student.name.toUpperCase()
        }
    })
    console.table(upperCaseStudent)

    await writeFile(filePath, upperCaseStudent)

    process.exit()
}

mainScript()