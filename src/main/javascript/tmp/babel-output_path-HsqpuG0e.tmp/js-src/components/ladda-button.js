define('js-src/components/ladda-button', ['exports', 'ember', 'ember-component-inbound-actions/inbound-actions'], function (exports, _ember, _emberComponentInboundActionsInboundActions) {
  "use strict";

  exports['default'] = _ember['default'].Component.extend(_emberComponentInboundActionsInboundActions['default'], {

    tagName: 'button',
    classNames: 'btn ladda-button',
    attributeBindings: ['data-style', 'data-spinner-size', 'type', 'disabled', 'aria-disabled'],

    'data-spinner-size': 35,
    'data-style': 'slide-right',

    spinning: false,

    init: function init() {
      this._super();

      this.get('spinning');
    },

    setPositionToRelative: _ember['default'].on('didInsertElement', function () {
      this.$().css('position', 'relative');

      this.spinningObserver();

      _ember['default'].Logger.debug('initializeSpinner:', this.get('spinning'));
      _ember['default'].Logger.debug('initializeDisabled:', this.get('disabled'));
      _ember['default'].Logger.debug('initializeAria:', this.get('aria-disabled'));

      if (this.get('disabled')) {
        this.$().attr('disabled', 'disabled');
      }
    }),

    submit: function submit() {
      this.sendActionOnce();
    },

    click: function click() {
      this.sendActionOnce();
    },

    doubleClick: function doubleClick() {
      this.sendActionOnce();
    },

    sendActionOnce: function sendActionOnce() {
      _ember['default'].run.once(this, '_sendAction');
    },

    _sendAction: function _sendAction() {
      var spinning = this.get('spinning');
      var disabled = this.get('disabled');

      _ember['default'].Logger.debug('spinning ' + spinning);
      _ember['default'].Logger.debug('disabled ' + disabled);
      if (!disabled && !spinning) {
        this.sendAction();
      }
    },

    spinningObserver: _ember['default'].observer('spinning', function () {
      var element = this.get('element');
      if (!element) {
        _ember['default'].Logger.debug('The element does not exist yet. Spinning was called too soon.');
      }

      var ladda = this.get('_ladda');
      if (!ladda) {
        ladda = Ladda.create(element);
        this.set('_ladda', ladda);
      }

      if (ladda.isLoading() === this.get('spinning')) {
        return;
      }

      if (this.get('spinning')) {
        _ember['default'].Logger.debug('starting');
        ladda.start();
      } else {
        _ember['default'].Logger.debug('stopping');
        ladda.stop();
      }

      //console.log('disabled-state:', this.get('disabled'), this.get('spinning'));

      if (this.get('disabled')) {
        this.$().attr('disabled', 'disabled');
      }
    })
  });
});