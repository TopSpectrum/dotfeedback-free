define('js-src/tests/controllers/step-select-domains.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/step-select-domains.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/step-select-domains.js should pass jshint.\ncontrollers/step-select-domains.js: line 85, col 73, Confusing use of \'!\'.\ncontrollers/step-select-domains.js: line 108, col 11, Missing semicolon.\n\n2 errors');
  });
});