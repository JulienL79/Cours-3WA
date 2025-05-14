import http from "node:http";
import dotenv from 'dotenv'
import path from 'node:path'
import querystring from 'node:querystring'
import { writeFile, readFile, renderLayout, showTable } from "./utils.js";

dotenv.config()

const dirname = import.meta.dirname
const dataPath = path.join(dirname, "users.json")
const viewPath = path.join(dirname, "view")
const headerPath = path.join(viewPath,"_header.html")
const footerPath = path.join(viewPath,"_footer.html")

const server = http.createServer((req, res) => {
	const url = req.url.replace("/", "")

    const users = readFile(dataPath)
    const header = readFile(headerPath, true)
    const footer = readFile(footerPath, true)

	if (url === "favicon.ico") {
		res.writeHead(200, {
			"Content-type": "image/x-icon"
		})
		res.end()
		return;
	}
	
	if (url === "") {
        const content = 
        `
            <h1>Liste des utilisateurs : </h1>
            <ul>
                ${
                    users.map((user, index) =>
                    `
                    <li>
                        <a href="/user/${index}">${user.nom}</a>
                    </li>
                    `).join("")
                }
            </ul>
            <a href="/add">Ajouter</a>
        `
        
		res.writeHead(200, {
			"Content-type": "text/html; charset=utf8"
		})

        const page = renderLayout(content, header, footer)
		res.end(page)
		return
	}

    if(url === 'add' && req.method === "GET") {
        const content = readFile(path.join(viewPath, "form.html"), true)
        const page = renderLayout(content, header, footer)

        res.writeHead(200, {
            'Content-type': "text/html"
        })
        res.end(page)
        return
    }

    if(url === 'add' && req.method === "POST") {
        let body = ""

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {

            const data = querystring.parse(body)

            if(!data.name || data.name.trim() === "") {
                res.writeHead(401, {'Content-type': 'text/plain'})
                res.end("Le champ nom ne peut pas être vide")
                return
            }

            if(!data.email || data.email.trim() === "") {
                res.writeHead(401, {'Content-type': 'text/plain'})
                res.end("Le champ email ne peut pas être vide")
                return
            }

            users.push(
                {
                    nom: data.name,
                    email: data.email,
                    role: "utilisateur"
                }
            )


            writeFile(dataPath, users)

            res.writeHead(302, {
                'Location': "/"
            })
            res.end()
            return
        })
        return
    }

    if (url.startsWith('user')) {
        const userId = Number(url.split("/").pop())

        if(isNaN(userId)) {
            res.writeHead(401, {
                "Content-type": "text/plain"
            })
            res.end("User ID incorrect")
            return
        }

        const arrayToShow = [
            {
                ...users[userId],
                modifier: `<a href='../update/${userId}'>Modifier</a>`,
                supprimer: `<a href='../delete/${userId}'>Supprimer</a>`,
            }
        ]

        const table = showTable(arrayToShow)

        const content = 
        `
            <h1>Détail de l'utilisateur ${users[userId].nom}</h1>
            ${table}
        `

        const page = renderLayout(content, header, footer)

        res.writeHead(200, {
            'Content-type': "text/html"
        })
        res.end(page)
        return
    }

    if(url.startsWith('delete')) {
        const userId = Number(url.split("/").pop())

        if(isNaN(userId)) {
            res.writeHead(401, {
                "Content-type": "text/plain"
            })
            res.end("User ID incorrect")
            return
        }

        users.splice(userId, 1)

        writeFile(dataPath, users)

        res.writeHead(302, {
            'Location': "/"
        })
        res.end()
        return
    }

    if(url.startsWith('update') && req.method === 'GET') {
        const userId = Number(Number(url.split("/").pop()))

        if(isNaN(userId) || !users[userId]) {
            res.writeHead(401, {
                "Content-type": "text/plain"
            })
            res.end("User ID incorrect")
            return
        }

        const content = 
        `
        <h1>Modification d'un utilisateur</h1>
        <form action="/update/${userId}" method="POST">
            <input type="text" name="name" placeholder="Nom" value="${users[userId].nom}">
            <input type="email" name="email" placeholder="ex: jf@gmail.com" value="${users[userId].email}">
            <input type="submit" value="Modifier">
        </form>
        `

        const page = renderLayout(content, header, footer)

        res.writeHead(200, {
            'Content-type': "text/html"
        })
        res.end(page)
        return
    }

    if(url.startsWith('update') && req.method === 'POST') {
        const userId = Number(Number(url.split("/").pop()))

        if(isNaN(userId) || !users[userId]) {
            res.writeHead(401, {
                "Content-type": "text/plain"
            })
            res.end("User ID incorrect")
            return
        }

        let body = ""

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {

            const data = querystring.parse(body)

            if(!data.name || data.name.trim() === "") {
                res.writeHead(401, {'Content-type': 'text/plain'})
                res.end("Le champ nom ne peut pas être vide")
                return
            }

            if(!data.email || data.email.trim() === "") {
                res.writeHead(401, {'Content-type': 'text/plain'})
                res.end("Le champ email ne peut pas être vide")
                return
            }

            users[userId] = (
                {
                    ...users[userId],
                    nom: data.name,
                    email: data.email,
                }
            )

            writeFile(dataPath, users)

            res.writeHead(302, {
                'Location': "/"
            })
            res.end()
            return
        })
        return
    }
	
	res.writeHead(404, {
		"Content-type": "text/plain"
	})
	res.end("Page introuvable")
})

server.listen(8000, "localhost", () => {
	console.log(`Server running on http://localhost:8000`)
})