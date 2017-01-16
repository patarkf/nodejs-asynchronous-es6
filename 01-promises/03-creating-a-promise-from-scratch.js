/**
 * 03 - Creating a Promise from scrach
 * 
 * Explaining in details how to create and use a Promise created from scrach.
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
 * In the beggining of this tutorial, we've used 'request', that is a library which internally
 * creates a new promise object. Then, each call to .then or .catch on the promise created by
 * request also created a promise internally, and those promises depend on their parent when it
 * comes to deciding whether the fulfillment branch or the rejection branch should be executed.
 * 
 * Below, an example of how to create a promise and which method does it accept.
 */

// Promise is fulfilled
new Promise(resolve => resolve());

// Promise is rejected
new Promise((resolve, reject) => reject());

/**
 * Resolving or rejecting promises without any value isn't useful, usually promises will resolve to 
 * some 'result', like the response from an AJAX call as we saw with 'request'. Similarly, you'll 
 * probably set a reason why your promise was rejected - typically using an Error object. 
 * 
 * Both fulfillment and rejection can be completely asynchronous. 
 */

// Example of a resolved promise with a value inside
new Promise(resolve => resolve({ foo: 'bar' }))
    .then(result => console.log(result));

// Example of a rejected promise with an Error object inside
new Promise((resolve, reject) => reject(new Error('Failed to deliver on my promise to you')))
    .catch(reason => console.log(reason));

// Example of promise being resolved after two seconds
new Promise(resolve => setTimeout(resolve, 2000));

/**
 * An important point to note is that only the first call made to either of these methods
 * will have an impact - once a promise is settled, it's result can't change. 
 * 
 * The example below creates a promise which is fulfilled in the alloted time or rejected
 * after a generous timeout.
 */

function resolveUnderFourSeconds (delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Promised resolved in time!')
        }, delay);

        setTimeout(() => {
            reject('Promised was rejected because it took so long :(')
        }, 4000);
    });
}

// Resolves
resolveUnderFourSeconds(1000).then(message => console.log(message));

// Fulfillment took so long, it was rejected
resolveUnderFourSeconds(7000).catch(message => console.error(message));

/**
 * Besides returning resolution values, you could also resolve with another promise.
 * In the example below, we create a promise 'p' that will be rejected in three seconds.
 * We also create a promise 'p2' that will be resolved with 'p' in a second. Since 'p' is
 * still two seconds out, resolving 'p2' won't have an immediate effect. Two seconds later,
 * when 'p' is rejected, 'p2' will be rejected as well, with the same rejection reason that
 * was provided to 'p'.
 */

let p = new Promise((resolve, reject) => {
    console.log('Entered in the promise which will be rejected');

    setTimeout(() => {
        reject(new Error('Failed to resolve promise'))
    }, 3000);
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(p)
    }, 1000);
});

p2.then(result => console.log(result));
p2.catch(error => console.error(error));

/**
 * Sometimes life can be simple. When you already know the value a promise should be 
 * fulfilled - or similarly, if you already know the rejection reason, you can use the
 * promises as the examples below.
 */

// To resolve a promise
Promise.resolve('foo')

// To reject a promise
Promise.reject(reason);