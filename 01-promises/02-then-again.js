/**
 * 02 - Then, again
 * 
 * Explaining in details how .then and .catch work in different situations.
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
    .catch(err => console.error(err.message))

/**
 * You can save a reference to any point in the promise chain. This is
 * one of the fundamental points to understand promises.
 * 
 * A last example:
 */
let p1 = request(url);
let p2 = p1.then(res => res.a.prop.that.does.not.exist);
let p3 = p2.catch(err => {});
let p4 = p3.catch(err => console.error(err.message));

/**
 * The snippet above will run on this way:
 * 
 * 1 - fetch returns a brand new p1 promise
 * 2 - p1.then returns a brand new p2 promise
 * 3 - p2.catch returns a brand new p3 promise
 * 4 - p3.catch returns a brand new p4 promise
 * 5 - When p1 is settled (fulfilled), the p1.then reaction is executed
 * 6 - After that p2, which is awaiting the pending result of p1.then is settled
 * 7 - Since p2 was rejected, p2.catch reactions are executed (instead of the p2.then branch)
 * 8 - The p3 promise from p2.catch is fulfilled, even though it doesn’t produce any value nor an error
 * 9 - Because p3 succeeded, p3.catch is never executed – the p3.then branch would’ve been used instead
 * 
 * You should think of promises as a tree structure that always start with a single promise, and you can
 * bind as many branches as you want to it and so on.
 */