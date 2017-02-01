/**
 * 01 - Iterators and Iterables
 * 
 * A quick introduction of how Iterators and Iterables work on JavaScript.
 */
'use strict';

/**
 * 
 * Iterators:
 * 
 * Basically, an Iterator is an boject which knows how to access items from a collection one at a time,
 * while keeping track of its current position within that sequence. In JavaScript an iterator is an object
 * that prvides a next() method which returns the next item in the sequence. This method returns an objet within
 * two properties: done and value.
 * 
 * Below you can find a simple example of how an Iterator object can be created:
 */
function makeIterator(array) {
    var nextIndex = 0;

    return {
        next: function() {
            return nextIndex < array.length ?
                {value: array[nextIndex++], done: false} :
                {done: true};
        }
    }
}

/**
 * Once ititialized, the next() method can be called to access key-value pairs from
 * the object in turn:
 */
var it = makeIterator(['yo', 'ya', 'yay']);
console.log(it.next().value); // yo
console.log(it.next().value); // ya
console.log(it.next().done); // false
console.log(it.next().value); // undefined
console.log(it.next().done); // true

/**
 * Iterables:
 * 
 * An object is iterable if it defines its iteration behavior, such as what values are looped over
 * in a for..of construct. Some built-in types, such as Array or Map, have a default iteration behavior,
 * while other types (such as Object) do not.
 * 
 * In order to be iterable, an object must implement the @@iterator method, meaning that the object (or
 * one of the objects up its prototype chain) must have a property with a Symbol.iterator key:
 * 
 * Below you cand find an example of how create your own iterable object:
 */
let myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 'hey';
    yield 'ho';
    yield 'let\'s go';
}

for (let value of myIterable) {
    console.log(value);
}

// or

[...myIterable]