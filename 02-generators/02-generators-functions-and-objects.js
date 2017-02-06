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

// A generator object g is built using the generator function
let g = generator();

// It's an iterable because it has an @@iterator
typeof g[Symbol.iterator] === 'function'

// It's also an iterator because it has a .next method
typeof g.next === 'function';

// The iterator for a generator object is the generator object itself
g[Symbol.iterator]() === g

// Iterates all the generator values
console.log([...g]);

// Can't iterate it again since it is already 'done'
console.log(g.next()) 

/**
 * When you create a generator, you'll get an iterator that uses the generator to
 * produce its sequence. Whenever a yield expression is reached, that value is
 * emitted by the iterator and the function execution is suspended.
 * 
 * Let's use a different example, this time with some other statements mixed in between
 * yield expressions. This is a simple generator but it behaves in an interesting enough
 * way for our purposes here.
 */
function* generator() {
    yield 'w';
    console.log('e');
    yield 'e';
    console.log('k');
    yield 'e';
    console.log('n');
    yield 'd';
    console.log('!');
}

/**
 * If we use a for..of loop, this will print 'weekend!', one character at a time, as expected:
 */
let foo = generator();
for (let weekend of foo) {
  console.log(weekend);
}

/**
 * What about using the spread [...foo] syntax? Things turn out a little different here. This
 * might be a little unexpected, but that's how generators work, everything that's not yielded
 * ends up becoming a side effect. As the sequence is being constructed, the console.log statements
 * in between yield calls are executed, and they print characters to the console before foo is spread
 * over an array. The previous example worked because we were printing characters as soon as they were
 * pulled from the sequence, instead of waiting to construct a range for the entire sequence first.
 */
let fooSpread = generator();
console.log([...fooSpread]);

/**
 * You canse also use the "yield*" to delegate to another generator function. For example, if you
 * want a very contrived way to split 'weekend' into individual characters. Since strings in ES6
 * adhere to the iterable protocol, you could do the following:
 */
function* generator() {
  yield* 'weekend'
}

console.log([...generator()]);

/**
 * Yeah, in the real world you could just do [...'weekend'], since spread supports iterables just fine.
 * Just like you could yield* a string, you can yield* anything that adheres to the iterable protocol,
 * such as generators, arrays, etc.
 */
let fooMultiplier = {
  [Symbol.iterator]: () => ({
    items: ['w', 'e', 'e', 'k', 'e', 'n', 'd'],
    next: function next() {
      return {
        done: this.items.length === 0,
        value: this.items.shift()
      }
    }
  })
}

function* multiplier(value) {
  yield value * 2;
  yield value * 3;
  yield value * 4;
  yield value * 5;
}

function* trailmix() {
  yield 0
  yield* [1, 2]
  yield* [...multiplier(2)];
  yield* multiplier(3);
  yield* fooMultiplier
}

console.log([...trailmix()]);

// [0, 1, 2, 4, 6, 8, 10, 6, 9, 12, 15, 'w', 'e', 'e', 'k', 'e', 'n', 'd']