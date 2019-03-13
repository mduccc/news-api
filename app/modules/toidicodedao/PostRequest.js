module.exports = function postRequest(url, callback) {
    const https = require('https')

    const options = {
        hostname: url.substr(url.indexOf(' https://') + ' https://'.length, 'toidicodedao.com'.length),
        port: 443,
        path: url.substr('https://toidicodedao.com'.length),
        method: 'GET'
    }

    const req = https.request(options, res => {
        res.setEncoding('utf8')
        console.log('statusCode', res.statusCode)
        console.log('header', res.headers)

        var body = ''
        res.on('data', d => {
            body += d
        })

        res.on('end', () => {
            let result
            
            try {
                result = parsePost(body)
            } catch {
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
    let array = []
    const jsdom = require('jsdom').JSDOM
    const dom = new jsdom(data)

    let tagHeader = dom.window.document.getElementsByClassName('entry-header')[0]
    let tagH1 = tagHeader.getElementsByClassName('entry-title')[0]

    let tagsDiv = dom.window.document.querySelectorAll('div')
    for (let i=0; i<tagsDiv.length; i++) {
        if (tagsDiv[i].className === 'entry-content'){
            let tagDivContent = tagsDiv[i]
            let children = tagDivContent.children
            console.log(tagDivContent.className)

            for (let j=0; j<children.length; j++) {
                if (children[j].tagName === 'H1' ||
                children[j].tagName === 'H2' ||
                children[j].tagName === 'H3' ||
                children[j].tagName === 'H4' ||
                children[j].tagName === 'H5' ||
                children[j].tagName === 'H6' ||
                children[j].tagName === 'H7') {
                    if(children[j].textContent.trim() !== '') {
                        console.log('<'+children[j].tagName+'>'+children[j].textContent+'</'+children[j].tagName+'>')
                        array.push('<'+children[j].tagName+'>'+children[j].textContent.trim()+'</'+children[j].tagName+'>')
                    }
                }
                if (children[j].tagName === 'P') {
                    if (children[j].textContent.trim() !== '') {
                        console.log(children[j].textContent)
                        array.push(children[j].textContent.trim())
                    } else {
                        let pChild = children[j].children
                        for (let k=0; k<pChild.length; k++) {
                            if (pChild[k].tagName === 'SPAN') {
                                let spanChild = pChild[k].children
                                for (let m=0; m<spanChild.length; m++) {
                                    if (spanChild[m].tagName === 'IFRAME') {
                                        array.push('<'+spanChild[m].tagName+'>'+spanChild[m].src.trim()+'</'+spanChild[m].tagName+'>')
                                    }
                                }
                            }
                        }
                    }
                }
                if (children[j].tagName === 'FIGURE') {
                    let tagA = children[j].getElementsByTagName('a')[0]
                    let tagImg = tagA.getElementsByTagName('img')[0]
                    console.log(tagImg.src)
                    array.push(tagImg.src.trim())
                }
                if (children[j].tagName === 'PRE') {
                    console.log('<'+children[j].tagName+'>'+children[j].textContent.trim()+'</'+children[j].tagName+'>')
                    array.push('<'+children[j].tagName+'>'+children[j].textContent.trim()+'</'+children[j].tagName+'>')
                }
            }
        }
    }

    let post_name = tagH1.textContent
    console.log(post_name)
    return {
        post_name: post_name,
        content: array
    }
}