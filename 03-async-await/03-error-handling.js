'use strict'

const hget = require('hget')
const marked = require('marked')
const Term = require('marked-terminal')
const request = require('request')

/**
 * Error handling:
 * 
 * Note that errors are swallowed "silently" within an async function - kust like inside normal Promises. Unless we
 * add try / catch blocks around await expressions, uncaught exceptions - regardless or whether they were raised in
 * the body of your async function or hwile its suspended during await - will reject the promise returned by the async
 * function.
 * 
 * Using 'await' we have asynchronous code being executed as procedural
 * 
 */

const uri = 'https://ponyfoo.com/articles/random';

function getRandomPonyFooArticle() {
    return new Promise((resolve, reject) => {
        request(uri, (err, res, body) => {
            if (err) return reject(err)

            resolve(body)
        })
    })
}

async function read () {
    try {
        let html = await getRandomPonyFooArticle()
        let md = hget(html, {
            markdown: true,
            root: 'main',
            ignore: '.at-subscribe, .mm-comments, .de-sidebar'
        })

        let txt = marked(md, {
            renderer: new Term()
        })

        return txt
    } catch(err) {
        return err
    }
}

read()
    .then(data => console.log(data))
    .catch(err => console.error(err))