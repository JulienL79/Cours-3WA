import http from 'node:http'
import path from 'node:path'
import pug from "pug"
import fs from 'node:fs'
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const viewPath = path.join(dirname, "view")
const assetsPath = path.join(dirname, "assets")

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
    { name: "content", type: "textarea", label: "Message" },
]

const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "")

    
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

        pug.renderFile(path.join(viewPath, "pages/home.pug"), {menuItems},(err, data) => {
            if(err) throw err
            res.end(data)
        })
        return
    }

    if(url === "contact-me") {
        res.writeHead(200, {
            "Content-type": "text/html"
        })

        pug.renderFile(path.join(viewPath, "pages/contact.pug"), {menuItems : updatedMenu, inputs: contactInputs},(err, data) => {
            if(err) throw err
            res.end(data)
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

