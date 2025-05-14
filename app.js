import http from "node:http";
import { shuffleArray } from "./utils.js";

const users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
];

const server = http.createServer((req, res) => {
	const url = req.url.replace("/", "")
	
	if (url === "favicon.ico") {
		res.writeHead(200, {
			"Content-type": "image/x-icon"
		})
		res.end()
		return;
	}
	
	if (url === "") {
		res.writeHead(200, {
			"Content-type": "text/html"
		})
		res.end(`
			<!DOCTYPE html>
			<html lang="fr">
				<head>
				 <title>Home</title>
				</head>
				<body>
					<div>
                        <h1>Liste des utilisateurs : </h1>
                        <ul>
                            ${
                                users.map(user => `<li>${user}</li>`).join("")
                            }
                        </ul>
                    </div>
				</body>
			</html>
		`)
		return
	}
	
	if (url === "shuffle") {

        const shuffledUsers = shuffleArray(users)
        console.log("OK entré")
        console.log(shuffledUsers)

		res.writeHead(200, {
			"Content-type": "text/html"
		})

        
		
		res.end(`
			<!DOCTYPE html>
			<html lang="fr">
				<head>
				 <title>Shuffle Page</title>
				</head>
				<body>
					<div>
                        <h1>Liste des utilisateurs mélangée : </h1>
                        <ul>
                            ${
                                shuffledUsers.map(user => `<li>${user}</li>`).join("")
                            }
                        </ul>
                    </div>
				</body>
			</html>
		`)
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