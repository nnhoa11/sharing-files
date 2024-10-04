const express = require('express')
const app = express()
const port = 3000
const db = require('./config/db')
const http = require('http')
const routes = require('./routes')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)

const httpServer = http.createServer(app)


db.connect()
.then(() => {
    routes(app)
    httpServer.listen(port)
})

