class MiddleWare {

    constructor(app) {
        this.Router = require('./Router')
        this.app = app
        this.router = new this.Router(this.app)
    }

    root() {
        this.app.use('/', async (req, res, next) => {
            this.router.build()
            next()
        })
    }

    build() {
        this.root()
    }

}

module.exports = MiddleWare