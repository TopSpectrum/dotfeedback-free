import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wizard-step-verify-email', 'Integration | Component | wizard step verify email', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wizard-step-verify-email}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wizard-step-verify-email}}
      template block text
    {{/wizard-step-verify-email}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
