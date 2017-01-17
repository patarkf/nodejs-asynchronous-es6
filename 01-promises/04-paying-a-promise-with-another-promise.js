/**
 * 04 - Paying a promise with another promise
 * 
 * Explaining with examples how to pay a promise with another one and
 * also how to pass data through the callbacks.
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
 * The example below shows how we use a promise and .then another promise that will
 * only be settled once the returned promise also settles. Once that happens, we get
 * back the response from the wrapped promise, and we use the res.url to figure
*/

/**
 * @constant {String} jsonTestUrl A test url wich returns a JSON response
 */
const jsonTestUrl = 'https://jsonplaceholder.typicode.com/todos';

request(url)
    .then(response => request(jsonTestUrl))
    .then(response => console.log(response));

/**
 * You can also trasform values in promises. The example below first creates a promise
 * fulfilled with [1, 2, 3] and then has a fulfillment branch on top of that which maps
 * thoes values into [2, 4, 6]. Calling .then on that brach of the promise will produce
 * the doubled values.
 */

Promise.resolve([1, 2, 3])
    .then(values => values.map(value => value * 2))
    .then(values => console.log(values));

/**
 * The same can be applied to rejection branches. Note that if a .catch branch goes
 * smoothly without errors, then it will be fulfilled with the returned value. That 
 * means that if you still want to have an error for that branch, you should throw
 * again.
 */

Promise.reject(new Error('Database couldn\'t not connect to host 127.0.0.1'))
    .catch(error => { throw new Error('Internal Server Error') })
    .catch(error => console.info(error))