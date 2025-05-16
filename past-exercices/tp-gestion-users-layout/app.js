import http from 'node:http'
import path from 'node:path'
import pug from "pug"
import fs from 'node:fs'
import querystring from 'node:querystring'
import { fileURLToPath } from 'node:url';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const viewPath = path.join(dirname, "view")
const assetsPath = path.join(dirname, "assets")
const contactPath = path.join(dirname, "contacts.json")

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];

const contactInputs = [
    { name: "firstName", type: "text", label: "Prénom"},
    { name: "lastName", type: "text", label: "Nom" },
    { name: "email", type: "email", label: "Email" },
    { name: "message", type: "textarea", label: "Message" },
]

const server = http.createServer((req, res) => {
    const [pathname, query] = req.url.split('?');
    const url = pathname.replace("/", "")
    const showToast = query?.includes('contactSuccess=true')
    
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
        const stylesheet = fs.readFileSync(path.join(assetsPath, stylesheetName))

        res.writeHead(200, {
            "Content-type": "text/css"
        })
        res.end(stylesheet)
        return;
	}

    if(url === "") {

        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/home.pug"), {menuItems : updatedMenu, showToast},(err, data) => {
            if(err) throw err
            res.end(data)
        })
        return
    }

    if(url === "contact-me" && req.method === "GET") {
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/contact.pug"), {page: `/${url}`, menuItems : updatedMenu, inputs: contactInputs},(err, data) => {
            if(err) throw err
            res.end(data)
        })

        return
    }

    if(url === "contact-me" && req.method === "POST") {

        let body = ""
        
        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
        
            const data = querystring.parse(body)

            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                res.writeHead(400, { 'Content-Type': 'text/plain' })
                res.end("Tous les champs sont obligatoires.")
                return
            }

            const contact = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                message: data.message,
                createdAt: new Date().toISOString()
            }

            let existingContacts = []
            if (fs.existsSync(contactPath)) {
                const raw = fs.readFileSync(contactPath)
                try {
                    existingContacts = JSON.parse(raw)
                } catch {
                    existingContacts = []
                }
            }

            existingContacts.push(contact)
            fs.writeFileSync(contactPath, JSON.stringify(existingContacts, null, 2))

            // Redirection avec indication du toast
            res.writeHead(302, {
                'Location': "/?contactSuccess=true"
            })
            res.end()
            })

        return
    }

    if(url === "about-me") {
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/about.pug"), {menuItems : updatedMenu},(err, data) => {
            if(err) throw err
            res.end(data)
        })
        return
    }

        if(url === "references") {
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/reference.pug"), {menuItems : updatedMenu},(err, data) => {
            if(err) throw err
            res.end(data)
        })
        return
    }
})

server.listen(8000, "localhost", () => {
	console.log(`Server running on http://localhost:8000`)
})

