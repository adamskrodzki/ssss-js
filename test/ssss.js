/* global QUnit */
var SSSS = require('../ssss.js')
var BN = require('bignumber.js')
var hexExamples = require('./randomHexes.js')

QUnit.test('0 is zero', function (assert) {
  var foo = new SSSS(2, 4, true);

  var zero = new BN("0");
  for(var i=0;i<hexExamples.length;i++){
    var a = new BN(hexExamples[i]);
    var b = foo.field_add(a,zero);
    assert.equal( a.toString(),  b.toString());
  }
})

QUnit.test('a is -a', function (assert) {
      var foo = new SSSS(2, 4, true);

  var zero = new BN("0");
  for(var i=0;i<hexExamples.length;i++){
    var a = new BN(hexExamples[i]);
    var b = foo.field_add(a,a);
    assert.equal( zero.toString(),  b.toString());
  }
})


QUnit.test('a+b = b+a', function (assert) {
      var foo = new SSSS(2, 4, true);

  var zero = new BN("0");
  for(var i=0;i<hexExamples.length-1;i++){

    var a = new BN(hexExamples[i]);
    var b = new BN(hexExamples[i+1]);
    var a_plus_b = foo.field_add(a,b);
    var b_plus_a = foo.field_add(b,a);
    assert.equal( a_plus_b.toString(),  b_plus_a.toString());
  }
})



QUnit.test('(a+b)+c = a+(b+c)', function (assert) {
      var foo = new SSSS(2, 4, true);

  var zero = new BN("0");
  for(var i=0;i<hexExamples.length-2;i++){

    var a = new BN(hexExamples[i]);
    var b = new BN(hexExamples[i+1]);
    var c = new BN(hexExamples[i+2]);
    var a_plus_b = foo.field_add(a,b);
    var b_plus_c = foo.field_add(b,c);
    var lresult = foo.field_add(a_plus_b,c);
    var rresult = foo.field_add(a,b_plus_c);
    assert.equal( lresult.toString(),  rresult.toString());
  }
})

QUnit.test('(a+b)+b = a', function (assert) {
      var foo = new SSSS(2, 4, true);

  var zero = new BN("0");
  for(var i=0;i<hexExamples.length-2;i++){

    var a = new BN(hexExamples[i]);
    var b = new BN(hexExamples[i+1]);
    var c = new BN(hexExamples[i+2]);
    var a_plus_b = foo.field_add(a,b);
    var lresult = foo.field_add(a_plus_b,b);
    assert.equal( lresult.toString(),  a.toString());
  }
})

QUnit.test('two consecutive secrets should reconstruct all 4', function (assert) {
    var threshold = 2
    var numKeys = 4
    var inputIsHex = true
    var ENCODE = 0
    var DECODE = 1

    var foo = new SSSS(threshold, numKeys, inputIsHex);

    for(var i=0;i<1/*hexExamples.length*/;i++){
        var secretIn = hexExamples[i].substr(2);
        var keys = foo.split(secretIn,"foo");

        for(var k=1;k<4;k++){
            console.log("iteration "+i+" second shard "+k);
            var reconstructed = foo.reconstruct_from_2_of_n("foo",keys[0],keys[k]);
            for(var j=0;j<reconstructed.length;j++){
                assert.equal(reconstructed[j],keys[j]);
                if(reconstructed[j]!=keys[j]){
                    console.log("error ",reconstructed[j],keys[j]);
                }
            }
        }
    }
});


QUnit.test('a*b = b*a', function (assert) {
      var foo = new SSSS(2, 4);
      foo.init(256);
  var zero = new BN("0");
  for(var i=0;i<hexExamples.length-1;i++){
    console.log('iteration '+i);
    var a = new BN(hexExamples[i]);
    var b = new BN(hexExamples[i+1]);
    var a_mult_b = foo.field_mult(a,b);
    var b_mult_a = foo.field_mult(b,a);
    assert.equal( a_mult_b.toString(),  b_mult_a.toString());
  }
})

QUnit.test('Important !!!! a*b+a*c != a*(b+c)', function (assert) {

  var foo = new SSSS(2, 4, true);
  foo.init(256);
    var a = new BN(hexExamples[1]);
    var b = new BN(hexExamples[2]);
    var c = new BN(hexExamples[3]);
    var a_mul_b = foo.field_mult(a,b);
    var a_mul_c = foo.field_mult(a,c);
    var b_plus_c = foo.field_add(b,c);
    var resultLeft = foo.field_add(a_mul_b,a_mul_c);
    var resultRight = foo.field_add(a,b_plus_c);
    assert.notEqual( resultLeft.toString(),  resultRight.toString());

})




QUnit.test('encode decode short', function (assert) {
  var threshold = 4
  var numKeys = 6
  var foo = new SSSS(threshold, numKeys)
  var secretIn = 'abcdefgh'
  var keys = foo.split(secretIn, 'tkn')
  console.log(keys)
  var secretOut = foo.combine(keys.slice(0, threshold))
  console.log('Combined using same obj: ' + secretOut)
  assert.equal(secretOut, secretIn)

  // Single argument ctor (only for combining)
  var foo2 = new SSSS(threshold)
  secretOut = foo2.combine(keys.slice(0, threshold))
  console.log('Combined using new obj: ' + secretOut)
  assert.equal(secretOut, secretIn)
})

QUnit.test('encode decode long', function (assert) {
  var threshold = 4
  var numKeys = 6
  var foo = new SSSS(threshold, numKeys)
  // var secretIn = "abcdefghiáñòâé";
  var secretIn = 'abcdefghijklmnopqrstuvwxyz'
  var keys = foo.split(secretIn, 'tkn')
  console.log(keys)
  var secretOut = foo.combine(keys.slice(0, threshold))
  assert.equal(secretOut, secretIn)

  // Single argument ctor (only for combining)
  var foo2 = new SSSS(threshold)
  secretOut = foo2.combine(keys.slice(0, threshold))
  assert.equal(secretOut, secretIn)
})
QUnit.test('encode decode hex', function (assert) {
  var threshold = 3
  var numKeys = 6
  var inputIsHex = true
  var foo = new SSSS(threshold, numKeys, inputIsHex)

  var secretIn = hexExamples[0].substr(2);
  // var secretIn = "abcd0123";
  var keys = foo.split(secretIn, 'foo')
  // console.log(keys);
  var secretOut = foo.combine(keys.slice(0, threshold))
  // console.log("Combined using same obj: " + secretOut);
  assert.equal(secretOut, secretIn)

  // When used only for combining, numKeys can be 0.
  var foo2 = new SSSS(threshold, 0, inputIsHex)
  secretOut = foo2.combine(keys.slice(0, threshold))
  // console.log("Combined using new obj: " + secretOut);
  assert.equal(secretOut, secretIn)
})

