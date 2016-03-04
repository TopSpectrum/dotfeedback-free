define('js-src/tests/components/validated-input2.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/validated-input2.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/validated-input2.js should pass jshint.\ncomponents/validated-input2.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});