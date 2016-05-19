'use strict';

import Ember from "ember";

export default Ember.Component.extend({

    classNames: 'modal fade',

    didInsertElement() {
        // Now set up the modal
        var scope = this;

        var $el = this.$().modal('hide');

        $el.on('hidden.bs.modal', function (e) {
            // do something...
            scope.set('visible', false);
        });

        $el.on('shown.bs.modal', function(e) {
            scope.set('visible', true);
        });
    },

    // This is run when the element of the view is going to be destroyed. We
    // override it here to hide the modal first.
    // http://emberjs.com/api/classes/Ember.View.html#event_willDestroyElement
    willDestroyElement() {
        this.hide();
    },

    show: function() {
        this.$().modal('show');
        this.sendAction('on-show');
    },

    hide: function() {
        this.$().modal('hide');
        this.sendAction('on-hide');
    },

    shownDidUpdate: function() {
        var visible = this.get('visible');

        if (visible) {
            this.show();
        } else {
            this.hide();
        }

    }.observes('visible'),

    actions: {
        'show': function() {
            this.show();
        },

        'on-show'() {

        },

        'save': function() {
            this.sendAction('on-save');
        },

        'hide': function() {
            this.hide();
        },

        'cancel': function() {
            this.hide();
        }
    }
});
