/**
 * 05 - Leveraging Promise.all and Promise.race
 * 
 * Explaining with examples how to pay a promise with another one and
 * also how to pass data through the callbacks.
 */
'use strict';

/**
 * Module dependencies.
 * 
 * @constant {Module} request Request-Promise <https://github.com/request/request-promise>
 * @constant {Module} http Default HTTP node module <https://nodejs.org/api/http.html>
 */
const request = require('request-promise');
const http    = require('http');

/**
 * Local constants.
 * 
 * @constant {String} url Static Google URL.
 * @constant {String} twitterUrl Static Twitter URL
 */
const googleUrl  = 'http://google.com';
const twitterUrl = 'http://twitter.com';

/**
 * A common scenario - specially for those used to Node.js - is to have a dependency on things A and
 * B before being able to do thing C. As shown in the example below:
 */
http.get(googleUrl, (google) => {
    http.get(twitterUrl, (twitter) => {
        console.log(google.statusCode, twitter.statusCode);
    });
});

/**
 * A different approach would be run in series, since there is no reason to wait on Google's response
 * before pulling Twitter's. But still ridiculously long.
 */
let results = {};

http.get(googleUrl, google => {
    results.google = google;
    done();
});

http.get(twitterUrl, twitter => {
    results.twitter = twitter;
    done();
})

function done() {
    if (Object.keys(results).length < 2) {
        return
    }

    console.log(results.google.statusCode, results.twitter.statusCode);
}

/**
 * You could also use external libraries such as contra or async. But promsies already 
 * make the "run this after this other thing in series" use case very easy, using .then
 * as we saw in several examples earlier. For the "run things concurrently" use case, 
 * we can use Promise.all.
 */

let googleOptions = {
    method: 'GET',
    uri: googleUrl,
    resolveWithFullResponse: true
};

let twitterOptions = {
    method: 'GET',
    uri: twitterUrl,
    resolveWithFullResponse: true
};

Promise.all([
  request(googleOptions),
  request(twitterOptions)
])
  .then(responses => responses.map(response => response.statusCode))
  .then(status => console.log(status.join(', ')))


/**
 * Note that even if a single dependency is rejected, the Promise.all method will be rejected 
 * entirely as well.
 * 
 * In summary, Promise.all has two possible outcomes:
 * - Settle with a singl rejection 'reason' as soon as one of its dependencies is rejected;
 * - Settle with all fulfillment 'results' as soon as all of its dependencies are fulfilled.
 */
Promise.all([
  Promise.reject(),
  request(googleOptions),
  request(twitterOptions)
])
  .then(responses => responses.map(response => response.statusCode))
  .then(status => console.log(status.join(', ')))

/**
 * There's also Promise.race, which is similar to Promise.all, except the first promise to settle
 * will "win" the race, and its value will be passed along to branches of the race. 
 */
Promise.race([
    request(googleOptions),
    request(twitterOptions)
])
    .then(response => console.log(response.statusCode))

/**
 * Rejections will also finish the race, and the race promise will be rejected. As a closing 
 * note we may indicate that this could be useful for scenarios where we want to time out a 
 * promise we otherwise have no control over. For instance, the following race does make sense.
 */
let p = Promise.race([
    request(googleOptions),
    new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('request timeout')), 5000)
     })
])
p.then(response => console.log(response))
p.catch(error => console.log(error))