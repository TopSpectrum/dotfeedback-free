define('js-src/tests/controllers/step-select-domains.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/step-select-domains.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/step-select-domains.js should pass jshint.\ncontrollers/step-select-domains.js: line 248, col 86, Missing semicolon.\ncontrollers/step-select-domains.js: line 267, col 17, \'err\' is defined but never used.\ncontrollers/step-select-domains.js: line 36, col 10, \'sanitizeCustomerDomainName\' is defined but never used.\n\n3 errors');
  });
});