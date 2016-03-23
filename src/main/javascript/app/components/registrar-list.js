"use strict";

import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    innerNext() {
      var $el = this.$().find('[name="registrar"][checked]');
      var value = $el.val();

      if (Ember.isBlank(value)) {
        return;
      }

      this.sendAction('action', value);
    }

  }


});
