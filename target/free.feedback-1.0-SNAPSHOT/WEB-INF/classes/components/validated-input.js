"use strict";

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {

  classNames: ['form-group'],
  classNameBindings: ['hasError', 'hasFeedback'],

  muteInitialErrors: true,
  muteErrors: false,

  disabled: false,

  feedback: false,
  errors: null,

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

  isTextarea: Ember.computed('type', function () {
    return this.get('type') === 'textarea';
  }),

  hasErrors: Ember.computed('muteErrors', 'errors', 'errors.[]', function () {
    if (this.get('muteErrors')) {
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
      var previouslyValidValue = '';

      $el.on('input', function (e) {
        var $el = Ember.$(e.currentTarget);
        var value = $el.val();

        if (!mask(value)) {
          $el.val(previouslyValidValue);

          Ember.Logger.debug('Did not validate! ' + value + ":" + previouslyValidValue);
          return;
        }

        previouslyValidValue = value;
      });
    });

  }.on('didInsertElement'),

  actions: {
    enter() {
      this.sendAction('enter');
    },

    showErrors() {
      this.set('muteErrors', false);
    },
    focus() {
      var $el = this.$().find('input');

      $el.focus().select();
    }
  }

});
