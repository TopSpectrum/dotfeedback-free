define('js-src/tests/controllers/checkout.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/checkout.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/checkout.js should pass jshint.');
  });
});