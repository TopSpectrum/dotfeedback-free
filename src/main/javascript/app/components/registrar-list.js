"use strict";

import Ember from "ember";
import InboundActions from "ember-component-inbound-actions/inbound-actions";

export default Ember.Component.extend(InboundActions, {

    actions: {

        attemptNext() {
            var $el = this.$().find('[name="registrar"][checked]');
            var value = $el.val();

            if (Ember.isBlank(value)) {
                return;
            }

            this.sendAction('action', value);
        }
    }
});
