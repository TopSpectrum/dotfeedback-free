define('js-src/tests/unit/utils/test-utility-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/utils');
  QUnit.test('unit/utils/test-utility-test.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/test-utility-test.js should pass jshint.');
  });
});