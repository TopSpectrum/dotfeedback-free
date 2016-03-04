define('js-src/tests/routes/step-check-email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/step-check-email.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/step-check-email.js should pass jshint.');
  });
});