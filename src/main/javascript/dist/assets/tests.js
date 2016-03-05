define('javascript/tests/adapters/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - adapters/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass jshint.');
  });
});
define('javascript/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('javascript/tests/components/ladda-button.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/ladda-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/ladda-button.js should pass jshint.\ncomponents/ladda-button.js: line 1, col 1, Use the function form of "use strict".\ncomponents/ladda-button.js: line 72, col 15, \'Ladda\' is not defined.\n\n2 errors');
  });
});
define('javascript/tests/components/registrar-list.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/registrar-list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/registrar-list.js should pass jshint.');
  });
});
define('javascript/tests/components/validated-input.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/validated-input.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/validated-input.js should pass jshint.\ncomponents/validated-input.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});
define('javascript/tests/components/validated-input2.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/validated-input2.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/validated-input2.js should pass jshint.\ncomponents/validated-input2.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});
define('javascript/tests/components/whois-table.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/whois-table.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/whois-table.js should pass jshint.');
  });
});
define('javascript/tests/controllers/checkout.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers/checkout.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/checkout.js should pass jshint.');
  });
});
define('javascript/tests/controllers/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/index.js should pass jshint.\ncontrollers/index.js: line 2, col 28, \'validator\' is defined but never used.\n\n1 error');
  });
});
define('javascript/tests/controllers/step-enter-email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers/step-enter-email.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/step-enter-email.js should pass jshint.\ncontrollers/step-enter-email.js: line 1, col 1, Use the function form of "use strict".\ncontrollers/step-enter-email.js: line 58, col 11, \'fullDomainName\' is defined but never used.\n\n2 errors');
  });
});
define('javascript/tests/controllers/step-select-domains.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers/step-select-domains.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/step-select-domains.js should pass jshint.\ncontrollers/step-select-domains.js: line 274, col 17, \'err\' is defined but never used.\ncontrollers/step-select-domains.js: line 38, col 10, \'sanitizeCustomerDomainName\' is defined but never used.\n\n2 errors');
  });
});
define('javascript/tests/controllers/step-select-registrar.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - controllers/step-select-registrar.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/step-select-registrar.js should pass jshint.');
  });
});
define('javascript/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('javascript/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('javascript/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _emberSimpleAuthAuthenticatorsTest) {
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _emberSimpleAuthAuthenticatorsTest['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  ;

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  ;

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }

  ;
});
define('javascript/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'javascript/tests/helpers/start-app', 'javascript/tests/helpers/destroy-app'], function (exports, _qunit, _javascriptTestsHelpersStartApp, _javascriptTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _javascriptTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        (0, _javascriptTestsHelpersDestroyApp['default'])(this.application);

        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }
      }
    });
  };
});
define('javascript/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('javascript/tests/helpers/resolver', ['exports', 'javascript/resolver', 'javascript/config/environment'], function (exports, _javascriptResolver, _javascriptConfigEnvironment) {

  var resolver = _javascriptResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _javascriptConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _javascriptConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('javascript/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('javascript/tests/helpers/start-app', ['exports', 'ember', 'javascript/app', 'javascript/config/environment'], function (exports, _ember, _javascriptApp, _javascriptConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _javascriptConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _javascriptApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('javascript/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('javascript/tests/helpers/validate-properties', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {
  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;

  var run = _ember['default'].run;

  function validateValues(object, propertyName, values, isTestForValid) {
    var promise = null;
    var validatedValues = [];

    values.forEach(function (value) {
      function handleValidation(errors) {
        var hasErrors = object.get('errors.' + propertyName + '.firstObject');
        if (hasErrors && !isTestForValid || !hasErrors && isTestForValid) {
          validatedValues.push(value);
        }
      }

      run(object, 'set', propertyName, value);

      var objectPromise = null;
      run(function () {
        objectPromise = object.validate().then(handleValidation, handleValidation);
      });

      // Since we are setting the values in a different run loop as we are validating them,
      // we need to chain the promises so that they run sequentially. The wrong value will
      // be validated if the promises execute concurrently
      promise = promise ? promise.then(objectPromise) : objectPromise;
    });

    return promise.then(function () {
      return validatedValues;
    });
  }

  function testPropertyValues(propertyName, values, isTestForValid, context) {
    var validOrInvalid = isTestForValid ? 'Valid' : 'Invalid';
    var testName = validOrInvalid + ' ' + propertyName;

    (0, _emberQunit.test)(testName, function (assert) {
      var object = this.subject();

      if (context && typeof context === 'function') {
        context(object);
      }

      // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
      // 'undefined' strings in the assert message.
      var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
      var assertMessage = 'Expected ' + propertyName + ' to have ' + validOrInvalid.toLowerCase() + ' values: ' + valuesString;

      return validateValues(object, propertyName, values, isTestForValid).then(function (validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
    });
  }

  function testValidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, true, context);
  }

  function testInvalidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, false, context);
  }
});
define('javascript/tests/integration/components/ladda-button-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('ladda-button', 'Integration | Component | ladda button', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 16
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'ladda-button', ['loc', [null, [1, 0], [1, 16]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:"
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.1',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'ladda-button', [], [], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('javascript/tests/integration/components/ladda-button-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/ladda-button-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/ladda-button-test.js should pass jshint.');
  });
});
define('javascript/tests/integration/components/registrar-list-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('registrar-list', 'Integration | Component | registrar list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 18
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'registrar-list', ['loc', [null, [1, 0], [1, 18]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:"
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.1',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'registrar-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 23]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('javascript/tests/integration/components/registrar-list-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/registrar-list-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/registrar-list-test.js should pass jshint.');
  });
});
define('javascript/tests/integration/components/validated-input-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('validated-input', 'Integration | Component | validated input', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'validated-input', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:"
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.1',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'validated-input', [], [], 0, null, ['loc', [null, [2, 4], [4, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('javascript/tests/integration/components/validated-input-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/validated-input-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/validated-input-test.js should pass jshint.');
  });
});
define('javascript/tests/integration/components/whois-table-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('whois-table', 'Integration | Component | whois table', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'whois-table', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:"
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.1',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.1',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'whois-table', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('javascript/tests/integration/components/whois-table-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/whois-table-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/whois-table-test.js should pass jshint.');
  });
});
define('javascript/tests/models/availability.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models/availability.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/availability.js should pass jshint.');
  });
});
define('javascript/tests/models/referral-code.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models/referral-code.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/referral-code.js should pass jshint.');
  });
});
define('javascript/tests/models/reservation.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models/reservation.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/reservation.js should pass jshint.\nmodels/reservation.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});
define('javascript/tests/models/whois.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - models/whois.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/whois.js should pass jshint.');
  });
});
define('javascript/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('javascript/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('javascript/tests/routes/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 52, col 9, \'store\' is defined but never used.\nroutes/application.js: line 3, col 5, \'REFERRAL_CODE_OPTIONS_KEY\' is defined but never used.\n\n2 errors');
  });
});
define('javascript/tests/routes/checkout.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/checkout.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/checkout.js should pass jshint.\nroutes/checkout.js: line 14, col 7, Missing semicolon.\n\n1 error');
  });
});
define('javascript/tests/routes/complete.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/complete.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/complete.js should pass jshint.');
  });
});
define('javascript/tests/routes/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass jshint.');
  });
});
define('javascript/tests/routes/step-check-email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/step-check-email.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/step-check-email.js should pass jshint.');
  });
});
define('javascript/tests/routes/step-enter-email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/step-enter-email.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/step-enter-email.js should pass jshint.\nroutes/step-enter-email.js: line 1, col 1, Use the function form of "use strict".\n\n1 error');
  });
});
define('javascript/tests/routes/step-select-domains.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/step-select-domains.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/step-select-domains.js should pass jshint.\nroutes/step-select-domains.js: line 19, col 21, \'transition\' is defined but never used.\nroutes/step-select-domains.js: line 59, col 24, \'err\' is defined but never used.\n\n2 errors');
  });
});
define('javascript/tests/routes/step-select-registrar.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/step-select-registrar.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/step-select-registrar.js should pass jshint.');
  });
});
define('javascript/tests/routes/step-submitting.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/step-submitting.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/step-submitting.js should pass jshint.');
  });
});
define('javascript/tests/serializers/application.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - serializers/application.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass jshint.');
  });
});
define('javascript/tests/test-helper', ['exports', 'javascript/tests/helpers/resolver', 'ember-qunit'], function (exports, _javascriptTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_javascriptTestsHelpersResolver['default']);
});
define('javascript/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/application-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/checkout-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:checkout', 'Unit | Controller | checkout', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/checkout-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/checkout-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/checkout-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:index', 'Unit | Controller | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/index-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/step-check-email-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:step-check-email', 'Unit | Controller | step check email', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/step-check-email-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/step-check-email-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/step-check-email-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/step-enter-email-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:step-enter-email', 'Unit | Controller | step enter email', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/step-enter-email-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/step-enter-email-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/step-enter-email-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/step-select-domains-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:step-select-domains', 'Unit | Controller | step select domains', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/step-select-domains-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/step-select-domains-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/step-select-domains-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/controllers/step-select-registrar-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:step-select-registrar', 'Unit | Controller | step select registrar', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('javascript/tests/unit/controllers/step-select-registrar-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/controllers/step-select-registrar-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/step-select-registrar-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/initializers/cookie-test', ['exports', 'ember', 'javascript/initializers/cookie', 'qunit'], function (exports, _ember, _javascriptInitializersCookie, _qunit) {

  var application = undefined;

  (0, _qunit.module)('Unit | Initializer | cookie', {
    beforeEach: function beforeEach() {
      _ember['default'].run(function () {
        application = _ember['default'].Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    _javascriptInitializersCookie['default'].initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('javascript/tests/unit/initializers/cookie-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/initializers/cookie-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/cookie-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/instance-initializers/referral-code-test', ['exports', 'ember', 'javascript/instance-initializers/referral-code', 'qunit', 'javascript/tests/helpers/destroy-app'], function (exports, _ember, _javascriptInstanceInitializersReferralCode, _qunit, _javascriptTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Instance Initializer | referral code', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.appInstance = _this.application.buildInstance();
      });
    },
    afterEach: function afterEach() {
      _ember['default'].run(this.appInstance, 'destroy');
      (0, _javascriptTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _javascriptInstanceInitializersReferralCode.initialize)(this.appInstance);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('javascript/tests/unit/instance-initializers/referral-code-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/instance-initializers/referral-code-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/referral-code-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/models/availability-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('availability', 'Unit | Model | availability', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('javascript/tests/unit/models/availability-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/models/availability-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/availability-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/models/referral-code-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('referral-code', 'Unit | Model | referral code', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('javascript/tests/unit/models/referral-code-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/models/referral-code-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/referral-code-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/models/reservation-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('reservation', 'Unit | Model | reservation', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('javascript/tests/unit/models/reservation-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/models/reservation-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/reservation-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/models/whois-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('whois', 'Unit | Model | whois', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('javascript/tests/unit/models/whois-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/models/whois-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/whois-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/application-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/checkout-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:checkout', 'Unit | Route | checkout', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/checkout-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/checkout-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/checkout-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/complete-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:complete', 'Unit | Route | complete', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/complete-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/complete-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/complete-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/step-accept-domain-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:step-accept-domain', 'Unit | Route | step accept domain', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/step-accept-domain-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/step-accept-domain-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/step-accept-domain-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/step-check-email-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:step-check-email', 'Unit | Route | step check email', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/step-check-email-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/step-check-email-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/step-check-email-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/step-enter-email-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:step-enter-email', 'Unit | Route | step enter email', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/step-enter-email-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/step-enter-email-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/step-enter-email-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/step-select-registrar-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:step-select-registrar', 'Unit | Route | step select registrar', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/step-select-registrar-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/step-select-registrar-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/step-select-registrar-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/step-submitting-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:step-submitting', 'Unit | Route | step submitting', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/step-submitting-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/step-submitting-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/step-submitting-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/verification-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:verification', 'Unit | Route | verification', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/verification-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/verification-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/verification-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/routes/whois-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:whois', 'Unit | Route | whois', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('javascript/tests/unit/routes/whois-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/whois-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/whois-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/utils/test-utility-test', ['exports', 'javascript/utils/test-utility', 'qunit'], function (exports, _javascriptUtilsTestUtility, _qunit) {

  (0, _qunit.module)('Unit | Utility | test utility');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _javascriptUtilsTestUtility['default'])();
    assert.ok(result);
  });
});
define('javascript/tests/unit/utils/test-utility-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/utils/test-utility-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/test-utility-test.js should pass jshint.');
  });
});
define('javascript/tests/unit/utils/utility-test-parser-test', ['exports', 'javascript/utils/utility-test-parser', 'qunit'], function (exports, _javascriptUtilsUtilityTestParser, _qunit) {

  (0, _qunit.module)('Unit | Utility | utility test parser');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _javascriptUtilsUtilityTestParser['default'])();
    assert.ok(result);
  });
});
define('javascript/tests/unit/utils/utility-test-parser-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/utils/utility-test-parser-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/utility-test-parser-test.js should pass jshint.');
  });
});
define('javascript/tests/utils/utility-domain-json.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - utils/utility-domain-json.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/utility-domain-json.js should pass jshint.');
  });
});
define('javascript/tests/utils/utility-domain-parser.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - utils/utility-domain-parser.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/utility-domain-parser.js should pass jshint.\nutils/utility-domain-parser.js: line 10, col 17, Confusing use of \'!\'.\n\n1 error');
  });
});
define('javascript/tests/validators/local/email.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - validators/local/email.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'validators/local/email.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('javascript/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map