'use strict'

const fetch = require('node-fetch') 
const co = require('co')

/**
 * What are Generators?
 * 
 * Generators can be described as pausable functions in JavaScript. It's a new feature introduced
 * in ES6. Also can be described as co-routines. Usually used (among other things) to manage async
 * operations, and play very well with promises.
 */


/**
 * How can I use generators?
 */

function* myGenerator() {
    console.log('Hey, I\'m here, just before the first yield')
    yield 1
    console.log('But what about me?')
    yield 2
    yield 3*2
    console.log('Hello!?')
}

let g = myGenerator()

console.log(g.next().value)
console.log(g.next().value)
console.log(g.next())
console.log(g.next())


/**
 * More "real world" examples
 */

// Promise example
fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())
    .then(post => post.title)
    .then(title => console.log('Title:', title))

// Generator example (but using a library)
co(function* () {
    const uri = 'https://jsonplaceholder.typicode.com/posts/1'
    const response = yield fetch(uri)
    const post = yield response.json()
    const title = post.title

    console.log('Title:', title)
})

// Our own library to handle promises using a generator
run(function* () {
    const uri = 'https://jsonplaceholder.typicode.com/posts/1'
    const response = yield fetch(uri)
    const post = yield response.json()
    const title = post.title

    return title
})
.then(x => console.log('Result is:', x))
.catch(error => console.error(error.stack))

function run(generator) {
    const iterator = generator()
    const iteration = iterator.next()

    function iterate(iteration) {
        if (iteration.done) return iteration.value
        
        const promise = iteration.value
        
        return promise.then(x => iterate(iterator.next(x)))
    }
    return iterate(iteration)
}