/**
 * 01 - Generators functions and objects
 *
 * Generator is a function which returns generator objects, that can then be iterated using
 * any of kind of loops. Generator function allow you to declare a special kind of iterator.
 * These iterators can suspend execution while retaining their context.
 */
'use strict';

/**
 * Below you cand find a simple example of how to write a generator. Note the '*' after
 * 'function'. That's not a typo, that's how you mark a generator function as a generator.
 */
function* generator () {
  yield 'f'
  yield 'o'
  yield 'o'
}

/**
 * Generator objects conform to both the 'iterable' protocol and the 'iterator'
 * protocol, which means:
 */
let g = generator();

// a generator object g is built using the generator function
typeof g[Symbol.iterator] === 'function'

// it's an iterable because it has an @@iterator
typeof g.next === 'function';

// it's also an iterator because it has a .next method
g[Symbol.iterator]() === g

// the iterator for a generator object is the generator object itself
console.log(Array.from(g));

console.log([...g]);
