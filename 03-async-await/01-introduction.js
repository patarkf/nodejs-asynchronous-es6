'use strict'

const hget = require('hget')
const marked = require('marked')
const Term = require('marked-terminal')
const request = require('request')

/**
 * Specification: According to the specification, a function is defined as asynchronous
 * when marked with the keyword 'async', which must return a promise. 
 * 
 * A function can only waiting for another asynchronous function when it's an asynchronous
 * function itself. What means: you will only be able to use 'await' inside of a 'async' 
 * function.
 */

/**
 * Promise example 
 */
function getRandomPonyFooArticle() {
    return new Promise((resolve, reject) => {
        request('https://ponyfoo.com/articles/random', (err, res, body) => {
            if (err) return reject(err)

            resolve(body)
        })
    })
}

printRandonArticle();

function printRandonArticle () {
    getRandomPonyFooArticle()
        .then(html => hget(html, {
            markdown: true,
            root: 'main',
            ignore: '.at-subscribe, .mm-comments, .de-sidebar'
        }))
        .then(md => marked(md, {
            renderer: new Term()
        }))
        .then(txt => console.log(txt))
        .catch(reason => console.error(reason));
}

/**
 * Generator example
 */
function getRandomPonyFooArticle (gen) {
    let g = gen()
    request('https://ponyfoo.com/articles/random', (err, res, body) => {
        if (err) return g.throw(err)

        g.next(body)  
    })
}

getRandomPonyFooArticle(function* printRandonArticle () {
    let html = yield
    let md = hget(html, {
        markdown: true,
        root: 'main',
        ignore: '.at-subscribe, .mm-comments, .de-sidebar'
    })

    let txt = marked(md, {
        renderer = new Term()
    })

    console.log(txt)
})

/**
 * Needless to say, using generators like this doesn't scale well. Besides involving an unintuitive syntax into the mix,
 * your iterator code will be highly coupled to the generator function that's being consumed. That means you'll have to
 * change it often as you add new await expressions to the generator. A better alternative is to use the upcoming Async
 * Function.
 */

/**
 * Async/Await example
 */
function getRandomPonyFooArticle() {
    return new Promise((resolve, reject) => {
        request('https://ponyfoo.com/articles/random', (err, res, body) => {
            if (err) return reject(err)

            resolve(body)
        })
    })
}

read()

async function read () {
    let html = await getRandomPonyFooArticle()
    let md = hget(html, {
        markdown: true,
        root: 'main',
        ignore: '.at-subscribe, .mm-comments, .de-sidebar'
    })

    let txt = marked(md, {
        renderer: new Term()
    })

    return 
}

/**
 * Another example
 */
async function asyncFunc () {
    let value = await Promise
        .resolve(1)
        .then(x => x * 3)
        .then(x => x + 5)
        .then(x => x/ 2)
    return value
}

asyncFunc().then(x => console.log(`x: ${x}`))


/**
 * A more "real world" example
 */
async function read () {
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
}

// You could continue the function using an async function
async function write () {
    let txt = await read()

    console.log(txt)
}

// Or using a promise as well
read().then(txt => console.log(txt))


/**
 * It's important to mention that the async function flow is serial, event when a
 * statement being asynchronous it will be executed after the previous one. But, since
 * async functions become promises afterwards, we can use them as you would use promises.
 */