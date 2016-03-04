define('js-src/tests/models/whois.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/whois.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/whois.js should pass jshint.');
  });
});