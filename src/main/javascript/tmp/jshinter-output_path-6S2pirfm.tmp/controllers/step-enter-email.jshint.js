QUnit.module('JSHint - controllers');
QUnit.test('controllers/step-enter-email.js should pass jshint', function(assert) { 
  assert.expect(1);
  assert.ok(false, 'controllers/step-enter-email.js should pass jshint.\ncontrollers/step-enter-email.js: line 1, col 1, Use the function form of "use strict".\ncontrollers/step-enter-email.js: line 58, col 11, \'fullDomainName\' is defined but never used.\n\n2 errors'); 
});
