import http from "node:http";
import { shuffleArray } from "./utils.js";
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'
import querystring from 'node:querystring'

dotenv.config()

const dirname = import.meta.dirname
const viewPath = path.join(dirname, "view")
const headerPath = path.join(viewPath,"_header.html")
const footerPath = path.join(viewPath,"_footer.html")

const users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
];

let customUsers = [...users]

const server = http.createServer((req, res) => {
	const url = req.url.replace("/", "")

    const header = fs.readFileSync(headerPath, {encoding: 'utf-8'})
    const footer = fs.readFileSync(footerPath, {encoding: 'utf-8'})
	
	if (url === "favicon.ico") {
		res.writeHead(200, {
			"Content-type": "image/x-icon"
		})
		res.end()
		return;
	}
	
	if (url === "") {
		res.writeHead(200, {
			"Content-type": "text/html; charset=utf8"
		})
		res.end(`
			<!DOCTYPE html>
			<html lang="fr">
				<head>
				 <title>Home</title>
				</head>
				<body>
                    ${header}
					<div>
                        <h1>Liste des utilisateurs : </h1>
                        <ul>
                            ${
                                customUsers.map(user => `<li>${user}</li>`).join("")
                            }
                        </ul>
                        <a href="/shuffle">Mélanger</a>
                    </div>
				</body>
                ${footer}
			</html>
		`)
		return
	}
	
	if (url === "shuffle") {

        customUsers = shuffleArray(customUsers)

		res.writeHead(302, {
			"Location": "/"
		})

		res.end()
		return
	}

    if(url === 'add' && req.method === "GET") {
        const page = fs.readFileSync(path.join(viewPath, "form.html"), {encoding: "utf8"})
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
            // const dataArray = body.split("&")
            // let obj = {}
            // dataArray.forEach((data) => {
            //     const [key, value] = data.split('=')
            //     obj[key] = value
            // })
            // console.log(obj)

            const data = querystring.parse(body)

            if(!data.name || data.name.trim() === "") {
                res.writeHead(401, {'Content-type': 'text/plain'})
                res.end("Le champ nom ne peut pas être vide")
                return
            }

            customUsers.push(data.name)

            res.writeHead(301, {
                'Location': "/"
            })
            res.end()
            return
        })
        return
    }
	
	res.writeHead(200, {
		"Content-type": "text/plain"
	})
	res.end("Hello world !")
})

server.listen(8000, "localhost", () => {
	console.log(`Server running on http://localhost:8000`)
})