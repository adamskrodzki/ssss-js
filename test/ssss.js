/* global QUnit */
var SSSS = require('../ssss.js')
var BN = require('bignumber.js')

QUnit.test('0 is zero', function (assert) {
  var foo = new SSSS(2, 4)
  var a = new BN("0x3982784893279afb8218093271749812309");
  var zero = new BN("0");
  var b = foo.field_add(a,zero);
  assert.equal( a.toString(),  b.toString())
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
  console.log('Combined using same obj: ' + secretOut)
  assert.equal(secretOut, secretIn)

  // Single argument ctor (only for combining)
  var foo2 = new SSSS(threshold)
  secretOut = foo2.combine(keys.slice(0, threshold))
  console.log('Combined using new obj: ' + secretOut)
  assert.equal(secretOut, secretIn)
})

QUnit.test('encode decode hex', function (assert) {
  var threshold = 3
  var numKeys = 6
  var inputIsHex = true
  var foo = new SSSS(threshold, numKeys, inputIsHex)

  var secretIn = '7bcd123411223344'
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
