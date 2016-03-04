define('js-src/tests/routes/checkout.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/checkout.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/checkout.js should pass jshint.\nroutes/checkout.js: line 14, col 7, Missing semicolon.\n\n1 error');
  });
});