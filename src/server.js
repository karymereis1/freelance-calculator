const express = require("express")
const server = express()
const routes = require("./routes")

//usando o template engine para processar o html
server.set('view engine', 'ejs')

//habilitar arquivos estáticos
server.use(express.static("public"))

//usar o req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)
server.listen(3000, () => console.log('running'))
// console.log(server)

