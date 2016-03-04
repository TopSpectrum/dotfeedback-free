define('js-src/tests/components/ladda-button.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/ladda-button.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/ladda-button.js should pass jshint.\ncomponents/ladda-button.js: line 1, col 1, Use the function form of "use strict".\ncomponents/ladda-button.js: line 72, col 15, \'Ladda\' is not defined.\n\n2 errors');
  });
});