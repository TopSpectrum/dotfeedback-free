import Ember from 'ember';
import WizardStepMixinMixin from 'javascript/mixins/wizard-step-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | wizard step mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let WizardStepMixinObject = Ember.Object.extend(WizardStepMixinMixin);
  let subject = WizardStepMixinObject.create();
  assert.ok(subject);
});
