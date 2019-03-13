module.exports = function request(url, callback) {
    const https = require('https')

    const options = {
        hostname: url.substr(url.indexOf(' https://') + ' https://'.length, 'vnreview.vn'.length),
        port: 443,
        path: url.substr('https://vnreview.vn'.length),
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
            let result
            
            try {
                result = await parsePost(body)
            } catch (e) {
                return callback([])
            }
            return callback(result)
        })
    })

    req.on('error', e => {
        return callback([])
    })

    req.end()
}

function parsePost(data) {
    const array = []
    const jsdom = require('jsdom').JSDOM
    const dom = new jsdom(data)

    //post name
    console.log(dom.window.document.querySelector('h1').textContent)
    let post_name = dom.window.document.querySelector('h1').textContent.trim()
    //all tag <div>
    let tagsDiv = dom.window.document.querySelectorAll('div')
    for (let i = 0; i < tagsDiv.length; i++) {
        if (tagsDiv[i].className === 'journal-content-article') {
            let tagDivContent = tagsDiv[i]
            let children = tagDivContent.children
            console.log('class: ', tagDivContent.className, '\n')
           
            for (let j=0; j<children.length; j++) {
                if (children[j].tagName === 'H1' ||
                children[j].tagName === 'H2' ||
                children[j].tagName === 'H3' ||
                children[j].tagName === 'H4' ||
                children[j].tagName === 'H5' ||
                children[j].tagName === 'H6' ||
                children[j].tagName === 'H7') {
                    if (children[j].textContent.trim() !== '') {
                        console.log('<'+children[j].tagName+'>'+children[j].textContent+'</'+children[j].tagName+'>')
                        array.push('<'+children[j].tagName+'>'+children[j].textContent.trim()+'</'+children[j].tagName+'>')
                    }
                }
                if (children[j].tagName === 'P') {
                    if (children[j].textContent.trim() !== '') {
                        
                        let childrenOfP = children[j].children
                        if (childrenOfP.length >0) {
                            for (let k=0; k<childrenOfP.length; k++) {
                                if (childrenOfP[k].tagName === 'STRONG') {
                                    console.log('<'+childrenOfP[k].tagName+'>'+childrenOfP[k].textContent.trim()+'</'+childrenOfP[k].tagName+'>')
                                    array.push('<'+childrenOfP[k].tagName+'>'+childrenOfP[k].textContent.trim()+'</'+childrenOfP[k].tagName+'>')
                                } else {
                                    console.log(children[j].textContent)
                                    array.push(children[j].textContent.trim())
                                }
                            }
                        } else {
                            console.log(children[j].textContent)
                            array.push(children[j].textContent.trim())
                        }
                        
                        } else {
                        let childrenOfP = children[j].children
                        for (let k=0; k<childrenOfP.length; k++) {
                            if(childrenOfP[k].tagName === 'IMG' ||
                            childrenOfP[k].tagName === 'IFRAME'){
                                console.log('<'+childrenOfP[k].tagName+'>'+childrenOfP[k].src+'</'+childrenOfP[k].tagName+'>')
                                array.push('<'+childrenOfP[k].tagName+'>'+childrenOfP[k].src+'</'+childrenOfP[k].tagName+'>')
                            }

                            if(childrenOfP[k].tagName === 'STRONG') {
                                let childOfStrong = childrenOfP[k].children
                                for (let l=0; l<childOfStrong.length; l++) {
                                    if (childOfStrong[l].tagName === 'IMG') {
                                        console.log('<'+childOfStrong[l].tagName+'>'+childOfStrong[l].src+'</'+childOfStrong[l].tagName+'>')
                                        array.push('<'+childOfStrong[l].tagName+'>'+childOfStrong[l].src+'</'+childOfStrong[l].tagName+'>')
                                    } 
                                }
                            }
                        }
                    }
                }
                if (children[j].tagName === 'IFRAME') {
                    console.log('<'+children[j].tagName+'>'+children[j].src+'</'+children[j].tagName+'>')
                    array.push('<'+children[j].tagName+'>'+children[j].src+'</'+children[j].tagName+'>')
                }
            }
        }
    }
    return {
        post_name: post_name,
        content: array
    }
}