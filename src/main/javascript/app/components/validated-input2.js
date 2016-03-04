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

  initializeObservers: function() {
    this.set('muteErrors', this.get('muteInitialErrors'));
    this.get('errors');
  }.on('init'),

  hasLabel: Ember.computed('label', function() {
    return !Ember.isNone(this.get('label'));
  }),

  hasSubtext: Ember.computed('subtext', function() {
    return !Ember.isNone(this.get('subtext'));
  }),

  hasFeedback: Ember.computed('muteErrors', 'hasErrors', 'feedback', 'errors', 'errors.[]', function() {
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

  isTextarea: Ember.computed('type', function() {
    return this.get('type') === 'textarea';
  }),

  hasErrors: Ember.computed('muteErrors', 'errors', 'errors.[]', function() {
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

  actions: {
    enter() {
      this.sendAction('enter');
    },

    showErrors() {
      this.set('muteErrors', false);
    }
  }

});
