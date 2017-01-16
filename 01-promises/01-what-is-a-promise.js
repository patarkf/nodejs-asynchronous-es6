/**
 * 01 - What is a Promise? 
 * 
 * Promises can be described as "a proxy for a value that will eventually become available".
 */
'use strict';


/**
 * Module dependencies.
 * 
 * @constant {Module} request Request-Promise <https://github.com/request/request-promise>
 */
const request = require('request-promise');

/**
 * @constant {String} url Static url that will be used in the examples.
 */
const url = 'http://google.com';


/**
 * How it was before Promises.
 */

// Using Callbacks
request(url, (err, res) => {
    if (err) {
        // handle error
    }

    // handle response
})


// Using an Event-driven API model.
request(url)
    .on('error', error => {
        // handle error
    })
    .on('data', res => {
        // handle response
    })


/**
 * Now, using Promises
 */

let promise = request(url);
promise.then(res => {
    // handle response
});
promise.catch(err => {
    // handle error
});


// Alternative syntax.
request(url)
    .then(
        res => {
            // handle response
        },
        error => {
            // handle errors
        }
    )

/**
 * Since that .then and .catch return a new promise every time, it's important to know
 * that chaining can have widly different results depending on where you append these
 * callbacks.
 * 
 * Examples:
 */

// Both callbacks are chained onto request(url).
request(url).then(res => {}, err => {})

// Identical to the previous one.
let p = request(url);
p.then(res => {}, err => {})

// Even though semantics are different, this one is also the same.
let p2 = request(url);
p2.then(res => {});
p2.catch(err => {});

// Here, though, .catch is chained onto .then, and not onto the original promise.
request(url)
    .then(res => {})
    .catch(error => {});