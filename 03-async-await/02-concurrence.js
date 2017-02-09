'use strict'

const hget = require('hget')
const marked = require('marked')
const Term = require('marked-terminal')
const request = require('request')

/**
 * Concurrence:
 * 
 * In asynchronous code flows, it is commonplace to execute two or more tasks concurrently. While async functions
 * make it easier to write asynchronous code, they also lend themselves to code that is serial: code that executes
 * one operation at a time. A function with multiple await expressions in it will be suspended once at a time until
 * that Promise is settled, before unsuspending execution and moving onto the next await expressions - not unlike the
 * case we observe with generators and yield.
 * 
 * To work around that you can use Promise.all to create a single promise that you can await on. Of course, the biggest
 * problem is getting in the habit of using Promise.all instead of leaving everything to run in a series, as it'll other
 * wise make a dent in you code's performance.
 * 
 * The following example shows how you could await on three different promises that could be resolved concurrently.
 */

let p1 = Promise.resolve(1)
let p2 = Promise.resolve(4)

async function concurrent () {
    return await Promise.all([p1, p2])
}

concurrent().then(data => console.log(data));


/**
 * Another concurrence example
 */
function getPostTitle () {
    return new Promise((resolve, reject) => {
        request('https://jsonplaceholder.typicode.com/posts/1', (err, res, body) => {
            if (err) return reject(err)

            resolve(JSON.parse(body).title)
        }) 
    })
}

function getPostBody () {
    return new Promise((resolve, reject) => {
        request('https://jsonplaceholder.typicode.com/posts/1', (err, res, body) => {
            if (err) return reject(err)

            resolve(JSON.parse(body).body)
        }) 
    })
}

function getPostUserId () {
    return new Promise((resolve, reject) => {
        request('https://jsonplaceholder.typicode.com/posts/1', (err, res, body) => {
            if (err) return reject(err)

            resolve(JSON.parse(body).userId)
        }) 
    })
}

/**
 * 
 */
async function getPostInformation () {
    let promises = []

    promises.push(getPostTitle())
    promises.push(getPostUserId())
    promises.push(getPostBody())

    return await Promise.all(promises)
}

getPostInformation()
    .then(postInformation => console.log(postInformation))
    .catch(err => console.error(err))