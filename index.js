var noop = function(){};

/**
 *
 * getUniform
 * get function returning [0, 1) uniform distribution
 *
 * @param (function) fn: random function generating 0 to 1 at random, optional.
 *                       default: Math.random
 *        (string)   fn: random function name, you can use one of ["xorshift"]
 *
 * @return fn
 *
 */
function getUniform(fn) {
  var type = typeof fn;
  return (type == 'function')
       ? fn
       : (type == "string" && fn == "xorshift")
         ? xorshift
         : Math.random;
}


/**
 * normalRandom
 *
 * get random value from a normal distribution
 * @param (number) mean
 * @param (number) dev : standard deviation
 * @param (function) fn: random function generating 0 to 1 at random, optional.
 *                       default: Math.random
 *        (string)   fn: random function name, you can use one of ["xorshift"]
 *                       
 * @return number
 *
 */
function normalRandom(mean, dev, fn) {
  fn = getUniform(fn);
  var a = fn(), b = fn();
  with (Math) {
    return dev * sqrt(-2 * log(a)) * sin(2 * PI * b) + mean;
  }
}


/**
 * randomInt
 *
 * get random integer range from min to max
 * @param (number) max : default 1
 * @param (number) min : default 0
 * @param (function) fn: random function generating 0 to 1 at random, optional.
 *                       default: Math.random
 *        (string)   fn: random function name, you can use one of ["xorshift"]
 *                       
 * @return number
 *
 */
function randomInt(max, min, fn) {
  max = (typeof max != "number") ? 1 : parseInt(max);
  min = (typeof min != "number") ? 0 : parseInt(min);
  fn = getUniform(fn);
  if (max <= min) throw new Error("max " + max + " must be larger than min " + min);
  //console.assert(max > min);
  var range = max - min + 1;
  return Math.floor(fn() * range) + min;
}


/**
 * WeightedSelection
 *
 * author : shinout <shinout310@gmail.com>
 * description : choose one of the given values at random, but weighted.
 *
 * example: 
 *
 *  var WeightedSelection = require("weightedselection");
 *
 *  // set hash table of choices
 *  var sel = new WeightedSelection({
 *    "hoge" : 1,
 *    "fuga" : 5,
 *    "piyo" : 2
 *  });
 *
 *  // get one of the given keys
 *  var a = sel.random(); // one of "hoge", "fuga", "piyo".
 *
 *  the probability to get "hoge" = 1 / (1 + 5 + 2) = 1/8
 *                         "fuga" = 5 / (1 + 5 + 2) = 5/8
 *                         "piyo" = 2 / (1 + 5 + 2) = 2/8
 *
 **/
function WeightedSelection(table, fn) {
  // TODO validate first.
	
  this.names = Object.keys(table).filter(function(name) {
		return (table[name] > 0);
	});

  this.hists = this.names.map((function() {
    var total = 0;
    return function(v) {
      total += Number(table[v]);
      return total;
    };
  })());
  this.hists.unshift(0);

  this.fn = getUniform(fn);
}


/**
 * get total number of cases
 **/
Object.defineProperty(WeightedSelection.prototype, "total", {
  get: function() {
    return this.hists[this.hists.length -1];
  },
  set: noop
});

/**
 * length: get the number of valid keys
 **/
Object.defineProperty(WeightedSelection.prototype, "length", {
  get: function() {
    return this.names.length;
  },
  set: noop
});

/**
 * get a random value
 **/
WeightedSelection.prototype.random = function(val) {
  var stpos  = 0;
  var endpos = this.hists.length -1;

  // TODO filter NaN, over max
  var val = (val != null) ? Number(val) : Math.floor(this.fn() * this.hists[endpos]);

  // binary search
  var cenpos, cenval, sub;
  while ( endpos - stpos > 1) {
    cenpos = Math.floor((stpos + endpos) / 2);
    cenval = this.hists[cenpos];
    sub = val - cenval;
    if (sub > 0) {
      stpos = cenpos;
    }
    else if (sub < 0) {
      endpos = cenpos;
    }
    // exact match
    else {
      return this.names[cenpos];
    }
  }
  return this.names[stpos];
};


/**
 * internal random generator
 **/
WeightedSelection.prototype.fn = Math.random;


/**
 * XORShift
 *
 * random number generator generator
 * @param (Number) seed
 * @param (boolean) normalize : if true, range becomes 0 to 1 
 * @return function : random number generator
 *
 */
function XORShift(seed, normalize) {
  /* prepare seed */
  seed = (typeof seed == Number) ? seed : Math.floor(Math.random() * 10000000);
  var sq = Math.sqrt(Math.random() + seed);
  var num = sq.toString().replace('.', '').replace(/^0*/, '');
  var len = num.length;
  num = Number(num);

  var w = (num + new Date().getTime() >>> ((seed + len) % 8)) >>> 0,
      x = 123456789,
      y = 362436069,
      z = 521288629;

  /**
   * random number generator
   * @return if normalize is false, integer ( 0 to 0x100000000 )
   *         if normalize is true , float ( 0 to 1 )
   */
  return function() {
    var t = x ^ (x << 11);
    x = y; y = z; z = w;
    w = ((w ^ (w >>> 19)) ^ (t ^ (t>>>8))) >>> 0;
    return (normalize) ? w/0x100000000 : w;
  }
}

var xorshift = XORShift(new Date().getTime(), true);


module.exports = {
  getUniform        : getUniform,
  normalRandom      : normalRandom,
  XORShift          : XORShift,
  xorshift          : xorshift,
  randomInt         : randomInt,
  WeightedSelection : WeightedSelection
};
