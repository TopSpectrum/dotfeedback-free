"use strict";

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {

    classNames: ['form-group'],
    classNameBindings: ['hasErrors:has-error', 'hasFeedback', 'focusedClassBinding'],

    muteInitialErrors: true,
    muteErrors: false,

    focused_value: false,

    disabled: false,

    feedback: false,
    errors: null,

    inputClass: Ember.computed('focused_value', 'inputClasses', function() {
        let focused = this.get('focused_value');
        let classes = this.get('inputClasses') || '';

        return 'form-control ' + (focused ? 'focused ' : '') + classes;
    }),

    focusedClassBinding: Ember.computed('focused', function() {
        var focused = this.get('focused');

        if (focused) {
            return 'focused';
        } else {
            return '';
        }
    }),

    initializeObservers: function () {
        this.set('muteErrors', this.get('muteInitialErrors'));
        this.get('errors');
    }.on('init'),

    hasLabel: Ember.computed('label', function () {
        return !Ember.isNone(this.get('label'));
    }),

    hasSubtext: Ember.computed('subtext', function () {
        return !Ember.isNone(this.get('subtext'));
    }),

    hasFeedback: Ember.computed('muteErrors', 'hasErrors', 'feedback', 'errors', 'errors.[]', function () {
        let feedback = this.get('feedback');

        if (false === feedback) {
            return false;
        } else if (true === feedback) {
            return true;
        } else if ('auto' === feedback) {
            let muteErrors = this.get('muteErrors');
            let errors = this.get('errors') || [];
            let hasErrors = (errors.length > 0);
            let decision = !((hasErrors && muteErrors));

            return decision;
        }
    }),

    isPhoneNumber: Ember.computed('type', function() {
        return this.get('type') === 'tel';
    }),

    isTextarea: Ember.computed('type', function () {
        return this.get('type') === 'textarea';
    }),

    hasErrors: Ember.computed('muteErrors', 'touched', 'muteInitialErrors', 'errors', 'errors.[]', function () {
        if (this.get('muteErrors')) {
            return false;
        }

        if (this.get('muteInitialErrors') && !this.get('touched')) {
            return false;
        }

        let errors = this.get('errors');

        if (errors) {
            return (errors.length > 0);
        } else {
            return false;
        }
    }),

    initializeMask: function () {
        var mask = this.get('mask');

        Ember.Logger.debug('initializeMask', mask);

        if (!mask) {
            Ember.Logger.debug('no mask');
            return;
        }

        if (Ember.typeOf(mask) !== 'string') {
            Ember.Logger.debug('no mask: not string');
            return;
        }

        let regex = new RegExp(mask);

        mask = function (input) {
            if (Ember.typeOf(input) !== 'string') {
                return false;
            }

            return regex.test(input);
        };

        var $el = this.$().find('input');

        Ember.run.later(this, function () {
            let scope = this;
            let previouslyValidValue = $el.val();

            $el.on('keypress', function(e) {
                var key = (e.keyCode || e.charCode);

                if (key === 46) {
                    scope.sendAction('dot');
                }
            });

            $el.on('input', function (/*e*/) {

                let value = $el.val();

                if (null === previouslyValidValue) {
                    previouslyValidValue = value;
                }

                if (!mask(value)) {
                    $el.val(previouslyValidValue);

                    Ember.Logger.debug(`Did not validate! (new:${value}) (prev:${previouslyValidValue}`);
                    return;
                }

                previouslyValidValue = value;
            });
        });

    }.on('didInsertElement'),

    actions: {
        focused() {
            this.set('focused_value', true);
            this.set('touched', true);

            this.sendAction('focused');
        },

        blurred() {
            this.set('focused_value', false);

            this.sendAction('blurred');
        },

        enter() {
            this.sendAction('enter');
        },

        blur() {
            this.$()
                .find('input')
                .blur()
        },

        focus() {
            this.$()
                .find('input')
                .focus()
                .select();
        }
    }

});
