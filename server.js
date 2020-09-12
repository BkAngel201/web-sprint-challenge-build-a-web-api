const express = require('express')


const server = express()
const projectsRouters = require('./routers/projectsRouters')

server.use(express.json())
server.use("/api/projects", projectsRouters)

server.get("/", (res, req) => {
    res.send("<h2>Lets Make an awesome API</h2>")
})


module.exports = server