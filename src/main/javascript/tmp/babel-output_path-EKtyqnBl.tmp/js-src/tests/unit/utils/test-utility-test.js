define('js-src/tests/unit/utils/test-utility-test', ['exports', 'js-src/utils/test-utility', 'qunit'], function (exports, _jsSrcUtilsTestUtility, _qunit) {

  (0, _qunit.module)('Unit | Utility | test utility');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _jsSrcUtilsTestUtility['default'])();
    assert.ok(result);
  });
});