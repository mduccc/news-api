module.exports = class RssRequest {

    request(page, callback) {

        if (page <= 0 || page === null)
            return callback([])
        
        const https = require('https')
        
        const options = {
            hostname: process.env.vnreview_host_name,
            port: 443,
            path: process.env.vnreview_rss_uri,
            method: 'GET'
        }

        const req = https.request(options, res => {
            res.setEncoding('utf8')
            console.log('statusCode:', res.statusCode)
            console.log('headers:', res.headers)

            var body = ''
            res.on('data', d => {
                body += d
            })

            res.on('end', async () => {
                let array
                let newArray = []

                try {
                    array = await this.parseRss(body)

                    if (page !== null) {
                        if (page > 0) {
                            let indexStart = (page * 10) - 10
                            let indexEnd = (page * 10)
                                    
                            for (let i=indexStart; i<indexEnd; i++)
                                if (i < array.length)
                                    newArray.push(array[i])

                            return callback(newArray)
                        }
                    }
                } catch (e) {
                    return callback([])
                }
                return callback(array)
            })
        })

        req.on('error', e => {
            return callback({errors: 'Cannot request'})
        })

        req.end()
    }

    async parseRss(data) {
        const domain = process.env.DOMAINLIVE
        const port = process.env.PORTLIVE
        const med = process.env.METHOD
        const parseString = require('xml2js').parseString
        const array = [];
        await parseString(data, (err, result) => {
            let channel = result.rss.channel
            for (let i = 0; i < channel.length; i++) {
                let items = channel[i].item;
                for (let j = 0; j < items.length; j++) {
                    console.log(items[j].title)
                    console.log(items[j].link)
                    console.log(items[j].description)
                    console.log(items[j].guid[0]._)
                    console.log(items[j].pubDate[0])
                    console.log('\n')

                    let title = items[j].title[0].trim()
                    let link = items[j].link[0].trim()
                    let description = items[j].description[0].trim()
                    let image = items[j].guid[0]._.trim()
                    let date = parseDate(items[j].pubDate[0])

                    array.push({
                        source: 'vnreview',
                        post_name: title,
                        link: link,
                        description: description,
                        image: image,
                        date: date,
                        full_post: med  + '://' + domain + '' + port + '/post/vnreview?post_url=' + link
                    })
                }
            }
        })
        return array
    }
}

function parseDate(input) {
    let DayOfWeek = {
        Mon: 2,
        Tue: 3,
        Wed: 4,
        Thu: 5,
        Fri: 6,
        Sat: 7,
        Sun: 8
    }

    let Month = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
    }

    let date = ''
    let dayOfWeek = input.substring(0, input.indexOf(',')).trim()
    dayOfWeek = DayOfWeek[dayOfWeek]
    let day = input.substring(input.indexOf(', ')+2, input.indexOf(',')+4).trim()
    let month = input.substring(8, 11)
    month = Month[month]
    let year = input.substring(12, 16)
    date = day + '/' + month + '/' + year
    return date
}
