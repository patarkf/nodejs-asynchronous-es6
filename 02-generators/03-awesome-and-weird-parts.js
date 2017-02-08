/**
 * 03 - Generators functions and objects
 *
 * This section aims to show the most curious parts about using generators.
 */
'use strict';

/**
 * Generators objects come with a couple more methods besides .next(). These are .return
 * and .throw. We've already covered .next extensively, but not quite. You could also use
 * .next(value) to send values into the generator.
 * 
 * In the example below we'll make a magic 8-ball generator. First off, you'll need some
 * answers. 
 * 
 * There are 20 possible answers, as you can see here: https://en.wikipedia.org/wiki/Magic_8-Ball#Possible_answers
 */
let answers = [
  'It is certain', 'It is decidedly so', 'Without a doubt',
  'Yes definitely', 'You may rely on it', 'As I see it, yes',
  'Most likely', 'Outlook good', 'Yes', 'Signs point to yes',
  'Reply hazy try again', 'Ask again later', 'Better not tell you now',
  'Cannot predict now', 'Concentrate and ask again',
  'Don\'t count on it', 'My reply is no', 'My sources say no',
  'Outlook not so good', 'Very doubtful'
]

function answer() {
  return answers[Math.floor(Math.random() * answers.length)]
}

/**
 * The following generator function can act as a "genie" that answers any questions you might
 * have for them. Note how we discard the first result from g.next(). That's because the first
 * call to .next enters the generator and there's no yield expression waiting to capture the
 * value from g.next(value).
 */
function* chat() {
    while (true) {
        let question = yield '[Genie]' + answer();
        console.log(question);
    }
}

let g = chat();
g.next();

console.log(g.next('[Me] Will us have an amazing weekend or will we have to work?').value)

/**
 * Inversion of Control:
 * 
 * We could have the Genie be in control, and have the generator ask the questions.
 * How would that look like? At first, you might think that the code below is
 * unconventional, but in fact, most libraries build around generators work by
 * inventing responsibility. 
 * 
 * On this way, letting the generator deal with the flow control means you can just worry
 * about the thing you want to iterate over, and you can delegate how to itereate over it.
 */
function* chat() {
  yield '[Me] Will ES6 die a painful death?';
  yield '[Me] How youuu doing?';
}

let g = chat();
while (true) {
  let question = g.next();
  if (question.done) {
    break;
  }

  console.log(question.value);
  console.log('[Genie] ' + answer());
  
  // <- '[Me] Will ES6 die a painful death?'
  // <- '[Genie] Very doubtful'
  // <- '[Me] How youuu doing?'
  // <- '[Genie] My reply is no'
}

/**
 * Dealing with asynchronous flows.
 */
function genie (questions) {
  let g = questions();
  pull();
  function pull () {
    let question = g.next();
    if (question.done) {
      return;
    }
    ask(question.value, pull);
  }

  function ask (q, next) {
    xhr('https://computer.genie/?q=' + encodeURIComponent(q), got);
    function got (err, res, body) {
      if (err) {
        // todo
      }
      console.log(q);
      console.log('[Genie] ' + body.answer);
      
      next();
    }
  }
}

/**
 * Even though we’ve just made our genie method asynchronous and are now using an API to fetch
 * responses to the user’s questions, the way the consumer uses the genie library by passing a 
 * questions generator function remains unchanged.
 */