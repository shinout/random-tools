random-tools
==========
random utils in JS

----------------
* [0.0.1]: release

Sample
----------------

### Installation ###
    git clone git://github.com/shinout/browser.git

    OR

    npm install random-tools

### Usage ###
#### get random int ####
    var randomInt = require('random-tools').randomInt;
    var a = randomInt(3); // one of [0, 1, 2, 3] in the same probability
    var a = randomInt(3, 1); // one of [1, 2, 3] in the same probability
    var a = randomInt(100, 96); // one of [96, 97, 98, 99, 100] in the same probability


#### get random number from a normal distribution ####
    var normalRandom = require('random-tools').normalRandom;
    var a = normalRandom(50, 10); // get a random number from N(50, 10)


#### weighted selection ####
    var WeightedSelection = require("random-tools").WeightedSelection;
  
    // set hash table of choices
    var sel = new WeightedSelection({
      "hoge" : 1,
      "fuga" : 5,
      "piyo" : 2,
      "poge" : 0
    });

    // get one of the given keys
    var a = sel.random(); // one of "hoge", "fuga", "piyo"
  
    /**
     * the probability to get "hoge" = 1 / (1 + 5 + 2) = 1/8
     *                        "fuga" = 5 / (1 + 5 + 2) = 5/8
     *                        "piyo" = 2 / (1 + 5 + 2) = 2/8
     *                        "poge" = 0 / (1 + 5 + 2) = 0/8 = 0
     */

    // get the number of valid keys
    var len = sel.length; // 3. "poge" is not counted.
  
    // get total number of cases
    var total = sel.total; // 8.  = 1 + 5 + 2 + 0


#### XORShift ####
    var XORShift = require('random-tools').XORShift;

    // 1st arg: seed, 
    // 2nd arg: normalize to uniform distribution of [0, 1)
    var random = XORShift(new Date().getTime(), true);
    var a = random(); // get a random number from uniform distribution [0, 1)


#### use XORShift internally for each random method ####
    var a = randomInt(3, 0, "xorshift"); // one of [0, 1, 2, 3] using XORShift algorithm
    var b = normalRandom(40, 10, "xorshift"); // N(40, 10) using XORShift algorithm
    var c = new WeightedSelection({a: 1, b: 3}, "xorshift"); // using XORShift algorithm
