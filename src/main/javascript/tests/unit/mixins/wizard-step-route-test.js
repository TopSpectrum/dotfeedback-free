import Ember from 'ember';
import WizardStepRouteMixin from 'javascript/mixins/wizard-step-route';
import { module, test } from 'qunit';

module('Unit | Mixin | wizard step route');

// Replace this with your real tests.
test('it works', function(assert) {
  let WizardStepRouteObject = Ember.Object.extend(WizardStepRouteMixin);
  let subject = WizardStepRouteObject.create();
  assert.ok(subject);
});
