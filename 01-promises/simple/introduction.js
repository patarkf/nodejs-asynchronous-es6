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
 * Handling errors with promises
 */

const url = 'https://jsonplaceholder.typicode.com/posts/1';

/**
 * What if an error happens in one of the reactions passed to .then? You can catch those with
 * .catch. The example in the snippet below logs the error caught when trying to access 'prop'
 * from the undefined 'a' property in 'res'.
 */
request(url)
    .then(res => res.a.prop.that.does.not.exist)
    .catch(err => console.error(err.message));

/**
 * Prints the error message only once, not twice. That's 
 * because no errors happened in the first .catch, so the 
 * rejection branch for that promise wasn't executed.
 */
request(url)
    .then(res => res.a.prop.that.does.not.exist)
    .catch(err => console.log(err.message))
    .catch(err => console.error(err.message));

/**
 * In contrast, the snippet below will print the 'err.message' twice.
 * It works by saving a reference to the promise returned by .then,
 * and then tacking two .catch reactions onto it. The second .catch
 * in the previous example was capturing erros produced in the promise
 * returned from the first .catch, while in this case both .catch
 * branch off of 'p'.
 */
let p = request(url).then(res => res.a.prop.that.does.not.exist)
p.catch(err => console.error(err.message));
p.catch(err => console.error(err.message));

/**
 * Here's another example that puts that difference on the spotlight.
 * The second catch is triggered this time because it's bound to the
 * rejection branch on the first .catch.
 */
request(url)
  .then(res => res.a.prop.that.does.not.exist)
  .catch(err => { throw new Error(err.message) })
  .catch(err => console.error(err.message))

/**
 * If the first .catch call didn't return anything, 
 * then nothing would be printed.
 */
request(url)
    .then(res => res.a.prop.that.does.not.exist)
    .catch(err => {})



/**
 * Creating a promise from scratch
 */

// Promise is fulfilled
new Promise(resolve => resolve());

// Promise is rejected
new Promise((resolve, reject) => reject());




/**
 * Resolving and rejecting values
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
 * Resolving a promise after stablished seconds
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
resolveUnderFourSeconds(1000)
    .then(message => console.log(message));

// Fulfillment took so long, it was rejected
resolveUnderFourSeconds(7000)
    .catch(message => console.error(message));



/**
 * Paying a promise with another promise
 */

const url = 'https://jsonplaceholder.typicode.com/posts/1';

function fetchData() {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) return reject(err)

            resolve(body)
        }) 
    })
}

function transformToJson(body) {
    return new Promise((resolve, reject) => {
        if (!body.length) return reject('No length')

        resolve(JSON.parse(body))
    })
}

fetchData()
    .then(body => transformToJson(body))
    .then(jsonBody => getTitleFromJson(jsonBody))
    .catch(err => console.log(err))



/**
 * Promise .all()
 */

const googleUrl  = 'http://google.com'
const twitterUrl = 'http://twitter.com'

let googleOptions = {
    method: 'GET',
    uri: googleUrl,
    resolveWithFullResponse: true
}

let twitterOptions = {
    method: 'GET',
    uri: twitterUrl,
    resolveWithFullResponse: true
}

Promise.all([
  request(googleOptions),
  request(twitterOptions)
])
  .then(responses => responses.map(response => response.statusCode))
  .then(status => console.log(status.join(', ')))


/**
 * Promise .race()
 */

const googleUrl  = 'http://google.com'
const twitterUrl = 'http://twitter.com'

let googleOptions = {
    method: 'GET',
    uri: googleUrl,
    resolveWithFullResponse: true
}

let twitterOptions = {
    method: 'GET',
    uri: twitterUrl,
    resolveWithFullResponse: true
}

Promise.race([
    request(twitterOptions),
    request(googleOptions)
])
    .then(response => {
        let originalHost = response.request.originalHost

        console.log(`Winner: ${originalHost}`)
    })