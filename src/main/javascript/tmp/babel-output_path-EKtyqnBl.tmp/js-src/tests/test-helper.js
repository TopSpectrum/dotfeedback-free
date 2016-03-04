define('js-src/tests/test-helper', ['exports', 'js-src/tests/helpers/resolver', 'ember-qunit'], function (exports, _jsSrcTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_jsSrcTestsHelpersResolver['default']);
});