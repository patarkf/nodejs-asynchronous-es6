'use strict'

const request = require('request-promise')

/**
 * What is a promise?
 * 
 * A promise can be described as "a proxy for a value that will eventually become available"
 */

/**
 * How it was before Promises?
 */

const uri = 'https://jsonplaceholder.typicode.com/posts/1';

// Using Callbacks
request(uri, (err, res) => {
    if (err) {
        // handle error
    }
    
    // handle response
    console.log(res.body)
})


// Using an Event-driven API model.
request(uri)
    .on('error', error => {
        // handle error
    })
    .on('data', res => {
        console.log(res.toString())
    })

// Using Promises
let promise = request(uri);

promise.then(res => {
    // handle response
    console.log(res);
});

promise.catch(err => {
    // handle error
});

/**
 * Since that .then and .catch return a new promise every time, it's important to know
 * that chaining can have widly different results depending on where you append these
 * callbacks.
 * 
 * Examples:
 */

// Both callbacks are chained onto request(uri).
request(uri).then(res => {}, err => {})

// Identical to the previous one.
let p = request(uri);
p.then(res => {}, err => {})

// Even though semantics are different, this one is also the same.
let p2 = request(uri);
p2.then(res => {});
p2.catch(err => {});

// Here, though, .catch is chained onto .then, and not onto the original promise.
request(uri)
    .then(res => {})
    .catch(error => {});

/**
 * TODO: Talk about Promises methods, such as .all() and so on
 */