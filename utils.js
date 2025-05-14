import fs from 'node:fs'

export const readFile = (filePath, isHtml = false) => {
    try {
        console.log(filePath)
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = isHtml ? content : JSON.parse(content)

        return data
    } catch (err) {
        console.error('Erreur de lecture: ', err.message)
    }
}

export const writeFile = (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2)
        fs.writeFileSync(filePath, jsonData, 'utf-8')
        console.log('Fichier mis à jour avec succès.')
    } catch (err) {
        console.error('Erreur lors de l\'écriture :', err.message);
    }
};

export const renderLayout = (content, header, footer) => {

    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Gestion des utilisateurs</title>
        </head>
        <body>
            ${header}
            <main>
                ${content}
            </main>
            ${footer}
        </body>
        </html>
    `
}

export const showTable = (array) => {
    try {
        if(!Array.isArray(array) || array.length < 1) {
            throw new Error ("Le paramètre est incorrect ou vide")
        }

        const objectKeys =  Object.keys(array[0])

        const content = 
        `
        <table>
            <thead>
                <tr>
                    ${
                        objectKeys.map(header => {
                            return `<th>${header}</th>`
                        }).join("")
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    ${
                        array.map(user => {
                            const newLine = 
                            `
                                <tr>
                                    ${objectKeys.map(key => `<td>${user[key]}</td>`).join("")}
                                </tr>
                            `
                            return newLine
                        }).join("")
                    }
                </tr>
            </tbody>
        </table>
        `

        return content
    } catch (err) {
        console.error("Erreur dans la réalisation du table", err.message)
    }
}