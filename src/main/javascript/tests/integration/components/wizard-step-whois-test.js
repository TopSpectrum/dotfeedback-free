import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wizard-step-whois', 'Integration | Component | wizard step whois', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wizard-step-whois}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wizard-step-whois}}
      template block text
    {{/wizard-step-whois}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
