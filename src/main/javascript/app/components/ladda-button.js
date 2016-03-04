"use strict";

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {

  tagName: 'button',
  classNames: 'btn ladda-button',
  attributeBindings: ['data-style', 'data-spinner-size', 'type', 'disabled', 'aria-disabled'],

  'data-spinner-size': 35,
  'data-style': 'slide-right',

  spinning: false,

  init: function () {
    this._super();

    this.get('spinning');
  },

  setPositionToRelative: Ember.on('didInsertElement', function () {
    this.$().css('position', 'relative');

    this.spinningObserver();

    Ember.Logger.debug('initializeSpinner:', this.get('spinning'));
    Ember.Logger.debug('initializeDisabled:', this.get('disabled'));
    Ember.Logger.debug('initializeAria:', this.get('aria-disabled'));

    if (this.get('disabled')) {
      this.$().attr('disabled', 'disabled');
    }
  }),

  submit() {
    this.sendActionOnce();
  },

  click() {
    this.sendActionOnce();
  },

  doubleClick() {
    this.sendActionOnce();
  },

  sendActionOnce() {
    Ember.run.once(this, '_sendAction');
  },

  _sendAction() {
    let spinning = this.get('spinning');
    let disabled = this.get('disabled');

    Ember.Logger.debug('spinning ' + spinning);
    Ember.Logger.debug('disabled ' + disabled);
    if (!disabled && !spinning) {
      this.sendAction();
    }
  },

  spinningObserver: Ember.observer('spinning', function () {
    var element = this.get('element');
    if (!element) {
      Ember.Logger.debug('The element does not exist yet. Spinning was called too soon.');
    }

    let ladda = this.get('_ladda');
    if (!ladda) {
      ladda = Ladda.create(element);
      this.set('_ladda', ladda);
    }

    if (ladda.isLoading() === this.get('spinning')) {
      return;
    }

    if (this.get('spinning')) {
      Ember.Logger.debug('starting');
      ladda.start();
    } else {
      Ember.Logger.debug('stopping');
      ladda.stop();
    }

    //console.log('disabled-state:', this.get('disabled'), this.get('spinning'));

    if (this.get('disabled')) {
      this.$().attr('disabled', 'disabled');
    }
  })
});
