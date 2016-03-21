import Ember from 'ember';
import CookieInitializer from 'javascript/initializers/cookie';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | cookie', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  CookieInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
