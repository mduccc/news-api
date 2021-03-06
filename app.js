require('dotenv').config()
const Server = require('./app/Server')
const app = new Server().build()
const middleware = require('./app/routers/MiddleWare')
const bodyParser = require('body-parser')

//configure parser request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

new middleware(app).build()
