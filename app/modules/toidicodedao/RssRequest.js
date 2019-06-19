module.exports = function rssRequest(page, callback) {

    if (page <= 0 || page === null)
            return callback([])

    const https = require('https')

        const options = {
            hostname: process.env.toidicodedao_hostname,
            port: 443,
            path: process.env.toidicodedao_rss_uri,
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
                    array = await parseRss(body)

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

function parseRss(data) {
    const domain = process.env.DOMAINLIVE
    const port = process.env.PORTLIVE
    const med = process.env.METHODLIVE
    let array = []
    const jsdom = require('jsdom').JSDOM
    const dom = new jsdom(data)

    let tagDivContent = dom.window.document.getElementsByClassName('site-content')[0]
    let tagsArticle = tagDivContent.getElementsByTagName('article')
    for (let i=0; i<tagsArticle.length; i++) {
        let tagArticle = tagsArticle[i]

        let tagA = tagArticle.getElementsByTagName('a')[0]
        let tagImg = tagA.getElementsByTagName('img')[0]

        let tagHeader = tagArticle.getElementsByTagName('header')[0]
        let tagEntryMeta = tagHeader.getElementsByClassName('entry-meta')[1]
        let tagEntryDate = tagEntryMeta.getElementsByClassName('entry-date')[0]
        let tagADate = tagEntryMeta.getElementsByTagName('a')[0]
        let tagTime = tagADate.getElementsByTagName('time')[0]
        let tagH1 = tagHeader.getElementsByTagName('h1')[0]
        let tagA1 = tagH1.getElementsByTagName('a')[0]

        let tagDiv = tagArticle.getElementsByClassName('entry-content')[0]
        let tagsP = tagDiv.getElementsByTagName('p')

        let link = tagA1.href.trim()
        let title = tagA1.textContent.trim()
        let description = ''
        let image = tagImg.src.trim()
        let date = tagTime.textContent.trim()

        for (let j=0; j<tagsP.length; j++) {
           description += tagsP[j].textContent + ' '
        }

        description = description.trim()
        console.log(link)
        console.log(title)
        console.log(description)
        console.log(image)
        console.log(date)
        console.log('\n')
        
        array.push({
            source: 'toidicodedao',
            post_name: title,
            link: link,
            description: description,
            image: image,
            date: date,
            full_post: med + '://' + domain + '' + port + '/post/toidicodedao?post_url=' + link
        })
    }
    return array
}