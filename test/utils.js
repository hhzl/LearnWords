'use strict';

let assert = require('assert');
let Utils = require('../app/js/utils/utils').Utils;

describe('Utils', () => {
  it('check for number', () => {
    assert.equal(Utils.isNumber(1), true);
  });
  it('check for random number', () => {
    assert.equal(Utils.getRandomInt(1,1), 1);
  });
});
