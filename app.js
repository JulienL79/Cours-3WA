// import http from 'node:http'
import path from 'node:path'
import pug from "pug"

const dirname = import.meta.dirname
const viewPath = path.join(dirname, "view")

// const server = http.createServer((req, res) => {
//     const url = req.url.replace("/", "")

//     if (url === "favicon.ico") {
//         res.writeHead(200, {
//             "Content-type": "image/x-icon"
//         })
//         res.end()
//         return;
// 	}

//     if(url === "/user") {
//         const loggedUser = {
//             name: {
//                 first: 'Jean',
//                 last: 'Dupont',
//             },
//             age: 36,
//             birthdate: new Date('1986-04-18'),
//             location: {
//                 zipcode: '77420',
//                 city: 'Champs-sur-Marne',
//             },
//             isAdmin: true
//         };

//         const template = (users) => pug.compileFile(path.join(viewPath, "home.pug"), {users}, {pretty: true})
//         console.log(template([loggedUser]))

//         res.writeHead(200, {
//             'Content-type': "text/html"
//         })
//         res.end()
//     }
// })

// server.listen(8000, "localhost", () => {
// 	console.log(`Server running on http://localhost:8000`)
// })

const loggedUser = {
            name: {
                first: 'Jean',
                last: 'Dupont',
            },
            age: 36,
            birthdate: new Date('1986-04-18'),
            location: {
                zipcode: '77420',
                city: 'Champs-sur-Marne',
            },
            isAdmin: true
        };


const compileFile =  pug.compileFile(path.join(viewPath, "home.pug"), {pretty: true})
console.log(compileFile({users : [loggedUser]}))