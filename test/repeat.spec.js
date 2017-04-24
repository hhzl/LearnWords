/* global describe, it */
const assert = require('assert');
const Repeat = require('../app/js/actions/repeat').Repeat;

describe('Repeat', () => {
  // it('check for number', () => {
  //   assert.equal(Utils.isNumber(1), true);
  // });
  it('check for random number', () => {
    assert.equal(Repeat.getRandomInt(1, 1), 1);
  });
});
