define('js-src/tests/routes/complete.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/complete.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/complete.js should pass jshint.');
  });
});