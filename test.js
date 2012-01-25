function test() {
  var r = require("./index");
  var n = 1000000;
  var chrs = {
    notselected1 : 0,
    chr1         : 200000,
    chr2         : 180000,
    chr3         : 170000,
    chr4         : 150000,
    chr5         : 140000,
    notselected2 : 0,
    chr6         : 120000
  };



  [undefined, "xorshift"].forEach(function(option) {
    console.log("---USING %s as a random function --", option);
    var result = {};
    var length = result.length = 5;
    var mean   = n / length;

    // randomInt test
    for (var i=0; i<n; i++) {
      var val = r.randomInt(length, 1, option);
      if (!result[val]) result[val] = 0;
      result[val]++;
    }

    console.log("result", result);

    var dev = Math.sqrt(Array.prototype.reduce.call(result, function(total, v) {
      return total + ( Math.pow(v - mean, 2) );
    }, 0) / length);

    console.log("stddev", dev)


    // WeightedSelection test
    var sel = new r.WeightedSelection(chrs, option);
    var total = Object.keys(chrs).reduce(function(t, k) {
      return t + chrs[k];
    }, 0);

    console.assert(sel.total == total);
    console.assert(sel.length, Object.keys(chrs).filter(function(k) { return (chrs[k] > 0) }).length);
    console.assert(sel);
    console.assert(sel.random(0) == 'chr1');
    console.assert(sel.random(1) == 'chr1');
    console.assert(sel.random(199999) == 'chr1');
    console.assert(sel.random(200000) == 'chr2');
    console.assert(sel.random(200001) == 'chr2');
    console.assert(sel.random(379999) == 'chr2');
    console.assert(sel.random(380000) == 'chr3');
    console.assert(sel.random(920000) == 'chr6');

    console.assert(sel.random(1920000) == 'chr6'); // OVER
    console.assert(sel.random(-1) == 'chr1'); // OVER

    var count = 0;
    const N = 100000;
    for (var i=0; i<N; i++) {
      if (sel.random() == 'chr1') {
        count++;
      }
    }
    console.log(count / N);
    console.log(chrs['chr1'] / sel.hists[sel.hists.length -1]);

    var onoffCount = 0;
    for (var i=0; i<N; i++) {
      if (r.onoff(0.3, option))  {
        onoffCount++;
      }
    }
    console.log(onoffCount / N);

    var combiCount = 0;
    var arr = "abcde".split("");
    for (var i=0; i<N; i++) {
      if (r.combination(arr, 2, option).join("") == "bd")  {
        combiCount++;
      }
    }
    console.log(combiCount/ N);

  });
}

test();
