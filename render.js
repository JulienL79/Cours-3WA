import pug from "pug"

pug.renderFile('template.pug', { user: {isAdmin: false} }, (err, data) => {
    if(err) throw err
    console.log(data)
})