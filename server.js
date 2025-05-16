import http from 'node:http'
import path from 'node:path'
import pug from "pug"
import fs from 'node:fs'
import querystring from 'node:querystring'
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv'
import { addStudent, deleteStudent, fetchStudent, readFile, updateStudent, writeFile } from './utils/utils.js'
import { normalizeDate, formatDateFr } from './utils/dateUtils.js'

dotenv.config()

const host = process.env.APP_HOST;
const port = process.env.APP_PORT;


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const viewPath = path.join(dirname, "view")
const cssPath = path.join(dirname, "assets/css")
const dataPath = path.join(dirname, "data")

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/users', title: 'Users', isActive: false }
]

const addInputs = [
    { name: "name", type: "text", label: "Nom"},
    { name: "birth", type: "date", label: "Date de naissance" },
]

const errors = [
    "Tous les champs sont obligatoires",
    "L'étudiant selectionnné est incorrect",
    "Erreur dans la suppression"
]

const successes = [
    "Utilisateur correctement ajouté",
    "Utilisateur correctement modifié",
    "Utilisateur correctement supprimé"
]

const server = http.createServer((req, res) => {
    const [pathname, query] = req.url.split('?');
    const url = pathname.replace("/", "")
    const showToast = query?.includes('success=') ? successes[Number(query.split('=').pop())] : ""
    const showError = query?.includes('error=') ? errors[Number(query.split('=').pop())] : ""
    
    const updatedMenu = menuItems.map(item => ({
        ...item,
        isActive: item.path === `/${url}`
    }))

    if (url === "favicon.ico") {
        res.writeHead(200, {
            "Content-type": "image/x-icon"
        })
        res.end()
        return;
    }

    if (url.startsWith("style")) {
        const stylesheetName = url.split("/").pop()
        const stylesheet = readFile(path.join(cssPath, stylesheetName))

        res.writeHead(200, {
            "Content-type": "text/css"
        })
        res.end(stylesheet)
        return;
    }

    if(url === "" && req.method === "GET") {

        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/home.pug"), {page: "/", menuItems : updatedMenu, inputs: addInputs, showToast, showError},(err, data) => {
            if(err) throw err
            res.end(data)
        })

        return
    }

    if(url === "" && req.method === "POST") {

        let body = ""

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
        
            const data = querystring.parse(body)
            data.birth = normalizeDate(data.birth)

            if (!data.name || !data.birth) {
                res.writeHead(302, {
                    'Location': "/?error=0"
                })
                res.end()
                return
            }

            const newStudent = {name : data.name, birth: data.birth}
            const students = readFile(path.join(dataPath, "students.json"))
            const updatedStudents = addStudent(students, newStudent)
            writeFile(path.join(dataPath, "students.json"), updatedStudents)

            // Redirection avec indication du toast
            res.writeHead(302, {
                'Location': "/?success=0"
            })
            res.end()
            return
        })
        return
    }

    if(url.startsWith("users")) {
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        const students = readFile(path.join(dataPath, "students.json")).map(student => ({
            ...student,
            birthFr: formatDateFr(student.birth)
        }))

        pug.renderFile(path.join(viewPath, "pages/users.pug"), {students, menuItems : updatedMenu, showError, showToast},(err, data) => {
            if(err) throw err
            res.end(data)
        })

        return
    }

    if(url.startsWith("update") && req.method === "GET") {
        const id = Number(pathname.split("/").filter(Boolean).pop());
        console.log(id)

        if(isNaN(id)) {
            res.writeHead(302, {
                'Location': "/users/?error=1"
            })
            res.end()
            return
        }

        const students = readFile(path.join(dataPath, "students.json"))
        const student = fetchStudent(students, id)

        if (!student) {
            res.writeHead(302, {
                'Location': "/users/?error=1"
            });
            res.end();
            return;
        }

        const updatedInputs = addInputs.map(input => {
            return {
                ...input,
                value: input.name === "name" ? student.name : student.birth
            }
        })
        
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/update.pug"), {page: `/${url}`, student, menuItems : updatedMenu, inputs: updatedInputs, showToast, showError},(err, data) => {
            if(err) throw err
            res.end(data)
        })
        return
    }

    if(url.startsWith("update") && req.method === "POST") {
        const id = Number(pathname.split("/").filter(Boolean).pop());

        if(isNaN(id)) {
            // Redirection avec indication du toast
            res.writeHead(302, {
                'Location': `/users/?error=1`
            })
            res.end()
            return
        }

        let body = ""
        
        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
        
            const data = querystring.parse(body)
            data.birth = normalizeDate(data.birth)

            if (!data.name || !data.birth) {
                res.writeHead(302, {
                    'Location': `/update/${id}/?error=0`
                })
                res.end()
                return
            }

            const updatedStudent = {id : id, name : data.name, birth: data.birth}
            const students = readFile(path.join(dataPath, "students.json"))
            const updatedStudents = updateStudent(students, updatedStudent)
            writeFile(path.join(dataPath, "students.json"), updatedStudents)

            // Redirection avec indication du toast
            res.writeHead(302, {
                'Location': "/users/?success=1"
            })
            res.end()
            return
        })

        return
    }

    if(url.startsWith("delete")) {
        const id = Number(pathname.split("/").filter(Boolean).pop());

        if(isNaN(id)) {
            // Redirection avec indication du toast
            res.writeHead(302, {
                'Location': "/users/?error=2"
            })
            res.end()
            return
        }

        const students = readFile(path.join(dataPath, "students.json"))
        const student = fetchStudent(students, id)

        if (!student) {
            res.writeHead(302, {
                'Location': "/users/?error=2"
            });
            res.end();
            return;
        }

        const updatedStudents = deleteStudent(students, id)
        writeFile(path.join(dataPath, "students.json"), updatedStudents)
        
        res.writeHead(302, {
            'Location': "/users/?success=2"
        })
        res.end()
        return
    }
})

server.listen(port, host, () => {
    console.log(`Server running 🟢`)
})

