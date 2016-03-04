define('js-src/tests/validators/local/email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - validators/local');
  QUnit.test('validators/local/email.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'validators/local/email.js should pass jshint.');
  });
});