class Router {

    constructor(app) {
        this.app = app
    }

    get() {
        this.app.get('/', (req, res) => {
            res.send('Wellcome')
            res.end()
        })
        this.app.get('/newsfeed/vnreview', (req, res) => {
            let page = req.query.page
            let rssRequest = require('../modules/vnreview/RssRequest')
            let executeRequest = new rssRequest(). request(page, result => {
                let code = 200
                if (result === null || result.length === 0)
                    code = 204

                res.json({
                    'title': 'Newfeed VnReview',
                    'code': code,
                    'post': result
                })
                res.end()
            })
        })
        this.app.get('/post/vnreview', (req, res) => {
            let post_url = req.query.post_url
            let postRequest = require('../modules/vnreview/PostRequest')
            let executeRequest = new postRequest(post_url, result => {
                let code = 200
                if (result === null || result.length === 0)
                    code = 204

                res.send({
                    'post_url': post_url, 
                    'code': code,
                    'post_content': result
                })
                res.end()
            })
        })
        this.app.get('/newsfeed/toidicodedao', (req, res) => {
            let page = req.query.page
            let RssRequest = require('../modules/toidicodedao/RssRequest')
            let executeRequest = new RssRequest(page, result => {
                let code = 200
                if (result === null || result.length === 0)
                    code = 204

                res.json({
                    'title': 'Newfeed Toidicodedao',
                    'code': code,
                    'post': result
                })
                res.end()
            })
        })
        this.app.get('/post/toidicodedao', (req, res) => {
            let post_url = req.query.post_url
            let postRequest = require('../modules/toidicodedao/PostRequest')
            let executeRequest = new postRequest(post_url, result => {
                let code = 200
                if (result === null || result.length === 0)
                    code = 204

                res.send({
                    'post_url': post_url,
                    'code': code,
                    'post_content': result
                })
                res.end()
            })
        })
        this.app.get('/newsfeed', (req, res) => {
            let page = req.query.page
            let Newsfeed = require('../modules/newsFeed/NewsFeed')
            let executeRequest = new Newsfeed().getNewsFeed(page, result => {
                let code = 200
                if (result === null || result.length === 0)
                    code = 204

                res.json({
                    'title': 'Newfeed',
                    'code': code,
                    'post': result
                })
                res.end()
            })
        })
        this.app.get('/search', (req, res) => {
            let keyWord = req.query.keyword
            let Search = require('../modules/search/Search')
            let execute = new Search().search(keyWord, result => {
                let code = 200
                if (result.length === 0 || result === null)
                    code = 204
                
                    res.json({
                        'title': 'Search',
                        'code': code,
                        'post': result
                    })
                    res.end()
            })
        })
    }

    post() {
        this.app.post('/', (req, res) => {
            res.send('Wellcome')
            res.end()
        })
    }

    build() {
        this.get()
        this.post()
    }

}

module.exports = Router