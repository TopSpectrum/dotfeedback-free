import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wizard-step-referral-code', 'Integration | Component | wizard step referral code', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wizard-step-referral-code}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wizard-step-referral-code}}
      template block text
    {{/wizard-step-referral-code}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
