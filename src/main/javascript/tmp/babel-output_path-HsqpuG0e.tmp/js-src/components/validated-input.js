define('js-src/components/validated-input', ['exports', 'ember', 'ember-component-inbound-actions/inbound-actions'], function (exports, _ember, _emberComponentInboundActionsInboundActions) {
  "use strict";

  exports['default'] = _ember['default'].Component.extend(_emberComponentInboundActionsInboundActions['default'], {

    classNames: ['form-group'],
    classNameBindings: ['hasError', 'hasFeedback'],

    muteInitialErrors: true,
    muteErrors: false,

    disabled: false,

    feedback: false,
    errors: null,

    initializeObservers: (function () {
      this.set('muteErrors', this.get('muteInitialErrors'));
      this.get('errors');
    }).on('init'),

    hasLabel: _ember['default'].computed('label', function () {
      return !_ember['default'].isNone(this.get('label'));
    }),

    hasSubtext: _ember['default'].computed('subtext', function () {
      return !_ember['default'].isNone(this.get('subtext'));
    }),

    hasFeedback: _ember['default'].computed('muteErrors', 'hasErrors', 'feedback', 'errors', 'errors.[]', function () {
      var feedback = this.get('feedback');

      if (false === feedback) {
        return false;
      } else if (true === feedback) {
        return true;
      } else if ('auto' === feedback) {
        var muteErrors = this.get('muteErrors');
        var errors = this.get('errors') || [];
        var hasErrors = errors.length > 0;
        var decision = !(hasErrors && muteErrors);

        return decision;
      }
    }),

    isTextarea: _ember['default'].computed('type', function () {
      return this.get('type') === 'textarea';
    }),

    hasErrors: _ember['default'].computed('muteErrors', 'errors', 'errors.[]', function () {
      if (this.get('muteErrors')) {
        return false;
      }

      var errors = this.get('errors');

      if (errors) {
        return errors.length > 0;
      } else {
        return false;
      }
    }),

    initializeMask: (function () {
      var mask = this.get('mask');

      _ember['default'].Logger.debug('initializeMask', mask);

      if (!mask) {
        _ember['default'].Logger.debug('no mask');
        return;
      }

      if (_ember['default'].typeOf(mask) !== 'string') {
        _ember['default'].Logger.debug('no mask: not string');
        return;
      }

      var regex = new RegExp(mask);

      mask = function (input) {
        if (_ember['default'].typeOf(input) !== 'string') {
          return false;
        }

        return regex.test(input);
      };

      var $el = this.$().find('input');

      _ember['default'].run.later(this, function () {
        var previouslyValidValue = '';

        $el.on('input', function (e) {
          var $el = _ember['default'].$(e.currentTarget);
          var value = $el.val();

          if (!mask(value)) {
            $el.val(previouslyValidValue);

            _ember['default'].Logger.debug('Did not validate! ' + value + ":" + previouslyValidValue);
            return;
          }

          previouslyValidValue = value;
        });
      });
    }).on('didInsertElement'),

    actions: {
      enter: function enter() {
        this.sendAction('enter');
      },

      showErrors: function showErrors() {
        this.set('muteErrors', false);
      },
      focus: function focus() {
        var $el = this.$().find('input');

        $el.focus().select();
      }
    }

  });
});