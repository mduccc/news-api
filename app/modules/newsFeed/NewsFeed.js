const domain = process.env.DOMAIN
const port = process.env.PORT
const med = process.env.METHOD
const urlArray = [med+'://'+domain+':'+port+'/newsfeed/toidicodedao', 
                    med+'://'+domain+':'+port+'/newsfeed/vnreview']

module.exports = class NewsFeed {

    constructor(){
        this.array = []
    }

    async getNewsFeed(page, callback) {
        let newArray = []

        if (page <= 0 || page === null)
            return callback([])

        for (let i=0; i<urlArray.length; i++) 
            await this.request(urlArray[i])

        await this.sort()

        if (page === 'all')
             return callback(this.array)

        let indexStart = (page * 10) - 10
        let indexEnd = (page * 10)
                
        for (let i=indexStart; i<indexEnd; i++)
            if (i < this.array.length)
                newArray.push(this.array[i])
        
        return callback(newArray)
    }

    compareDate(date1, date2){
        date1 = new Date(date1.replace(/(\d{2})[/](\d{2})[/](\d{4})/, "$2/$1/$3")).getTime()
        date2 = new Date(date2.replace(/(\d{2})[/](\d{2})[/](\d{4})/, "$2/$1/$3")).getTime()
        
        return date2 > date1
    }

    sort(){
        for (let i=0; i<this.array.length-1; i++) {
            for (let j=i+1; j<this.array.length; j++){
                let compare = this.compareDate(this.array[i].date, this.array[j].date)
                if (compare === true) {
                    console.log(this.array[i].date + ' < ' + this.array[j].date)
                    let temp = this.array[i]
                    this.array[i] = this.array[j]
                    this.array[j] = temp
                }
            }
        }
    }

    async request(url) {
        const pr = require('request-promise')
        await pr(url)
        .then(html => {
            let data = JSON.parse(html)
            let post = data.post
            for (let i=0; i<post.length; i++) 
                this.array.push(post[i])       
        })
        .catch(error => {
            console.log('________________________________________________') 
            console.log(error)
            return null
        })
    }
}