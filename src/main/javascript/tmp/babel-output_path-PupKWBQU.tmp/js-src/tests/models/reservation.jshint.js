define('js-src/tests/models/reservation.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/reservation.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/reservation.js should pass jshint.\nmodels/reservation.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});