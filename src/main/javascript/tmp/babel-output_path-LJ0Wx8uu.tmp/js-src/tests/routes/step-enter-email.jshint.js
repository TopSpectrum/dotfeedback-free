define('js-src/tests/routes/step-enter-email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/step-enter-email.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/step-enter-email.js should pass jshint.\nroutes/step-enter-email.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});