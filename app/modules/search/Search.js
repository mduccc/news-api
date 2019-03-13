
module.exports = class Search {

    constructor() {
        this.data = null
        this.result = []
    }

    async search(key_word, callback) {
        let url = process.env.METHOD + '://' + process.env.DOMAIN + ':' + process.env.PORT + '/newsfeed?page=all'
        await this.request(url, key_word)
        return callback(this.result)
    }

    async request(url, key_word) {
        const pr = require('request-promise')
        await pr(url)
        .then(html => {
            let data = JSON.parse(html) 
            this.data = data.post
            this.execute(key_word)
        })
        .catch(error => {
            console.log('________________________________________________') 
            console.log(error)
            return null
        })
    }
    
    execute(key_word){
        for (let i=0; i<this.data.length; i++) {
            let post_name = this.data[i].post_name.toLowerCase()
            if (post_name.includes(key_word.toLowerCase())) {
                console.log(post_name)
                this.result.push(this.data[i])
            }
        }

        if (this.result.length === 0) {
            console.log('empty')
        }
        
    }
 
}