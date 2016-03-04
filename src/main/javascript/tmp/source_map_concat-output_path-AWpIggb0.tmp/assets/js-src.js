"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('js-src/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTAdapter.extend({
    namespace: 'api/v1'
  });
});
define('js-src/app', ['exports', 'ember', 'js-src/resolver', 'ember-load-initializers', 'js-src/config/environment'], function (exports, _ember, _jsSrcResolver, _emberLoadInitializers, _jsSrcConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _jsSrcConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _jsSrcConfigEnvironment['default'].podModulePrefix,
    Resolver: _jsSrcResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _jsSrcConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('js-src/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'js-src/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _jsSrcConfigEnvironment) {

  var name = _jsSrcConfigEnvironment['default'].APP.name;
  var version = _jsSrcConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('js-src/components/fm-checkbox', ['exports', 'ember-form-master-2000/components/fm-checkbox'], function (exports, _emberFormMaster2000ComponentsFmCheckbox) {
  exports['default'] = _emberFormMaster2000ComponentsFmCheckbox['default'];
});
define('js-src/components/fm-errortext', ['exports', 'ember-form-master-2000/components/fm-errortext'], function (exports, _emberFormMaster2000ComponentsFmErrortext) {
  exports['default'] = _emberFormMaster2000ComponentsFmErrortext['default'];
});
define('js-src/components/fm-field', ['exports', 'ember-form-master-2000/components/fm-field'], function (exports, _emberFormMaster2000ComponentsFmField) {
  exports['default'] = _emberFormMaster2000ComponentsFmField['default'];
});
define('js-src/components/fm-form', ['exports', 'ember-form-master-2000/components/fm-form'], function (exports, _emberFormMaster2000ComponentsFmForm) {
  exports['default'] = _emberFormMaster2000ComponentsFmForm['default'];
});
define('js-src/components/fm-helptext', ['exports', 'ember-form-master-2000/components/fm-helptext'], function (exports, _emberFormMaster2000ComponentsFmHelptext) {
  exports['default'] = _emberFormMaster2000ComponentsFmHelptext['default'];
});
define('js-src/components/fm-input', ['exports', 'ember-form-master-2000/components/fm-input'], function (exports, _emberFormMaster2000ComponentsFmInput) {
  exports['default'] = _emberFormMaster2000ComponentsFmInput['default'];
});
define('js-src/components/fm-radio-group', ['exports', 'ember-form-master-2000/components/fm-radio-group'], function (exports, _emberFormMaster2000ComponentsFmRadioGroup) {
  exports['default'] = _emberFormMaster2000ComponentsFmRadioGroup['default'];
});
define('js-src/components/fm-radio', ['exports', 'ember-form-master-2000/components/fm-radio'], function (exports, _emberFormMaster2000ComponentsFmRadio) {
  exports['default'] = _emberFormMaster2000ComponentsFmRadio['default'];
});
define('js-src/components/fm-select', ['exports', 'ember-form-master-2000/components/fm-select'], function (exports, _emberFormMaster2000ComponentsFmSelect) {
  exports['default'] = _emberFormMaster2000ComponentsFmSelect['default'];
});
define('js-src/components/fm-submit', ['exports', 'ember-form-master-2000/components/fm-submit'], function (exports, _emberFormMaster2000ComponentsFmSubmit) {
  exports['default'] = _emberFormMaster2000ComponentsFmSubmit['default'];
});
define('js-src/components/fm-textarea', ['exports', 'ember-form-master-2000/components/fm-textarea'], function (exports, _emberFormMaster2000ComponentsFmTextarea) {
  exports['default'] = _emberFormMaster2000ComponentsFmTextarea['default'];
});
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
define('js-src/components/validated-input2', ['exports', 'ember', 'ember-component-inbound-actions/inbound-actions'], function (exports, _ember, _emberComponentInboundActionsInboundActions) {
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

    actions: {
      enter: function enter() {
        this.sendAction('enter');
      },

      showErrors: function showErrors() {
        this.set('muteErrors', false);
      }
    }

  });
});
define('js-src/components/whois-table', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('js-src/controllers/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('js-src/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('js-src/controllers/checkout', ['exports', 'ember', 'ember-validations'], function (exports, _ember, _emberValidations) {
  exports['default'] = _ember['default'].Controller.extend(_emberValidations['default'], {

    validations: {
      'model.acceptsTos': {
        acceptance: true,
        presence: true
      }
    },

    actions: {
      next: function next() {
        this.set('model.spinning', true);

        var scope = this;

        _ember['default'].RSVP.Promise.cast(_ember['default'].$.ajax({
          url: '/api/v1/checkout',
          method: 'POST'
        })).then(function () {
          scope.set('model.spinning', false);
          scope.set('model.completed', true);
          scope.transitionToRoute('complete');
        })['catch'](function () {
          alert('Failed. Please try again o contact support.');
          scope.set('model.spinning', false);
        });

        return false;
      }
    }
  });
});
define('js-src/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('js-src/controllers/step-check-email', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('js-src/controllers/step-enter-email', ['exports', 'ember', 'ember-validations', 'js-src/utils/utility-domain-parser'], function (exports, _ember, _emberValidations, _jsSrcUtilsUtilityDomainParser) {
  "use strict";

  var EMAIL_PATTERN = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]{2,10}))$/;

  exports['default'] = _ember['default'].Controller.extend(_emberValidations['default'], {

    validations: {
      'model.email': {
        presence: true,
        inline: (0, _emberValidations.validator)(function () {
          var value = this.model.get(this.property);
          if (!value) {
            return;
          }

          if (!EMAIL_PATTERN.test(value)) {
            this.errors.pushObject('Please enter a valid email');
            return;
          }

          // Trim past the @ and grab the domain.

          var index = value.indexOf('@') + 1;
          var suffix = value.substring(index);
          var parsedObject = (0, _jsSrcUtilsUtilityDomainParser['default'])(suffix);

          if (!parsedObject) {
            //  Hmm, that's not right.
            this.errors.pushObject('Please enter a valid email');
          }
        })
      }
    },

    actions: {
      next: function next() {
        if (!this.get('isValid')) {
          _ember['default'].Logger.warn("NotValid for transition");

          // TODO: We have to show the errors somehow.
          return false;
        }

        var email = this.get('model.email');
        var result = email.substring(email.indexOf('@') + 1);
        var parsedObject = (0, _jsSrcUtilsUtilityDomainParser['default'])(result);

        if (!parsedObject) {
          _ember['default'].Logger.warn('The domain name was not parsable.');
          return;
        }

        var fullDomainName = parsedObject.fullDomainName;

        this.set('model.sourceFullDomainName', parsedObject.fullDomainName);
        this.set('model.destinationCustomerDomainName', parsedObject.customerDomainName);
        this.set('model.newDestinationCustomerDomainName', parsedObject.customerDomainName);

        this.set('model.destinationFullDomainName', parsedObject.customerDomainName + '.feedback');

        _ember['default'].Logger.debug('transitioning to step-select-domains');
        this.transitionToRoute('step-select-domains');
      }
    }
  });
});
define('js-src/controllers/step-select-domains', ['exports', 'ember', 'js-src/utils/utility-domain-parser', 'ember-validations'], function (exports, _ember, _jsSrcUtilsUtilityDomainParser, _emberValidations) {

  var customerDomainNameRegex = /^[\w]+$/;

  function isValidFullDomainName(test) {
    var obj = (0, _jsSrcUtilsUtilityDomainParser['default'])(test);

    return obj ? obj.exact : false;
  }

  function isValidCustomerDomainName(test) {
    return customerDomainNameRegex.test(test);
  }

  /**
   *
   * @param {String} value
   * @returns {String|null}
   */
  function sanitizeString(value) {
    if (_ember['default'].typeOf(value) !== 'string') {
      return null;
    }

    return value.toLowerCase().trim();
  }

  function sanitizeFullDomainName(fullDomainName) {
    fullDomainName = sanitizeString(fullDomainName);

    return isValidFullDomainName(fullDomainName) ? fullDomainName : null;
  }

  function sanitizeCustomerDomainName(customerDomainName) {
    customerDomainName = sanitizeString(customerDomainName);

    return isValidCustomerDomainName(customerDomainName) ? customerDomainName : null;
  }

  exports['default'] = _ember['default'].Controller.extend(_emberValidations['default'], {

    store: _ember['default'].inject.service(),

    //region Validations
    validations: {
      'name': { presence: true },
      'email': { presence: true },
      'street': { presence: true },
      'city': { presence: true },
      'state': { presence: true },
      'postal': { presence: true },
      'country': { presence: true },
      'phone': { presence: true }
    },

    name: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.name'),
    email: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.email'),
    street: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.street'),
    city: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.city'),
    state: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.state'),
    postal: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.postal'),
    country: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.country'),
    phone: _ember['default'].computed.alias('model.sourceFullDomainNameRecord.phone'),
    //endregion

    //region Computed Properties
    newDestinationFullDomainName: _ember['default'].computed('model.newDestinationFullDomainName', function () {
      return sanitizeString(this.get('model.newDestinationFullDomainName'));
    }),

    destinationCustomerDomainName: _ember['default'].computed('model.destinationCustomerDomainName', function () {
      return sanitizeString(this.get('model.destinationCustomerDomainName'));
    }),

    newDestinationCustomerDomainName: _ember['default'].computed('model.newDestinationCustomerDomainName', function () {
      return sanitizeString(this.get('model.newDestinationCustomerDomainName'));
    }),

    availabilityStatus: _ember['default'].computed('hasDestinationAvailabilityRecord', 'model.destinationAvailabilityRecord.status', function () {
      var hasDestinationAvailabilityRecord = this.get('hasDestinationAvailabilityRecord');
      var status = this.get('model.destinationAvailabilityRecord.status');

      if (!hasDestinationAvailabilityRecord) {
        return null;
      }

      return status;
    }),
    //endregion

    //region Computed Properties that Decide
    isEditingDestination: _ember['default'].computed('newDestinationCustomerDomainName', 'destinationCustomerDomainName', function () {
      // Are we dirty?
      var computedDestinationFullDomainName = this.get('newDestinationCustomerDomainName');
      var textDestinationFullDomainName = this.get('destinationCustomerDomainName');

      return computedDestinationFullDomainName !== textDestinationFullDomainName;
    }),

    shouldShowModelingBar: _ember['default'].computed('isEditingSource', 'isFetchingWhois', 'hasSourceRecord', 'isAvailable', function () {
      var hasSourceRecord = this.get('hasSourceRecord');
      //var isFetchingWhois = this.get('isFetchingWhois');
      var isEditingSource = this.get('isEditingSource');
      //var isAvailable = this.get('isAvailable');

      return !isEditingSource && hasSourceRecord; //&& !isFetching && isAvailable;
    }),

    shouldShowWhoisTable: _ember['default'].computed('shouldShowModelingBar', function () {
      return this.get('shouldShowModelingBar');
    }),

    nextIsDisabled: _ember['default'].computed('isEditingSource', 'isFetchingWhois', 'isAvailable', function () {
      var choosing = this.get('isEditingSource');
      var fetching = this.get('isFetchingWhois');
      var available = this.get('isAvailable');

      //console.log(fetching, choosing, available, isInvalid, this.get('errors'));

      return fetching || choosing || !available;
    }),

    isFetchingSomething: _ember['default'].computed('isFetchingWhois', 'isFetchingAvailability', function () {
      var isFetchingWhois = this.get('isFetchingWhois');
      var isFetchingAvailability = this.get('isFetchingAvailability');

      return isFetchingWhois || isFetchingAvailability;
    }),

    isFetchingAvailability: _ember['default'].computed('model.fetchingDestinationAvailabilityRecord', function () {
      var count = this.get('model.fetchingDestinationAvailabilityRecord');

      if (!count || count <= 0) {
        return false;
      }

      return true;
    }),

    isFetchingWhois: _ember['default'].computed('model.fetchingSourceFullDomainNameRecord', function () {
      return this.get('model.fetchingSourceFullDomainNameRecord');
    }),

    isEditingSource: _ember['default'].computed('model.chooseDifferentSourceFullDomainNameMode', function () {
      return this.get('model.chooseDifferentSourceFullDomainNameMode');
    }),

    hasSourceRecord: _ember['default'].computed('model.sourceFullDomainNameRecord', function () {
      return !_ember['default'].isNone(this.get('model.sourceFullDomainNameRecord'));
    }),

    hasDestinationRecord: _ember['default'].computed('model.destinationFullDomainNameRecord', function () {
      return !_ember['default'].isNone(this.get('model.destinationFullDomainNameRecord'));
    }),

    hasInvalidNewDestinationCustomerDomainName: _ember['default'].computed('hasValidNewDestinationCustomerDomainName', function () {
      return !this.get('hasValidNewDestinationCustomerDomainName');
    }),

    hasValidNewDestinationCustomerDomainName: _ember['default'].computed('newDestinationCustomerDomainName', function () {
      return isValidCustomerDomainName(this.get('newDestinationCustomerDomainName'));
    }),

    hasValidNewSourceFullDomainName: _ember['default'].computed('model.newSourceFullDomainName', function () {
      var value = sanitizeFullDomainName(this.get('model.newSourceFullDomainName'));
      var parsedObject = (0, _jsSrcUtilsUtilityDomainParser['default'])(value);

      if (!parsedObject) {
        return false;
      }

      if (!parsedObject.exact) {
        // Not an exact match.
        return false;
      }

      return parsedObject.customerDomainName;
    }),

    hasInvalidNewSourceFullDomainName: _ember['default'].computed('hasValidNewSourceFullDomainName', function () {
      return !this.get('hasValidNewSourceFullDomainName');
    }),

    hasDestinationAvailabilityRecord: _ember['default'].computed('model.destinationAvailabilityRecord', 'model.destinationFullDomainName', function () {
      var destinationFullDomainName = this.get('model.destinationFullDomainName');
      var destinationAvailabilityRecordFullDomainName = this.get('model.destinationAvailabilityRecord.id');

      return destinationFullDomainName === destinationAvailabilityRecordFullDomainName;
    }),

    isAvailable: _ember['default'].computed('availabilityStatus', function () {
      var availabilityStatus = this.get('availabilityStatus');

      return availabilityStatus === 'available';
    }),
    //endregion

    //region Observers
    //clearAvailabilityRecordObserver: Ember.observer('newDestinationCustomerDomainName', function () {
    //  let customerDomainName = this.get('newDestinationCustomerDomainName');
    //
    //
    //}),

    updateNewDestinationFullDomainName: _ember['default'].observer('model.newDestinationCustomerDomainName', 'newDestinationCustomerDomainName', function () {
      var customerDomainName = this.get('newDestinationCustomerDomainName');

      if (!customerDomainName || _ember['default'].typeOf(customerDomainName) !== 'string') {
        customerDomainName = '';
      }

      var newDestinationFullDomainName = undefined;
      if (customerDomainName.length === 0) {
        newDestinationFullDomainName = null;
        // Don't clear it until it's set.
        //this.set('model.destinationAvailabilityRecord', null);
      } else {
          newDestinationFullDomainName = customerDomainName + '.feedback';
        }

      this.set('model.newDestinationFullDomainName', newDestinationFullDomainName);
    }),

    updateDestinationFullDomainName: _ember['default'].observer('destinationCustomerDomainName', function () {
      var customerDomainName = this.get('destinationCustomerDomainName');
      var value = _ember['default'].isBlank(customerDomainName) ? '' : customerDomainName + '.feedback';

      this.set('model.destinationFullDomainName', value);
    }),

    refreshAvailabilityRecordObserver: _ember['default'].observer('model.destinationFullDomainName', function () {
      //var isEditingSource = this.get('isEditingEditDestinationFullDomainName');
      //
      //if (!isEditingSource) {
      //  return;
      //}

      var valueBeforeQuery = this.get('model.destinationFullDomainName');

      var scope = this;
      var model = this.get('model');

      _ember['default'].run.debounce(this, function () {
        model.incrementProperty('fetchingDestinationAvailabilityRecord');

        console.log('i changed it', model.get('fetchingDestinationAvailabilityRecord'));

        // WE NEED TO QUERY
        scope.peekOrFind('availability', valueBeforeQuery).then(function (record) {

          // This record should always be defined....
          var valueAfterQuery = scope.get('model.destinationFullDomainName');

          if (valueBeforeQuery !== valueAfterQuery) {
            _ember['default'].Logger.warn('The values were not the same', valueBeforeQuery, valueAfterQuery);
            model.decrementProperty('fetchingDestinationAvailabilityRecord');
            // Not the same... ignore.
            return;
          }

          scope.set('model.destinationAvailabilityRecord', record);
          model.decrementProperty('fetchingDestinationAvailabilityRecord');
        })['catch'](function (err) {
          model.decrementProperty('fetchingDestinationAvailabilityRecord');
        });
      }, 50);
    }),
    //endregion

    //region Functions
    peekOrFind: function peekOrFind(recordType, recordId) {
      var record = this.store.peekRecord(recordType, recordId);
      if (record) {
        return _ember['default'].RSVP.Promise.resolve(record);
      }

      return this.store.findRecord(recordType, recordId);
    },
    //endregion

    //region Actions
    actions: {
      enterWasHitOnDestinationDomainName: function enterWasHitOnDestinationDomainName() {
        // We need to decide what to do.
        var isEditingDestination = this.get('isEditingDestination');

        if (isEditingDestination) {
          this.send('finishUpdateDestinationCustomerDomainName');
        } else {
          this.send('next');
        }
      },

      finishUpdateDestinationCustomerDomainName: function finishUpdateDestinationCustomerDomainName() {
        var allowed = this.get('hasValidNewDestinationCustomerDomainName');

        if (!allowed) {
          return false;
        }

        // TODO: Should we update more stuff?
        this.set('model.destinationCustomerDomainName', this.get('newDestinationCustomerDomainName'));
      },

      selectModelFromDomainName: function selectModelFromDomainName() {
        var model = this.get('model');
        var value = _ember['default'].get(model, 'newSourceFullDomainName');

        if (_ember['default'].isBlank(value)) {
          alert('Please enter a valid domain name');
          _ember['default'].set(model, 'chooseDifferentSourceFullDomainNameMode', false);
          return;
        }

        this.set('model.sourceFullDomainName', value);
        this.send('changeSourceFullDomainName', this.get('model'), value);

        return false;
      },

      next: function next() {
        if (this.get('nextIsDisabled')) {
          // enter was hit..
          return;
        }

        var scope = this;

        _ember['default'].Logger.debug('next');

        this.set('model.fetchingSourceFullDomainNameRecord', true);

        var reservation = this.store.createRecord('reservation', {
          sourceFullDomainName: this.get('model.sourceFullDomainName'),
          destinationFullDomainName: this.get('model.destinationFullDomainName'),

          'name': this.get('model.sourceFullDomainNameRecord.name'),
          'email': this.get('model.email'),
          //'sourceFullDomainName': DS.attr(),
          //'destinationFullDomainName': DS.attr(),
          'street': this.get('model.sourceFullDomainNameRecord.street'),
          'city': this.get('model.sourceFullDomainNameRecord.city'),
          'state': this.get('model.sourceFullDomainNameRecord.state'),
          'postal': this.get('model.sourceFullDomainNameRecord.postal'),
          'country': this.get('model.sourceFullDomainNameRecord.country'),
          'phone': this.get('model.sourceFullDomainNameRecord.phone'),
          'phoneExt': this.get('model.sourceFullDomainNameRecord.phoneExt'),
          'fax': this.get('model.sourceFullDomainNameRecord.fax'),
          'faxExt': this.get('model.sourceFullDomainNameRecord.faxExt')
          //'fingerprint': DS.attr(),
          //'remoteHost': DS.attr(),
        });

        //Ember.RSVP.Promise.cast(
        //  Ember.$.ajax({
        //    url: '/api/v1/submit',
        //    method: 'POST',
        //    data: JSON.stringify(model)
        //  }))
        reservation.save().then(function () {
          // We are ready for confirmation
          scope.set('model.fetchingSourceFullDomainNameRecord', false);
          scope.set('model.waitingOnEmail', true);

          //scope.transitionTo('step-confirmation');
          scope.transitionToRoute('step-check-email');
        })['catch'](function () {
          alert('There was a problem submitting your request. Please try again.');
          scope.set('model.fetchingSourceFullDomainNameRecord', false);
        });

        return false;
      },

      chooseDifferentSourceFullDomainName: function chooseDifferentSourceFullDomainName() {
        this.set('model.newSourceFullDomainName', this.get('model.sourceFullDomainName'));
        this.set('model.chooseDifferentSourceFullDomainNameMode', true);

        _ember['default'].run.later(this, function () {
          // We need to focus the element.
          // We need it to happen after the runloop actually executes those changes.
          this.get('selectModelFromDomainNameInput').send('focus');
        });
      }
    }
    //endregion

  });
});
define('js-src/helpers/is-equal', ['exports', 'ember-form-master-2000/helpers/is-equal'], function (exports, _emberFormMaster2000HelpersIsEqual) {
  exports['default'] = _emberFormMaster2000HelpersIsEqual['default'];
});
define('js-src/helpers/is-not', ['exports', 'ember-form-master-2000/helpers/is-not'], function (exports, _emberFormMaster2000HelpersIsNot) {
  exports['default'] = _emberFormMaster2000HelpersIsNot['default'];
});
define('js-src/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('js-src/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('js-src/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'js-src/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _jsSrcConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_jsSrcConfigEnvironment['default'].APP.name, _jsSrcConfigEnvironment['default'].APP.version)
  };
});
define('js-src/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('js-src/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('js-src/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('js-src/initializers/ember-form-master-2000', ['exports', 'ember', 'ember-form-master-2000/initializers/ember-form-master-2000'], function (exports, _ember, _emberFormMaster2000InitializersEmberFormMaster2000) {

  if (_ember['default'].libraries) {
    _ember['default'].libraries.register('Ember Form Master 2000', '2.1.4');
  }

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFormMaster2000InitializersEmberFormMaster2000['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberFormMaster2000InitializersEmberFormMaster2000.initialize;
    }
  });
});
define('js-src/initializers/ember-simple-auth', ['exports', 'ember', 'js-src/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _ember, _jsSrcConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = _jsSrcConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _jsSrcConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('js-src/initializers/export-application-global', ['exports', 'ember', 'js-src/config/environment'], function (exports, _ember, _jsSrcConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_jsSrcConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _jsSrcConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_jsSrcConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('js-src/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('js-src/initializers/resize', ['exports', 'ember-resize/services/resize', 'js-src/config/environment'], function (exports, _emberResizeServicesResize, _jsSrcConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];

    var resizeServiceDefaults = _jsSrcConfigEnvironment['default'].resizeServiceDefaults;
    var injectionFactories = resizeServiceDefaults.injectionFactories;

    application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
    application.register('service:resize', _emberResizeServicesResize['default']);
    application.inject('service:resize', 'resizeServiceDefaults', 'config:resize-service');

    injectionFactories.forEach(function (factory) {
      application.inject(factory, 'resizeService', 'service:resize');
    });
  }

  exports['default'] = {
    name: 'resize',
    initialize: initialize
  };
});
define('js-src/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('js-src/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("js-src/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('js-src/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define('js-src/mixins/resize-aware', ['exports', 'ember-resize/mixins/resize-aware'], function (exports, _emberResizeMixinsResizeAware) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberResizeMixinsResizeAware['default'];
    }
  });
});
define('js-src/models/availability', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({

    'status': _emberData['default'].attr('string', { defaultValue: 'unknown' })

  });
});
define('js-src/models/reservation', ['exports', 'ember-data'], function (exports, _emberData) {
  "use strict";

  exports['default'] = _emberData['default'].Model.extend({

    'name': _emberData['default'].attr(),
    'email': _emberData['default'].attr(),
    'sourceFullDomainName': _emberData['default'].attr(),
    'destinationFullDomainName': _emberData['default'].attr(),
    'street': _emberData['default'].attr(),
    'city': _emberData['default'].attr(),
    'state': _emberData['default'].attr(),
    'postal': _emberData['default'].attr(),
    'country': _emberData['default'].attr(),
    'phone': _emberData['default'].attr(),
    'phoneExt': _emberData['default'].attr(),
    'fax': _emberData['default'].attr(),
    'faxExt': _emberData['default'].attr(),
    'fingerprint': _emberData['default'].attr(),
    'remoteHost': _emberData['default'].attr()

  });
});
define('js-src/models/whois', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({

    'fullDomainName': _emberData['default'].attr(),
    'name': _emberData['default'].attr(),
    'organization': _emberData['default'].attr(),
    'street': _emberData['default'].attr(),
    'city': _emberData['default'].attr(),
    'state': _emberData['default'].attr(),
    'postal': _emberData['default'].attr(),
    'country': _emberData['default'].attr(),
    'phone': _emberData['default'].attr(),
    'phoneExt': _emberData['default'].attr(),
    'fax': _emberData['default'].attr(),
    'faxExt': _emberData['default'].attr(),
    'email': _emberData['default'].attr()

  });
});
define('js-src/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('js-src/router', ['exports', 'ember', 'js-src/config/environment'], function (exports, _ember, _jsSrcConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _jsSrcConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('step-enter-email', { path: '/email' });

    this.route('step-select-domains', { path: '/domains' }, function () {
      this.route('whois', {
        resetNamespace: true
      });
    });

    this.route('step-check-email');

    this.route('step-checkout', { path: '/checkout' });

    this.route('checkout');
    this.route('complete');
  });

  exports['default'] = Router;
});
define('js-src/routes/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      // A mutable object that everyone will use.
      return new _ember['default'].Object({});
    }

  });
});
define('js-src/routes/checkout', ['exports', 'ember', 'ember-validations'], function (exports, _ember, _emberValidations) {
  exports['default'] = _ember['default'].Route.extend(_emberValidations['default'], {

    model: function model() {
      return _ember['default'].RSVP.hash({
        terms: _ember['default'].RSVP.Promise.cast(_ember['default'].$.ajax({
          url: '/api/v1/checkout_terms'
        })),
        record: this.store.findAll('Reservation').then(function (reservations) {
          return reservations.objectAt(0);
        })
      });
    }
  });
});
define('js-src/routes/complete', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    //beforeModel() {
    //  var model = this.modelFor('application');
    //  var completed = Ember.get(model, 'completed');
    //
    //  if (!completed) {
    //    Ember.Logger.warn('Are not \'completed\', so returning to the index route.');
    //    this.transitionTo('index');
    //  }
    //},

    model: function model() {
      return this.modelFor('application');
    },

    actions: {
      willTransition: function willTransition(transition) {
        transition.abort();
      }
    }

  });
});
define('js-src/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    beforeModel: function beforeModel() {
      this.transitionTo('step-enter-email');
    }

  });
});
define('js-src/routes/step-check-email', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    beforeModel: function beforeModel() {
      var model = this.modelFor('application');
      var waitingOnEmail = _ember['default'].get(model, 'waitingOnEmail');

      if (!waitingOnEmail) {
        _ember['default'].Logger.warn('Are not \'waitingOnEmail\', so returning to the index route.');
        this.transitionTo('index');
      }
    },

    model: function model() {
      return this.modelFor('application');
    },

    actions: {
      willTransition: function willTransition(transition) {
        transition.abort();
      }
    }

  });
});
define('js-src/routes/step-enter-email', ['exports', 'ember'], function (exports, _ember) {
  "use strict";

  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.modelFor('application');
    }

  });
});
define('js-src/routes/step-select-domains', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    beforeModel: function beforeModel() {
      var model = this.modelFor('application');
      var sourceFullDomainName = _ember['default'].get(model, 'sourceFullDomainName');

      if (!sourceFullDomainName) {
        _ember['default'].Logger.warn('Could not determine the \'sourceFullDomainName\', so returning to the index route.');
        this.transitionTo('index');
      }
    },

    model: function model() {
      return this.modelFor('application');
    },

    afterModel: function afterModel(model, transition) {
      this.query(model);
    },

    peekAndFind: function peekAndFind(recordType, recordId) {
      var scope = this;

      return _ember['default'].RSVP.Promise.resolve(this.store.peekRecord(recordType, recordId)).then(function (record) {
        if (record) {
          return _ember['default'].RSVP.Promise.resolve(record);
        } else {
          return scope.store.findRecord(recordType, recordId);
        }
      });
    },

    query: function query(model, sourceFullDomainName) {
      if (_ember['default'].isBlank(sourceFullDomainName)) {
        sourceFullDomainName = _ember['default'].get(model, 'sourceFullDomainName');
      }

      var scope = this;
      var destinationFullDomainName = _ember['default'].get(model, 'destinationFullDomainName');

      _ember['default'].set(model, 'fetchingSourceFullDomainNameRecord', true);
      _ember['default'].set(model, 'chooseDifferentSourceFullDomainNameMode', false);

      this.peekAndFind('whois', sourceFullDomainName).then(function (whoisRecord) {
        return scope.peekAndFind('availability', destinationFullDomainName).then(function (availabilityRecord) {
          _ember['default'].set(model, 'sourceFullDomainName', sourceFullDomainName);
          _ember['default'].set(model, 'sourceFullDomainNameRecord', whoisRecord);
          _ember['default'].set(model, 'fetchingSourceFullDomainNameRecord', false);
          _ember['default'].set(model, 'sourceFullDomainNameRecord.email', _ember['default'].get(model, 'email'));
          _ember['default'].set(model, 'destinationAvailabilityRecord', availabilityRecord);
        });
      })['catch'](function (err) {
        if (console) {
          console.log(err);
        }

        alert('There was an unknown server error. Please try again.');

        _ember['default'].set(model, 'sourceFullDomainNameRecord', null);
        _ember['default'].set(model, 'fetchingSourceFullDomainNameRecord', false);
      });
    },

    actions: {
      changeSourceFullDomainName: function changeSourceFullDomainName(model, sourceFullDomainName) {
        if (_ember['default'].isBlank(sourceFullDomainName)) {
          alert('Please enter a valid domain name');
          return;
        }

        this.query(model, sourceFullDomainName);
      }
    }

    //renderTemplate: function() {
    //  this.render({
    //    outlet: 'whois'
    //  })
    //}

  });
});
define('js-src/serializers/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTSerializer.extend({
    modelNameFromPayloadKey: function modelNameFromPayloadKey(payloadKey) {
      return payloadKey;
    }
  });
});
define('js-src/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('js-src/services/fm-config', ['exports', 'ember-form-master-2000/services/fm-config'], function (exports, _emberFormMaster2000ServicesFmConfig) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFormMaster2000ServicesFmConfig['default'];
    }
  });
});
define('js-src/services/resize', ['exports', 'ember-resize/services/resize'], function (exports, _emberResizeServicesResize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberResizeServicesResize['default'];
    }
  });
});
define('js-src/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('js-src/services/validations', ['exports', 'ember'], function (exports, _ember) {

  var set = _ember['default'].set;

  exports['default'] = _ember['default'].Service.extend({
    init: function init() {
      set(this, 'cache', {});
    }
  });
});
define('js-src/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _emberSimpleAuthSessionStoresAdaptive) {
  exports['default'] = _emberSimpleAuthSessionStoresAdaptive['default'].extend();
});
define("js-src/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 74,
            "column": 0
          }
        },
        "moduleName": "js-src/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "page");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("nav");
        dom.setAttribute(el3, "class", "navbar");
        dom.setAttribute(el3, "role", "navigation");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "container");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "navbar-header");
        var el6 = dom.createTextNode("\n\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment(" LOGO ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "navbar-brand");
        dom.setAttribute(el6, "href", "/");
        dom.setAttribute(el6, "shape", "rect");
        dom.setAttribute(el6, "tabindex", "-1");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        var el8 = dom.createTextNode("Free.feedback");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /END CONTAINER ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "id", "cookie_announcement");
        dom.setAttribute(el2, "class", "container mt");
        dom.setAttribute(el2, "style", "margin-bottom: -25px; display:none;");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-sm-12");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "panel");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "panel-body");
        var el7 = dom.createTextNode("\n                        Cookies help us deliver our services. By using our services, you agree to our use of cookies.\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "panel-footer");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("button");
        dom.setAttribute(el7, "class", "btn btn-primary btn-close");
        dom.setAttribute(el7, "style", "font-size:1rem;");
        var el8 = dom.createTextNode("Got it");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7, "href", "/terms");
        dom.setAttribute(el7, "style", "margin-left: 10px;");
        var el8 = dom.createTextNode("Learn More");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "id", "wrapper");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3, "id", "content");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "vert_flex_container");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "width:100%");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "container");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "steps col-xs-12 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3");
        var el9 = dom.createTextNode("\n\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "step domains active");
        var el10 = dom.createTextNode("\n                                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createComment("");
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("footer");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-sm-12");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "pull-left");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "/");
        dom.setAttribute(el6, "data-intent", "clear_all_cookies");
        var el7 = dom.createTextNode("Clear all cookies");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "pull-right");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "ml");
        dom.setAttribute(el6, "href", "/terms");
        dom.setAttribute(el6, "tabindex", "-1");
        var el7 = dom.createTextNode("Terms");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "ml");
        dom.setAttribute(el6, "href", "/privacy");
        dom.setAttribute(el6, "tabindex", "-1");
        var el7 = dom.createTextNode("Privacy");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("<a class=\"ml\" href=\"/feedback\" tabindex=\"-1\">Feedback</a>");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 5, 1, 1, 3, 1, 1, 1, 1]), 1, 1);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [44, 34], [44, 44]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("js-src/templates/checkout-error", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 8
            },
            "end": {
              "line": 8,
              "column": 10
            }
          },
          "moduleName": "js-src/templates/checkout-error.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            Home\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/checkout-error.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        Oops. Looks like you don't have an active reservation with us. If you believe this is in error, please contact ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "mailto:ops@topspectrum.com");
        var el4 = dom.createTextNode("ops@topspectrum.com");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "link-to", ["step-enter-email"], [], 0, null, ["loc", [null, [6, 8], [8, 22]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("js-src/templates/checkout", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "js-src/templates/checkout.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          Finish\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/checkout.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Confirm ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("textarea");
        dom.setAttribute(el3, "class", "form-control");
        dom.setAttribute(el3, "style", "overflow-y: scroll; height: 100px; width: 100%;");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "target", "_blank");
        dom.setAttribute(el3, "href", "/terms");
        dom.setAttribute(el3, "class", "pull-right");
        var el4 = dom.createTextNode("View Terms");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "checkbox");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" I agree to the terms of service\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [9, 1]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element0, [11]), 1, 1);
        return morphs;
      },
      statements: [["content", "model.record.destinationFullDomainName", ["loc", [null, [2, 16], [2, 58]]]], ["inline", "whois-table", [], ["model", ["subexpr", "@mut", [["get", "model.record", ["loc", [null, [5, 26], [5, 38]]]]], [], []], "email", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [5, 45], [5, 56]]]]], [], []], "disabled", true], ["loc", [null, [5, 6], [5, 72]]]], ["content", "model.terms", ["loc", [null, [9, 93], [9, 108]]]], ["inline", "input", [], ["type", "checkbox", "name", "isAdmin", "checked", ["subexpr", "@mut", [["get", "model.acceptsTos", ["loc", [null, [18, 57], [18, 73]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "model.spinning", ["loc", [null, [18, 83], [18, 97]]]]], [], []]], ["loc", [null, [18, 10], [18, 99]]]], ["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "isInvalid", ["loc", [null, [23, 127], [23, 136]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.spinning", ["loc", [null, [23, 146], [23, 160]]]]], [], []]], 0, null, ["loc", [null, [23, 6], [25, 23]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("js-src/templates/complete", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/complete.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    Done! Your domain will be ready soon.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("js-src/templates/components/ladda-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 9
          }
        },
        "moduleName": "js-src/templates/components/ladda-button.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("js-src/templates/components/validated-input", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element2, 'class');
          morphs[1] = dom.createMorphAt(element2, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["control-label ", ["get", "labelWidthClasses", ["loc", [null, [2, 35], [2, 52]]]]]]], ["content", "label", ["loc", [null, [2, 57], [2, 66]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["control-label ", ["get", "labelWidthClasses", ["loc", [null, [4, 35], [4, 52]]]], " sr-only"]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "textarea", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [8, 19], [8, 24]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [8, 53], [8, 57]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [8, 91], [8, 102]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [8, 116], [8, 128]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [8, 152], [8, 160]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [8, 170], [8, 178]]]]], [], []]], ["loc", [null, [8, 2], [8, 180]]]]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 2
              },
              "end": {
                "line": 14,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/components/validated-input.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createMorphAt(element0, 1, 1);
            return morphs;
          },
          statements: [["attribute", "class", ["concat", [["get", "inputWidthClasses", ["loc", [null, [11, 21], [11, 38]]]]]]], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [12, 22], [12, 27]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [12, 56], [12, 60]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [12, 94], [12, 105]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [12, 119], [12, 131]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [12, 155], [12, 163]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [12, 173], [12, 181]]]]], [], []], "mask", ["subexpr", "@mut", [["get", "mask", ["loc", [null, [12, 187], [12, 191]]]]], [], []]], ["loc", [null, [12, 8], [12, 193]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 2
              },
              "end": {
                "line": 16,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/components/validated-input.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [15, 18], [15, 23]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [15, 52], [15, 56]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [15, 90], [15, 101]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [15, 115], [15, 127]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [15, 151], [15, 159]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [15, 169], [15, 177]]]]], [], []], "mask", ["subexpr", "@mut", [["get", "mask", ["loc", [null, [15, 183], [15, 187]]]]], [], []]], ["loc", [null, [15, 4], [15, 189]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 17,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "inputWidthClasses", ["loc", [null, [10, 8], [10, 25]]]]], [], 0, 1, ["loc", [null, [10, 2], [16, 9]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 19,
              "column": 0
            },
            "end": {
              "line": 21,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "subtext muted text-muted");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "subtext", ["loc", [null, [20, 43], [20, 56]]]]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 0
            },
            "end": {
              "line": 26,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback form-control-feedback-not-error");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-warning-sign form-control-feedback form-control-feedback-only-error");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 32,
                "column": 4
              },
              "end": {
                "line": 34,
                "column": 4
              }
            },
            "moduleName": "js-src/templates/components/validated-input.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["content", "error", ["loc", [null, [33, 13], [33, 22]]]]],
          locals: ["error"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 31,
              "column": 2
            },
            "end": {
              "line": 35,
              "column": 2
            }
          },
          "moduleName": "js-src/templates/components/validated-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "each", [["get", "errors", ["loc", [null, [32, 12], [32, 18]]]]], [], 0, null, ["loc", [null, [32, 4], [34, 13]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 0
          }
        },
        "moduleName": "js-src/templates/components/validated-input.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "help-block with-errors");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        morphs[3] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        morphs[5] = dom.createMorphAt(dom.childAt(fragment, [10]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasLabel", ["loc", [null, [1, 6], [1, 14]]]]], [], 0, 1, ["loc", [null, [1, 0], [5, 7]]]], ["block", "if", [["get", "isTextarea", ["loc", [null, [7, 6], [7, 16]]]]], [], 2, 3, ["loc", [null, [7, 0], [17, 7]]]], ["block", "if", [["get", "hasSubtext", ["loc", [null, [19, 6], [19, 16]]]]], [], 4, null, ["loc", [null, [19, 0], [21, 7]]]], ["block", "if", [["get", "hasFeedback", ["loc", [null, [23, 6], [23, 17]]]]], [], 5, null, ["loc", [null, [23, 0], [26, 7]]]], ["content", "yield", ["loc", [null, [28, 0], [28, 9]]]], ["block", "if", [["get", "hasErrors", ["loc", [null, [31, 8], [31, 17]]]]], [], 6, null, ["loc", [null, [31, 2], [35, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6]
    };
  })());
});
define("js-src/templates/components/validated-input2", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element2, 'class');
          morphs[1] = dom.createMorphAt(element2, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["control-label ", ["get", "labelWidthClasses", ["loc", [null, [3, 35], [3, 52]]]]]]], ["content", "label", ["loc", [null, [3, 57], [3, 66]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["control-label ", ["get", "labelWidthClasses", ["loc", [null, [5, 35], [5, 52]]]], " sr-only"]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 0
            },
            "end": {
              "line": 10,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "textarea", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [9, 19], [9, 24]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [9, 53], [9, 57]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [9, 91], [9, 102]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [9, 116], [9, 128]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [9, 152], [9, 160]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [9, 170], [9, 178]]]]], [], []]], ["loc", [null, [9, 2], [9, 180]]]]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 2
              },
              "end": {
                "line": 15,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/components/validated-input2.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createMorphAt(element0, 1, 1);
            return morphs;
          },
          statements: [["attribute", "class", ["concat", [["get", "inputWidthClasses", ["loc", [null, [12, 21], [12, 38]]]]]]], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [13, 22], [13, 27]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [13, 56], [13, 60]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [13, 94], [13, 105]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [13, 119], [13, 131]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [13, 155], [13, 163]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [13, 173], [13, 181]]]]], [], []]], ["loc", [null, [13, 8], [13, 183]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 2
              },
              "end": {
                "line": 17,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/components/validated-input2.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [16, 18], [16, 23]]]]], [], []], "focus-out", "showErrors", "type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [16, 52], [16, 56]]]]], [], []], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [16, 90], [16, 101]]]]], [], []], "autocomplete", ["subexpr", "@mut", [["get", "autocomplete", ["loc", [null, [16, 115], [16, 127]]]]], [], []], "enter", "enter", "readonly", ["subexpr", "@mut", [["get", "readonly", ["loc", [null, [16, 151], [16, 159]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [16, 169], [16, 177]]]]], [], []]], ["loc", [null, [16, 4], [16, 179]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 18,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "inputWidthClasses", ["loc", [null, [11, 8], [11, 25]]]]], [], 0, 1, ["loc", [null, [11, 2], [17, 9]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 0
            },
            "end": {
              "line": 22,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "subtext muted text-muted");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "subtext", ["loc", [null, [21, 43], [21, 56]]]]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 0
            },
            "end": {
              "line": 27,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback form-control-feedback-not-error");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-warning-sign form-control-feedback form-control-feedback-only-error");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 33,
                "column": 4
              },
              "end": {
                "line": 35,
                "column": 4
              }
            },
            "moduleName": "js-src/templates/components/validated-input2.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["content", "error", ["loc", [null, [34, 13], [34, 22]]]]],
          locals: ["error"],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 2
            },
            "end": {
              "line": 36,
              "column": 2
            }
          },
          "moduleName": "js-src/templates/components/validated-input2.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "each", [["get", "errors", ["loc", [null, [33, 12], [33, 18]]]]], [], 0, null, ["loc", [null, [33, 4], [35, 13]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 38,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/components/validated-input2.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "help-block with-errors");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(element3, 1, 1);
        morphs[1] = dom.createMorphAt(element3, 3, 3);
        morphs[2] = dom.createMorphAt(element3, 5, 5);
        morphs[3] = dom.createMorphAt(element3, 7, 7);
        morphs[4] = dom.createMorphAt(element3, 9, 9);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [11]), 1, 1);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasLabel", ["loc", [null, [2, 6], [2, 14]]]]], [], 0, 1, ["loc", [null, [2, 0], [6, 7]]]], ["block", "if", [["get", "isTextarea", ["loc", [null, [8, 6], [8, 16]]]]], [], 2, 3, ["loc", [null, [8, 0], [18, 7]]]], ["block", "if", [["get", "hasSubtext", ["loc", [null, [20, 6], [20, 16]]]]], [], 4, null, ["loc", [null, [20, 0], [22, 7]]]], ["block", "if", [["get", "hasFeedback", ["loc", [null, [24, 6], [24, 17]]]]], [], 5, null, ["loc", [null, [24, 0], [27, 7]]]], ["content", "yield", ["loc", [null, [29, 0], [29, 9]]]], ["block", "if", [["get", "hasErrors", ["loc", [null, [32, 8], [32, 17]]]]], [], 6, null, ["loc", [null, [32, 2], [36, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6]
    };
  })());
});
define("js-src/templates/components/whois-table", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "js-src/templates/components/whois-table.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "whois-table form-horizontal");
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(element1, 1, 1);
        morphs[1] = dom.createMorphAt(element1, 3, 3);
        morphs[2] = dom.createMorphAt(element1, 5, 5);
        morphs[3] = dom.createMorphAt(element1, 7, 7);
        morphs[4] = dom.createMorphAt(element1, 9, 9);
        morphs[5] = dom.createMorphAt(element1, 11, 11);
        morphs[6] = dom.createMorphAt(element1, 13, 13);
        morphs[7] = dom.createMorphAt(element1, 15, 15);
        morphs[8] = dom.createMorphAt(element2, 1, 1);
        morphs[9] = dom.createMorphAt(element2, 3, 3);
        return morphs;
      },
      statements: [["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [4, 31], [4, 42]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.email", ["loc", [null, [4, 50], [4, 62]]]]], [], []], "name", "admin_email", "label", "Email", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12", "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [4, 182], [4, 190]]]]], [], []]], ["loc", [null, [4, 6], [4, 192]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.name", ["loc", [null, [5, 31], [5, 41]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.name", ["loc", [null, [5, 49], [5, 60]]]]], [], []], "name", "admin_name", "label", "Name", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [5, 6], [5, 170]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.organization", ["loc", [null, [6, 31], [6, 49]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.organization", ["loc", [null, [6, 57], [6, 76]]]]], [], []], "name", "admin_organization", "label", "Organization", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [6, 6], [6, 202]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.street", ["loc", [null, [7, 31], [7, 43]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.street", ["loc", [null, [7, 51], [7, 64]]]]], [], []], "name", "admin_street", "label", "Street", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [7, 6], [7, 178]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.city", ["loc", [null, [8, 31], [8, 41]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.city", ["loc", [null, [8, 49], [8, 60]]]]], [], []], "name", "admin_city", "label", "City", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [8, 6], [8, 170]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.state", ["loc", [null, [10, 31], [10, 42]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.state", ["loc", [null, [10, 50], [10, 62]]]]], [], []], "name", "admin_state", "label", "State", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [10, 6], [10, 174]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.postal", ["loc", [null, [11, 31], [11, 43]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.postal", ["loc", [null, [11, 51], [11, 64]]]]], [], []], "name", "admin_postal", "label", "Postal", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [11, 6], [11, 178]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.country", ["loc", [null, [12, 31], [12, 44]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.country", ["loc", [null, [12, 52], [12, 66]]]]], [], []], "name", "admin_country", "label", "Country", "labelWidthClasses", "col-sm-3", "inputWidthClasses", "col-sm-9", "class", "col-sm-12"], ["loc", [null, [12, 6], [12, 182]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.phone", ["loc", [null, [16, 31], [16, 42]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.phone", ["loc", [null, [16, 50], [16, 62]]]]], [], []], "name", "admin_phone", "label", "Phone", "labelWidthClasses", "col-sm-4", "inputWidthClasses", "col-sm-8", "class", "col-sm-9"], ["loc", [null, [16, 6], [16, 173]]]], ["inline", "validated-input2", [], ["value", ["subexpr", "@mut", [["get", "model.phoneExt", ["loc", [null, [17, 31], [17, 45]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.phoneExt", ["loc", [null, [17, 53], [17, 68]]]]], [], []], "name", "admin_phone_ext", "inputWidthClasses", "col-sm-12", "class", "col-sm-3"], ["loc", [null, [17, 6], [17, 142]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("js-src/templates/step-check-email", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 110
          }
        },
        "moduleName": "js-src/templates/step-check-email.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("Check your email. We sent an email verification link to ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(". Click it to complete your purchase.");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
        return morphs;
      },
      statements: [["content", "model.email", ["loc", [null, [1, 56], [1, 73]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("js-src/templates/step-enter-email", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 12
              },
              "end": {
                "line": 8,
                "column": 10
              }
            },
            "moduleName": "js-src/templates/step-enter-email.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              Next\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-enter-email.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "pull-out");
          dom.setAttribute(el1, "style", "position: relative;");
          var el2 = dom.createTextNode("\n\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "btn-add-controls hidden-xxs");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "isInvalid", ["loc", [null, [6, 133], [6, 142]]]]], [], []]], 0, null, ["loc", [null, [6, 12], [8, 27]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 2
            },
            "end": {
              "line": 17,
              "column": 2
            }
          },
          "moduleName": "js-src/templates/step-enter-email.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Next\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/step-enter-email.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "pull-right visible-xxs-block");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        return morphs;
      },
      statements: [["block", "validated-input", [], ["type", "email", "label", "Enter your email address", "data-minlength", "3", "id", "domainName", "tabindex", "0", "autocomplete", "off", "placeholder", "", "value", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [2, 153], [2, 164]]]]], [], []], "enter", "next"], 0, null, ["loc", [null, [2, 0], [11, 20]]]], ["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "isInvalid", ["loc", [null, [15, 123], [15, 132]]]]], [], []]], 1, null, ["loc", [null, [15, 2], [17, 19]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("js-src/templates/step-select-domains", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 97,
                "column": 2
              },
              "end": {
                "line": 103,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "true");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" is available");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "false");
            var el3 = dom.createTextNode("Unavailable");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "reserved");
            var el3 = dom.createTextNode("Reserved");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element5 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element5, 'class');
            morphs[1] = dom.createMorphAt(dom.childAt(element5, [1]), 0, 0);
            return morphs;
          },
          statements: [["attribute", "class", ["concat", [["get", "model.destinationAvailabilityRecord.status", ["loc", [null, [98, 20], [98, 62]]]]]]], ["content", "model.destinationFullDomainName", ["loc", [null, [99, 62], [99, 97]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 114,
                    "column": 14
                  },
                  "end": {
                    "line": 116,
                    "column": 14
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  Finish\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 113,
                  "column": 12
                },
                "end": {
                  "line": 117,
                  "column": 12
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "nextIsDisabled", ["loc", [null, [114, 135], [114, 149]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "isFetchingSomething", ["loc", [null, [114, 159], [114, 178]]]]], [], []]], 0, null, ["loc", [null, [114, 14], [116, 31]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 120,
                    "column": 14
                  },
                  "end": {
                    "line": 122,
                    "column": 14
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  Check\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 119,
                  "column": 12
                },
                "end": {
                  "line": 123,
                  "column": 12
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "finishUpdateDestinationCustomerDomainName", "disabled", ["subexpr", "@mut", [["get", "hasInvalidNewDestinationCustomerDomainName", ["loc", [null, [120, 172], [120, 214]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "isFetchingSomething", ["loc", [null, [120, 224], [120, 243]]]]], [], []]], 0, null, ["loc", [null, [120, 14], [122, 31]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 109,
                "column": 2
              },
              "end": {
                "line": 126,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "pull-out");
            dom.setAttribute(el1, "style", "position: relative;");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "btn-add-controls");
            var el3 = dom.createTextNode("\n\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("          ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n  ");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element4 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(element4, 1, 1);
            morphs[1] = dom.createMorphAt(element4, 3, 3);
            return morphs;
          },
          statements: [["block", "unless", [["get", "isEditingDestination", ["loc", [null, [113, 22], [113, 42]]]]], [], 0, null, ["loc", [null, [113, 12], [117, 23]]]], ["block", "if", [["get", "isEditingDestination", ["loc", [null, [119, 18], [119, 38]]]]], [], 1, null, ["loc", [null, [119, 12], [123, 19]]]]],
          locals: [],
          templates: [child0, child1]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 95,
              "column": 0
            },
            "end": {
              "line": 127,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1, "class", "label-free-domain-name");
          var el2 = dom.createTextNode("\n      Free domain\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("con\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          return morphs;
        },
        statements: [["block", "if", [["get", "hasDestinationAvailabilityRecord", ["loc", [null, [97, 8], [97, 40]]]]], [], 0, null, ["loc", [null, [97, 2], [103, 9]]]], ["block", "validated-input", [], ["type", "text", "data-minlength", "3", "tabindex", "0", "autocomplete", "off", "placeholder", "", "value", ["subexpr", "@mut", [["get", "model.newDestinationCustomerDomainName", ["loc", [null, [109, 105], [109, 143]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.model.domainName", ["loc", [null, [109, 151], [109, 174]]]]], [], []], "enter", "enterWasHitOnDestinationDomainName", "disabled", ["subexpr", "@mut", [["get", "model.loading", ["loc", [null, [109, 227], [109, 240]]]]], [], []], "mask", "^[^.]*$"], 1, null, ["loc", [null, [109, 2], [126, 22]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 132,
              "column": 0
            },
            "end": {
              "line": 142,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-info clearfix");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createTextNode("Modeling\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" whois\n\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "href", "#");
          dom.setAttribute(el3, "class", "");
          dom.setAttribute(el3, "style", "text-decoration: underline;");
          var el4 = dom.createTextNode("change source");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n        We will use the whois record for ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" listed below. Please choose a different model domain to clone a whois record for your registration or edit the record.\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element2, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element2, [1]), 0, 0);
          morphs[1] = dom.createElementMorph(element3);
          morphs[2] = dom.createMorphAt(element1, 3, 3);
          return morphs;
        },
        statements: [["content", "model.sourceFullDomainName", ["loc", [null, [135, 20], [135, 52]]]], ["element", "action", ["chooseDifferentSourceFullDomainName"], [], ["loc", [null, [137, 24], [137, 72]]]], ["content", "model.sourceFullDomainName", ["loc", [null, [140, 41], [140, 73]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 147,
                "column": 6
              },
              "end": {
                "line": 149,
                "column": 6
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          Loading...\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 149,
                "column": 6
              },
              "end": {
                "line": 151,
                "column": 6
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "whois-table", [], ["model", ["subexpr", "@mut", [["get", "model.sourceFullDomainNameRecord", ["loc", [null, [150, 28], [150, 60]]]]], [], []], "email", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [150, 67], [150, 78]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [150, 86], [150, 92]]]]], [], []]], ["loc", [null, [150, 8], [150, 94]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 144,
              "column": 0
            },
            "end": {
              "line": 153,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "id", "whois");
          dom.setAttribute(el1, "class", "section col-sm-12");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode("Whois to be used on ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          return morphs;
        },
        statements: [["content", "model.destinationFullDomainName", ["loc", [null, [146, 32], [146, 69]]]], ["block", "if", [["get", "model.fetchingSourceFullDomainNameRecord", ["loc", [null, [147, 12], [147, 52]]]]], [], 0, 1, ["loc", [null, [147, 6], [151, 13]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 159,
                    "column": 14
                  },
                  "end": {
                    "line": 161,
                    "column": 14
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  Update\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 155,
                  "column": 4
                },
                "end": {
                  "line": 164,
                  "column": 4
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "pull-out");
              dom.setAttribute(el1, "style", "position: relative;");
              var el2 = dom.createTextNode("\n\n            ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2, "class", "btn-add-controls");
              var el3 = dom.createTextNode("\n");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("            ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
              return morphs;
            },
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "selectModelFromDomainName", "disabled", ["subexpr", "@mut", [["get", "hasInvalidNewSourceFullDomainName", ["loc", [null, [159, 156], [159, 189]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.loading", ["loc", [null, [159, 199], [159, 212]]]]], [], []]], 0, null, ["loc", [null, [159, 14], [161, 31]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 154,
                "column": 2
              },
              "end": {
                "line": 165,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "validated-input", [], ["type", "text", "label", "Enter a domain name to model the whois information after", "data-minlength", "3", "tabindex", "0", "autocomplete", "off", "placeholder", "", "value", ["subexpr", "@mut", [["get", "model.newSourceFullDomainName", ["loc", [null, [155, 172], [155, 201]]]]], [], []], "enter", "selectModelFromDomainName", "actionReceiver", ["subexpr", "@mut", [["get", "selectModelFromDomainNameInput", ["loc", [null, [155, 251], [155, 281]]]]], [], []]], 0, null, ["loc", [null, [155, 4], [164, 24]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 153,
              "column": 0
            },
            "end": {
              "line": 166,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "isEditingSource", ["loc", [null, [154, 8], [154, 23]]]]], [], 0, null, ["loc", [null, [154, 2], [165, 9]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 166,
            "column": 7
          }
        },
        "moduleName": "js-src/templates/step-select-domains.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("\n            Property\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("\n            Value\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("destinationCustomerDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("newDestinationCustomerDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("newDestinationFullDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("model.destinationFullDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("hasValidNewDestinationCustomerDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("isFetchingWhois");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("isFetchingAvailability");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("isFetchingSomething");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("isEditingSource");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("hasSourceRecord");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("model.newSourceFullDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("model.sourceFullDomainName");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("availabilityStatus");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("hasDestinationAvailabilityRecord");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("model.destinationAvailabilityRecord.id");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createTextNode("model.fetchingDestinationAvailabilityRecord");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("td");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "hidden");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "hidden");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element6 = dom.childAt(fragment, [0, 3]);
        var morphs = new Array(21);
        morphs[0] = dom.createMorphAt(dom.childAt(element6, [1, 3]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element6, [3, 3]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element6, [5, 3]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element6, [7, 3]), 0, 0);
        morphs[4] = dom.createMorphAt(dom.childAt(element6, [9, 3]), 0, 0);
        morphs[5] = dom.createMorphAt(dom.childAt(element6, [11, 3]), 0, 0);
        morphs[6] = dom.createMorphAt(dom.childAt(element6, [13, 3]), 0, 0);
        morphs[7] = dom.createMorphAt(dom.childAt(element6, [15, 3]), 0, 0);
        morphs[8] = dom.createMorphAt(dom.childAt(element6, [17, 3]), 0, 0);
        morphs[9] = dom.createMorphAt(dom.childAt(element6, [19, 3]), 0, 0);
        morphs[10] = dom.createMorphAt(dom.childAt(element6, [21, 3]), 0, 0);
        morphs[11] = dom.createMorphAt(dom.childAt(element6, [23, 3]), 0, 0);
        morphs[12] = dom.createMorphAt(dom.childAt(element6, [25, 3]), 0, 0);
        morphs[13] = dom.createMorphAt(dom.childAt(element6, [27, 3]), 0, 0);
        morphs[14] = dom.createMorphAt(dom.childAt(element6, [29, 3]), 0, 0);
        morphs[15] = dom.createMorphAt(dom.childAt(element6, [31, 3]), 0, 0);
        morphs[16] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[17] = dom.createMorphAt(dom.childAt(fragment, [4]), 0, 0);
        morphs[18] = dom.createMorphAt(dom.childAt(fragment, [6]), 0, 0);
        morphs[19] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        morphs[20] = dom.createMorphAt(fragment, 10, 10, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "destinationCustomerDomainName", ["loc", [null, [15, 12], [15, 45]]]], ["content", "newDestinationCustomerDomainName", ["loc", [null, [20, 12], [20, 48]]]], ["content", "newDestinationFullDomainName", ["loc", [null, [25, 12], [25, 44]]]], ["content", "model.destinationFullDomainName", ["loc", [null, [30, 12], [30, 47]]]], ["content", "hasValidNewDestinationCustomerDomainName", ["loc", [null, [35, 12], [35, 56]]]], ["content", "isFetchingWhois", ["loc", [null, [40, 12], [40, 31]]]], ["content", "isFetchingAvailability", ["loc", [null, [45, 12], [45, 38]]]], ["content", "isFetchingSomething", ["loc", [null, [50, 12], [50, 35]]]], ["content", "isEditingSource", ["loc", [null, [55, 12], [55, 31]]]], ["content", "hasSourceRecord", ["loc", [null, [60, 12], [60, 31]]]], ["content", "model.newSourceFullDomainName", ["loc", [null, [65, 12], [65, 45]]]], ["content", "model.sourceFullDomainName", ["loc", [null, [70, 12], [70, 42]]]], ["content", "availabilityStatus", ["loc", [null, [75, 12], [75, 34]]]], ["content", "hasDestinationAvailabilityRecord", ["loc", [null, [80, 12], [80, 48]]]], ["content", "model.destinationAvailabilityRecord.id", ["loc", [null, [85, 12], [85, 54]]]], ["content", "model.fetchingDestinationAvailabilityRecord", ["loc", [null, [90, 12], [90, 59]]]], ["block", "unless", [["get", "isEditingSource", ["loc", [null, [95, 10], [95, 25]]]]], [], 0, null, ["loc", [null, [95, 0], [127, 11]]]], ["content", "showModelingBar", ["loc", [null, [129, 20], [129, 39]]]], ["content", "isEditingEditDestinationFullDomainName", ["loc", [null, [130, 20], [130, 62]]]], ["block", "if", [["get", "shouldShowModelingBar", ["loc", [null, [132, 6], [132, 27]]]]], [], 1, null, ["loc", [null, [132, 0], [142, 7]]]], ["block", "if", [["get", "shouldShowWhoisTable", ["loc", [null, [144, 6], [144, 26]]]]], [], 2, 3, ["loc", [null, [144, 0], [166, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define("js-src/utils/utility-domain-json",["exports"],function(exports){exports["default"] = {"aaa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aaa)$/,"suffix":"aaa"}],"aarp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aarp)$/,"suffix":"aarp"}],"abarth":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abarth)$/,"suffix":"abarth"}],"abb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abb)$/,"suffix":"abb"}],"abbott":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abbott)$/,"suffix":"abbott"}],"abbvie":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abbvie)$/,"suffix":"abbvie"}],"abc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abc)$/,"suffix":"abc"}],"able":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(able)$/,"suffix":"able"}],"abogado":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abogado)$/,"suffix":"abogado"}],"abudhabi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(abudhabi)$/,"suffix":"abudhabi"}],"ac":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ac)$/,"suffix":"com.ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ac)$/,"suffix":"edu.ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ac)$/,"suffix":"gov.ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ac)$/,"suffix":"mil.ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ac)$/,"suffix":"net.ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ac)$/,"suffix":"org.ac"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac)$/,"suffix":"ac"}],"academy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(academy)$/,"suffix":"academy"}],"accenture":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(accenture)$/,"suffix":"accenture"}],"accountant":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(accountant)$/,"suffix":"accountant"}],"accountants":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(accountants)$/,"suffix":"accountants"}],"aco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aco)$/,"suffix":"aco"}],"active":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(active)$/,"suffix":"active"}],"actor":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(actor)$/,"suffix":"actor"}],"ad":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.ad)$/,"suffix":"nom.ad"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ad)$/,"suffix":"ad"}],"adac":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(adac)$/,"suffix":"adac"}],"ads":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ads)$/,"suffix":"ads"}],"adult":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(adult)$/,"suffix":"adult"}],"ae":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ae)$/,"suffix":"ac.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ae)$/,"suffix":"blogspot.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ae)$/,"suffix":"co.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ae)$/,"suffix":"gov.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ae)$/,"suffix":"mil.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ae)$/,"suffix":"net.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ae)$/,"suffix":"org.ae"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.ae)$/,"suffix":"sch.ae"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ae)$/,"suffix":"ae"}],"aeg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aeg)$/,"suffix":"aeg"}],"aero":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(accident-investigation\.aero)$/,"suffix":"accident-investigation.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(accident-prevention\.aero)$/,"suffix":"accident-prevention.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aerobatic\.aero)$/,"suffix":"aerobatic.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aeroclub\.aero)$/,"suffix":"aeroclub.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aerodrome\.aero)$/,"suffix":"aerodrome.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agents\.aero)$/,"suffix":"agents.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(air-surveillance\.aero)$/,"suffix":"air-surveillance.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(air-traffic-control\.aero)$/,"suffix":"air-traffic-control.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aircraft\.aero)$/,"suffix":"aircraft.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(airline\.aero)$/,"suffix":"airline.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(airport\.aero)$/,"suffix":"airport.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(airtraffic\.aero)$/,"suffix":"airtraffic.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ambulance\.aero)$/,"suffix":"ambulance.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amusement\.aero)$/,"suffix":"amusement.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(association\.aero)$/,"suffix":"association.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(author\.aero)$/,"suffix":"author.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ballooning\.aero)$/,"suffix":"ballooning.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(broker\.aero)$/,"suffix":"broker.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(caa\.aero)$/,"suffix":"caa.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cargo\.aero)$/,"suffix":"cargo.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(catering\.aero)$/,"suffix":"catering.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(certification\.aero)$/,"suffix":"certification.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(championship\.aero)$/,"suffix":"championship.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(charter\.aero)$/,"suffix":"charter.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(civilaviation\.aero)$/,"suffix":"civilaviation.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(club\.aero)$/,"suffix":"club.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(conference\.aero)$/,"suffix":"conference.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(consultant\.aero)$/,"suffix":"consultant.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(consulting\.aero)$/,"suffix":"consulting.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(control\.aero)$/,"suffix":"control.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(council\.aero)$/,"suffix":"council.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(crew\.aero)$/,"suffix":"crew.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(design\.aero)$/,"suffix":"design.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dgca\.aero)$/,"suffix":"dgca.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(educator\.aero)$/,"suffix":"educator.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(emergency\.aero)$/,"suffix":"emergency.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(engine\.aero)$/,"suffix":"engine.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(engineer\.aero)$/,"suffix":"engineer.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(entertainment\.aero)$/,"suffix":"entertainment.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(equipment\.aero)$/,"suffix":"equipment.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(exchange\.aero)$/,"suffix":"exchange.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(express\.aero)$/,"suffix":"express.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(federation\.aero)$/,"suffix":"federation.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flight\.aero)$/,"suffix":"flight.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(freight\.aero)$/,"suffix":"freight.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuel\.aero)$/,"suffix":"fuel.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gliding\.aero)$/,"suffix":"gliding.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(government\.aero)$/,"suffix":"government.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(groundhandling\.aero)$/,"suffix":"groundhandling.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(group\.aero)$/,"suffix":"group.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanggliding\.aero)$/,"suffix":"hanggliding.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homebuilt\.aero)$/,"suffix":"homebuilt.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(insurance\.aero)$/,"suffix":"insurance.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(journal\.aero)$/,"suffix":"journal.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(journalist\.aero)$/,"suffix":"journalist.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leasing\.aero)$/,"suffix":"leasing.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(logistics\.aero)$/,"suffix":"logistics.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(magazine\.aero)$/,"suffix":"magazine.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(maintenance\.aero)$/,"suffix":"maintenance.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(media\.aero)$/,"suffix":"media.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(microlight\.aero)$/,"suffix":"microlight.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(modelling\.aero)$/,"suffix":"modelling.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(navigation\.aero)$/,"suffix":"navigation.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(parachuting\.aero)$/,"suffix":"parachuting.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(paragliding\.aero)$/,"suffix":"paragliding.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(passenger-association\.aero)$/,"suffix":"passenger-association.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pilot\.aero)$/,"suffix":"pilot.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(press\.aero)$/,"suffix":"press.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(production\.aero)$/,"suffix":"production.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(recreation\.aero)$/,"suffix":"recreation.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(repbody\.aero)$/,"suffix":"repbody.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(res\.aero)$/,"suffix":"res.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(research\.aero)$/,"suffix":"research.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rotorcraft\.aero)$/,"suffix":"rotorcraft.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(safety\.aero)$/,"suffix":"safety.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scientist\.aero)$/,"suffix":"scientist.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(services\.aero)$/,"suffix":"services.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(show\.aero)$/,"suffix":"show.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skydiving\.aero)$/,"suffix":"skydiving.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(software\.aero)$/,"suffix":"software.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(student\.aero)$/,"suffix":"student.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trader\.aero)$/,"suffix":"trader.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trading\.aero)$/,"suffix":"trading.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trainer\.aero)$/,"suffix":"trainer.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(union\.aero)$/,"suffix":"union.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(workinggroup\.aero)$/,"suffix":"workinggroup.aero"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(works\.aero)$/,"suffix":"works.aero"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aero)$/,"suffix":"aero"}],"aetna":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aetna)$/,"suffix":"aetna"}],"af":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.af)$/,"suffix":"com.af"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.af)$/,"suffix":"edu.af"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.af)$/,"suffix":"gov.af"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.af)$/,"suffix":"net.af"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.af)$/,"suffix":"org.af"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(af)$/,"suffix":"af"}],"afamilycompany":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(afamilycompany)$/,"suffix":"afamilycompany"}],"afl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(afl)$/,"suffix":"afl"}],"africa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(africa)$/,"suffix":"africa"}],"africamagic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(africamagic)$/,"suffix":"africamagic"}],"ag":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ag)$/,"suffix":"co.ag"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ag)$/,"suffix":"com.ag"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ag)$/,"suffix":"net.ag"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.ag)$/,"suffix":"nom.ag"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ag)$/,"suffix":"org.ag"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ag)$/,"suffix":"ag"}],"agakhan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(agakhan)$/,"suffix":"agakhan"}],"agency":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(agency)$/,"suffix":"agency"}],"ai":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ai)$/,"suffix":"com.ai"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ai)$/,"suffix":"net.ai"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(off\.ai)$/,"suffix":"off.ai"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ai)$/,"suffix":"org.ai"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ai)$/,"suffix":"ai"}],"aig":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aig)$/,"suffix":"aig"}],"aigo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aigo)$/,"suffix":"aigo"}],"airbus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(airbus)$/,"suffix":"airbus"}],"airforce":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(airforce)$/,"suffix":"airforce"}],"airtel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(airtel)$/,"suffix":"airtel"}],"akdn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(akdn)$/,"suffix":"akdn"}],"al":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.al)$/,"suffix":"blogspot.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.al)$/,"suffix":"com.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.al)$/,"suffix":"edu.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.al)$/,"suffix":"gov.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.al)$/,"suffix":"mil.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.al)$/,"suffix":"net.al"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.al)$/,"suffix":"org.al"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(al)$/,"suffix":"al"}],"alfaromeo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(alfaromeo)$/,"suffix":"alfaromeo"}],"alibaba":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(alibaba)$/,"suffix":"alibaba"}],"alipay":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(alipay)$/,"suffix":"alipay"}],"allfinanz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(allfinanz)$/,"suffix":"allfinanz"}],"allstate":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(allstate)$/,"suffix":"allstate"}],"ally":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ally)$/,"suffix":"ally"}],"alsace":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(alsace)$/,"suffix":"alsace"}],"alstom":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(alstom)$/,"suffix":"alstom"}],"am":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.am)$/,"suffix":"blogspot.am"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(am)$/,"suffix":"am"}],"americanexpress":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(americanexpress)$/,"suffix":"americanexpress"}],"americanfamily":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(americanfamily)$/,"suffix":"americanfamily"}],"amex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(amex)$/,"suffix":"amex"}],"amfam":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(amfam)$/,"suffix":"amfam"}],"amica":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(amica)$/,"suffix":"amica"}],"amsterdam":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(amsterdam)$/,"suffix":"amsterdam"}],"analytics":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(analytics)$/,"suffix":"analytics"}],"android":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(android)$/,"suffix":"android"}],"anquan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(anquan)$/,"suffix":"anquan"}],"anz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(anz)$/,"suffix":"anz"}],"ao":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ao)$/,"suffix":"co.ao"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ed\.ao)$/,"suffix":"ed.ao"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gv\.ao)$/,"suffix":"gv.ao"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(it\.ao)$/,"suffix":"it.ao"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(og\.ao)$/,"suffix":"og.ao"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pb\.ao)$/,"suffix":"pb.ao"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ao)$/,"suffix":"ao"}],"aol":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aol)$/,"suffix":"aol"}],"apartments":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(apartments)$/,"suffix":"apartments"}],"app":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(app)$/,"suffix":"app"}],"apple":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(apple)$/,"suffix":"apple"}],"aq":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aq)$/,"suffix":"aq"}],"aquarelle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aquarelle)$/,"suffix":"aquarelle"}],"ar":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.ar)$/,"suffix":"blogspot.com.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ar)$/,"suffix":"com.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ar)$/,"suffix":"edu.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.ar)$/,"suffix":"gob.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ar)$/,"suffix":"gov.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.ar)$/,"suffix":"int.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ar)$/,"suffix":"mil.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ar)$/,"suffix":"net.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ar)$/,"suffix":"org.ar"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tur\.ar)$/,"suffix":"tur.ar"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ar)$/,"suffix":"ar"}],"arab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(arab)$/,"suffix":"arab"}],"aramco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aramco)$/,"suffix":"aramco"}],"archi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(archi)$/,"suffix":"archi"}],"army":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(army)$/,"suffix":"army"}],"arpa":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(e164\.arpa)$/,"suffix":"e164.arpa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in-addr\.arpa)$/,"suffix":"in-addr.arpa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ip6\.arpa)$/,"suffix":"ip6.arpa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iris\.arpa)$/,"suffix":"iris.arpa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uri\.arpa)$/,"suffix":"uri.arpa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(urn\.arpa)$/,"suffix":"urn.arpa"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(arpa)$/,"suffix":"arpa"}],"arte":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(arte)$/,"suffix":"arte"}],"as":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.as)$/,"suffix":"gov.as"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(as)$/,"suffix":"as"}],"asda":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(asda)$/,"suffix":"asda"}],"asia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(asia)$/,"suffix":"asia"}],"associates":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(associates)$/,"suffix":"associates"}],"at":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.at)$/,"suffix":"blogspot.co.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.at)$/,"suffix":"ac.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.at)$/,"suffix":"biz.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.at)$/,"suffix":"co.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gv\.at)$/,"suffix":"gv.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.at)$/,"suffix":"info.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.at)$/,"suffix":"or.at"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(priv\.at)$/,"suffix":"priv.at"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(at)$/,"suffix":"at"}],"athleta":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(athleta)$/,"suffix":"athleta"}],"attorney":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(attorney)$/,"suffix":"attorney"}],"au":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(act\.edu\.au)$/,"suffix":"act.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.au)$/,"suffix":"blogspot.com.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nsw\.edu\.au)$/,"suffix":"nsw.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nt\.edu\.au)$/,"suffix":"nt.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(qld\.edu\.au)$/,"suffix":"qld.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(qld\.gov\.au)$/,"suffix":"qld.gov.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.edu\.au)$/,"suffix":"sa.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.gov\.au)$/,"suffix":"sa.gov.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tas\.edu\.au)$/,"suffix":"tas.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tas\.gov\.au)$/,"suffix":"tas.gov.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(vic\.edu\.au)$/,"suffix":"vic.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(vic\.gov\.au)$/,"suffix":"vic.gov.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wa\.edu\.au)$/,"suffix":"wa.edu.au"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wa\.gov\.au)$/,"suffix":"wa.gov.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(act\.au)$/,"suffix":"act.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asn\.au)$/,"suffix":"asn.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.au)$/,"suffix":"com.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(conf\.au)$/,"suffix":"conf.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.au)$/,"suffix":"edu.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.au)$/,"suffix":"gov.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(id\.au)$/,"suffix":"id.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.au)$/,"suffix":"info.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.au)$/,"suffix":"net.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nsw\.au)$/,"suffix":"nsw.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nt\.au)$/,"suffix":"nt.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.au)$/,"suffix":"org.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oz\.au)$/,"suffix":"oz.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qld\.au)$/,"suffix":"qld.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.au)$/,"suffix":"sa.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tas\.au)$/,"suffix":"tas.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vic\.au)$/,"suffix":"vic.au"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wa\.au)$/,"suffix":"wa.au"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(au)$/,"suffix":"au"}],"auction":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(auction)$/,"suffix":"auction"}],"audi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(audi)$/,"suffix":"audi"}],"audible":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(audible)$/,"suffix":"audible"}],"audio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(audio)$/,"suffix":"audio"}],"auspost":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(auspost)$/,"suffix":"auspost"}],"author":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(author)$/,"suffix":"author"}],"auto":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(auto)$/,"suffix":"auto"}],"autos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(autos)$/,"suffix":"autos"}],"avianca":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(avianca)$/,"suffix":"avianca"}],"aw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.aw)$/,"suffix":"com.aw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aw)$/,"suffix":"aw"}],"aws":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(aws)$/,"suffix":"aws"}],"ax":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ax)$/,"suffix":"ax"}],"axa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(axa)$/,"suffix":"axa"}],"az":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.az)$/,"suffix":"biz.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.az)$/,"suffix":"com.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.az)$/,"suffix":"edu.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.az)$/,"suffix":"gov.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.az)$/,"suffix":"info.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.az)$/,"suffix":"int.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.az)$/,"suffix":"mil.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.az)$/,"suffix":"name.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.az)$/,"suffix":"net.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.az)$/,"suffix":"org.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pp\.az)$/,"suffix":"pp.az"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.az)$/,"suffix":"pro.az"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(az)$/,"suffix":"az"}],"azure":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(azure)$/,"suffix":"azure"}],"ba":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ba)$/,"suffix":"blogspot.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ba)$/,"suffix":"co.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ba)$/,"suffix":"com.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ba)$/,"suffix":"edu.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ba)$/,"suffix":"gov.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ba)$/,"suffix":"mil.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ba)$/,"suffix":"net.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ba)$/,"suffix":"org.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rs\.ba)$/,"suffix":"rs.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(unbi\.ba)$/,"suffix":"unbi.ba"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(unsa\.ba)$/,"suffix":"unsa.ba"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ba)$/,"suffix":"ba"}],"baby":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(baby)$/,"suffix":"baby"}],"baidu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(baidu)$/,"suffix":"baidu"}],"banamex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(banamex)$/,"suffix":"banamex"}],"bananarepublic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bananarepublic)$/,"suffix":"bananarepublic"}],"band":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(band)$/,"suffix":"band"}],"bank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bank)$/,"suffix":"bank"}],"bar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bar)$/,"suffix":"bar"}],"barcelona":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(barcelona)$/,"suffix":"barcelona"}],"barclaycard":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(barclaycard)$/,"suffix":"barclaycard"}],"barclays":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(barclays)$/,"suffix":"barclays"}],"barefoot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(barefoot)$/,"suffix":"barefoot"}],"bargains":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bargains)$/,"suffix":"bargains"}],"baseball":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(baseball)$/,"suffix":"baseball"}],"basketball":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(basketball)$/,"suffix":"basketball"}],"bauhaus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bauhaus)$/,"suffix":"bauhaus"}],"bayern":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bayern)$/,"suffix":"bayern"}],"bb":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.bb)$/,"suffix":"biz.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.bb)$/,"suffix":"co.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bb)$/,"suffix":"com.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bb)$/,"suffix":"edu.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bb)$/,"suffix":"gov.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.bb)$/,"suffix":"info.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bb)$/,"suffix":"net.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bb)$/,"suffix":"org.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(store\.bb)$/,"suffix":"store.bb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.bb)$/,"suffix":"tv.bb"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bb)$/,"suffix":"bb"}],"bbc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bbc)$/,"suffix":"bbc"}],"bbt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bbt)$/,"suffix":"bbt"}],"bbva":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bbva)$/,"suffix":"bbva"}],"bcg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bcg)$/,"suffix":"bcg"}],"bcn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bcn)$/,"suffix":"bcn"}],"bd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.bd)$/,"suffix":"bd"}],"be":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.be)$/,"suffix":"ac.be"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.be)$/,"suffix":"blogspot.be"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(be)$/,"suffix":"be"}],"beats":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(beats)$/,"suffix":"beats"}],"beauty":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(beauty)$/,"suffix":"beauty"}],"beer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(beer)$/,"suffix":"beer"}],"bentley":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bentley)$/,"suffix":"bentley"}],"berlin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(berlin)$/,"suffix":"berlin"}],"best":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(best)$/,"suffix":"best"}],"bestbuy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bestbuy)$/,"suffix":"bestbuy"}],"bet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bet)$/,"suffix":"bet"}],"bf":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bf)$/,"suffix":"gov.bf"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bf)$/,"suffix":"bf"}],"bg":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(0\.bg)$/,"suffix":"0.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(1\.bg)$/,"suffix":"1.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(2\.bg)$/,"suffix":"2.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(3\.bg)$/,"suffix":"3.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(4\.bg)$/,"suffix":"4.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(5\.bg)$/,"suffix":"5.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(6\.bg)$/,"suffix":"6.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(7\.bg)$/,"suffix":"7.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(8\.bg)$/,"suffix":"8.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(9\.bg)$/,"suffix":"9.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(a\.bg)$/,"suffix":"a.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(b\.bg)$/,"suffix":"b.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.bg)$/,"suffix":"blogspot.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(c\.bg)$/,"suffix":"c.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(d\.bg)$/,"suffix":"d.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(e\.bg)$/,"suffix":"e.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(f\.bg)$/,"suffix":"f.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(g\.bg)$/,"suffix":"g.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(h\.bg)$/,"suffix":"h.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(i\.bg)$/,"suffix":"i.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(j\.bg)$/,"suffix":"j.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k\.bg)$/,"suffix":"k.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(l\.bg)$/,"suffix":"l.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(m\.bg)$/,"suffix":"m.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(n\.bg)$/,"suffix":"n.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(o\.bg)$/,"suffix":"o.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(p\.bg)$/,"suffix":"p.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(q\.bg)$/,"suffix":"q.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(r\.bg)$/,"suffix":"r.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(s\.bg)$/,"suffix":"s.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(t\.bg)$/,"suffix":"t.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(u\.bg)$/,"suffix":"u.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(v\.bg)$/,"suffix":"v.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(w\.bg)$/,"suffix":"w.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(x\.bg)$/,"suffix":"x.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(y\.bg)$/,"suffix":"y.bg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(z\.bg)$/,"suffix":"z.bg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bg)$/,"suffix":"bg"}],"bh":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bh)$/,"suffix":"com.bh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bh)$/,"suffix":"edu.bh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bh)$/,"suffix":"gov.bh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bh)$/,"suffix":"net.bh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bh)$/,"suffix":"org.bh"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bh)$/,"suffix":"bh"}],"bharti":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bharti)$/,"suffix":"bharti"}],"bi":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.bi)$/,"suffix":"co.bi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bi)$/,"suffix":"com.bi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bi)$/,"suffix":"edu.bi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.bi)$/,"suffix":"or.bi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bi)$/,"suffix":"org.bi"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bi)$/,"suffix":"bi"}],"bible":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bible)$/,"suffix":"bible"}],"bid":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bid)$/,"suffix":"bid"}],"bike":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bike)$/,"suffix":"bike"}],"bing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bing)$/,"suffix":"bing"}],"bingo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bingo)$/,"suffix":"bingo"}],"bio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bio)$/,"suffix":"bio"}],"biz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dscloud\.biz)$/,"suffix":"dscloud.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns\.biz)$/,"suffix":"dyndns.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(for-better\.biz)$/,"suffix":"for-better.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(for-more\.biz)$/,"suffix":"for-more.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(for-some\.biz)$/,"suffix":"for-some.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(for-the\.biz)$/,"suffix":"for-the.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selfip\.biz)$/,"suffix":"selfip.biz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(webhop\.biz)$/,"suffix":"webhop.biz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz)$/,"suffix":"biz"}],"bj":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.bj)$/,"suffix":"asso.bj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barreau\.bj)$/,"suffix":"barreau.bj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.bj)$/,"suffix":"blogspot.bj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.bj)$/,"suffix":"gouv.bj"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bj)$/,"suffix":"bj"}],"black":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(black)$/,"suffix":"black"}],"blackfriday":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(blackfriday)$/,"suffix":"blackfriday"}],"blanco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(blanco)$/,"suffix":"blanco"}],"blockbuster":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(blockbuster)$/,"suffix":"blockbuster"}],"blog":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(blog)$/,"suffix":"blog"}],"bloomberg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bloomberg)$/,"suffix":"bloomberg"}],"blue":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(blue)$/,"suffix":"blue"}],"bm":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bm)$/,"suffix":"com.bm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bm)$/,"suffix":"edu.bm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bm)$/,"suffix":"gov.bm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bm)$/,"suffix":"net.bm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bm)$/,"suffix":"org.bm"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bm)$/,"suffix":"bm"}],"bms":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bms)$/,"suffix":"bms"}],"bmw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bmw)$/,"suffix":"bmw"}],"bn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.bn)$/,"suffix":"bn"}],"bnl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bnl)$/,"suffix":"bnl"}],"bnpparibas":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bnpparibas)$/,"suffix":"bnpparibas"}],"bo":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bo)$/,"suffix":"com.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bo)$/,"suffix":"edu.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.bo)$/,"suffix":"gob.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bo)$/,"suffix":"gov.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.bo)$/,"suffix":"int.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.bo)$/,"suffix":"mil.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bo)$/,"suffix":"net.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bo)$/,"suffix":"org.bo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.bo)$/,"suffix":"tv.bo"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bo)$/,"suffix":"bo"}],"boats":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boats)$/,"suffix":"boats"}],"boehringer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boehringer)$/,"suffix":"boehringer"}],"bofa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bofa)$/,"suffix":"bofa"}],"bom":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bom)$/,"suffix":"bom"}],"bond":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bond)$/,"suffix":"bond"}],"boo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boo)$/,"suffix":"boo"}],"book":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(book)$/,"suffix":"book"}],"booking":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(booking)$/,"suffix":"booking"}],"boots":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boots)$/,"suffix":"boots"}],"bosch":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bosch)$/,"suffix":"bosch"}],"bostik":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bostik)$/,"suffix":"bostik"}],"boston":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boston)$/,"suffix":"boston"}],"bot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bot)$/,"suffix":"bot"}],"boutique":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(boutique)$/,"suffix":"boutique"}],"box":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(box)$/,"suffix":"box"}],"br":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.br)$/,"suffix":"blogspot.com.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(adm\.br)$/,"suffix":"adm.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(adv\.br)$/,"suffix":"adv.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agr\.br)$/,"suffix":"agr.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(am\.br)$/,"suffix":"am.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arq\.br)$/,"suffix":"arq.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.br)$/,"suffix":"art.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ato\.br)$/,"suffix":"ato.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(b\.br)$/,"suffix":"b.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bio\.br)$/,"suffix":"bio.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blog\.br)$/,"suffix":"blog.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bmd\.br)$/,"suffix":"bmd.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cim\.br)$/,"suffix":"cim.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cng\.br)$/,"suffix":"cng.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cnt\.br)$/,"suffix":"cnt.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.br)$/,"suffix":"com.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.br)$/,"suffix":"coop.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ecn\.br)$/,"suffix":"ecn.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eco\.br)$/,"suffix":"eco.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.br)$/,"suffix":"edu.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(emp\.br)$/,"suffix":"emp.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eng\.br)$/,"suffix":"eng.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(esp\.br)$/,"suffix":"esp.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(etc\.br)$/,"suffix":"etc.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eti\.br)$/,"suffix":"eti.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(far\.br)$/,"suffix":"far.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flog\.br)$/,"suffix":"flog.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fm\.br)$/,"suffix":"fm.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fnd\.br)$/,"suffix":"fnd.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fot\.br)$/,"suffix":"fot.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fst\.br)$/,"suffix":"fst.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(g12\.br)$/,"suffix":"g12.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ggf\.br)$/,"suffix":"ggf.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.br)$/,"suffix":"gov.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(imb\.br)$/,"suffix":"imb.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ind\.br)$/,"suffix":"ind.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(inf\.br)$/,"suffix":"inf.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jor\.br)$/,"suffix":"jor.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jus\.br)$/,"suffix":"jus.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leg\.br)$/,"suffix":"leg.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lel\.br)$/,"suffix":"lel.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mat\.br)$/,"suffix":"mat.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.br)$/,"suffix":"med.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.br)$/,"suffix":"mil.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mp\.br)$/,"suffix":"mp.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mus\.br)$/,"suffix":"mus.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.br)$/,"suffix":"net.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.nom\.br)$/,"suffix":"nom.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(not\.br)$/,"suffix":"not.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ntr\.br)$/,"suffix":"ntr.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(odo\.br)$/,"suffix":"odo.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.br)$/,"suffix":"org.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ppg\.br)$/,"suffix":"ppg.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.br)$/,"suffix":"pro.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(psc\.br)$/,"suffix":"psc.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(psi\.br)$/,"suffix":"psi.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qsl\.br)$/,"suffix":"qsl.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(radio\.br)$/,"suffix":"radio.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rec\.br)$/,"suffix":"rec.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(slg\.br)$/,"suffix":"slg.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(srv\.br)$/,"suffix":"srv.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(taxi\.br)$/,"suffix":"taxi.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(teo\.br)$/,"suffix":"teo.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tmp\.br)$/,"suffix":"tmp.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trd\.br)$/,"suffix":"trd.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tur\.br)$/,"suffix":"tur.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.br)$/,"suffix":"tv.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vet\.br)$/,"suffix":"vet.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vlog\.br)$/,"suffix":"vlog.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wiki\.br)$/,"suffix":"wiki.br"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zlg\.br)$/,"suffix":"zlg.br"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(br)$/,"suffix":"br"}],"bradesco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bradesco)$/,"suffix":"bradesco"}],"bridgestone":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bridgestone)$/,"suffix":"bridgestone"}],"broadway":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(broadway)$/,"suffix":"broadway"}],"broker":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(broker)$/,"suffix":"broker"}],"brother":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(brother)$/,"suffix":"brother"}],"brussels":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(brussels)$/,"suffix":"brussels"}],"bs":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bs)$/,"suffix":"com.bs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bs)$/,"suffix":"edu.bs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bs)$/,"suffix":"gov.bs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bs)$/,"suffix":"net.bs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bs)$/,"suffix":"org.bs"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bs)$/,"suffix":"bs"}],"bt":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bt)$/,"suffix":"com.bt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bt)$/,"suffix":"edu.bt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bt)$/,"suffix":"gov.bt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bt)$/,"suffix":"net.bt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bt)$/,"suffix":"org.bt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bt)$/,"suffix":"bt"}],"budapest":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(budapest)$/,"suffix":"budapest"}],"bugatti":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bugatti)$/,"suffix":"bugatti"}],"build":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(build)$/,"suffix":"build"}],"builders":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(builders)$/,"suffix":"builders"}],"business":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(business)$/,"suffix":"business"}],"buy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(buy)$/,"suffix":"buy"}],"buzz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(buzz)$/,"suffix":"buzz"}],"bv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bv)$/,"suffix":"bv"}],"bw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.bw)$/,"suffix":"co.bw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bw)$/,"suffix":"org.bw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bw)$/,"suffix":"bw"}],"by":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.by)$/,"suffix":"blogspot.com.by"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.by)$/,"suffix":"com.by"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.by)$/,"suffix":"gov.by"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.by)$/,"suffix":"mil.by"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(of\.by)$/,"suffix":"of.by"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(by)$/,"suffix":"by"}],"bz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.bz)$/,"suffix":"com.bz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.bz)$/,"suffix":"edu.bz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.bz)$/,"suffix":"gov.bz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.bz)$/,"suffix":"net.bz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.bz)$/,"suffix":"org.bz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(za\.bz)$/,"suffix":"za.bz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bz)$/,"suffix":"bz"}],"bzh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(bzh)$/,"suffix":"bzh"}],"ca":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ab\.ca)$/,"suffix":"ab.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bc\.ca)$/,"suffix":"bc.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ca)$/,"suffix":"blogspot.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ca)$/,"suffix":"co.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gc\.ca)$/,"suffix":"gc.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mb\.ca)$/,"suffix":"mb.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nb\.ca)$/,"suffix":"nb.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nf\.ca)$/,"suffix":"nf.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nl\.ca)$/,"suffix":"nl.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ns\.ca)$/,"suffix":"ns.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nt\.ca)$/,"suffix":"nt.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nu\.ca)$/,"suffix":"nu.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(on\.ca)$/,"suffix":"on.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pe\.ca)$/,"suffix":"pe.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qc\.ca)$/,"suffix":"qc.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sk\.ca)$/,"suffix":"sk.ca"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yk\.ca)$/,"suffix":"yk.ca"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ca)$/,"suffix":"ca"}],"cab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cab)$/,"suffix":"cab"}],"cafe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cafe)$/,"suffix":"cafe"}],"cal":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cal)$/,"suffix":"cal"}],"call":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(call)$/,"suffix":"call"}],"calvinklein":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(calvinklein)$/,"suffix":"calvinklein"}],"camera":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(camera)$/,"suffix":"camera"}],"camp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(camp)$/,"suffix":"camp"}],"cancerresearch":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cancerresearch)$/,"suffix":"cancerresearch"}],"canon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(canon)$/,"suffix":"canon"}],"capetown":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(capetown)$/,"suffix":"capetown"}],"capital":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(capital)$/,"suffix":"capital"}],"capitalone":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(capitalone)$/,"suffix":"capitalone"}],"car":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(car)$/,"suffix":"car"}],"caravan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(caravan)$/,"suffix":"caravan"}],"cards":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cards)$/,"suffix":"cards"}],"care":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(care)$/,"suffix":"care"}],"career":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(career)$/,"suffix":"career"}],"careers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(careers)$/,"suffix":"careers"}],"cars":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cars)$/,"suffix":"cars"}],"cartier":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cartier)$/,"suffix":"cartier"}],"casa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(casa)$/,"suffix":"casa"}],"case":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(case)$/,"suffix":"case"}],"caseih":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(caseih)$/,"suffix":"caseih"}],"cash":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cash)$/,"suffix":"cash"}],"casino":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(casino)$/,"suffix":"casino"}],"cat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cat)$/,"suffix":"cat"}],"catering":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(catering)$/,"suffix":"catering"}],"catholic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(catholic)$/,"suffix":"catholic"}],"cba":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cba)$/,"suffix":"cba"}],"cbn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cbn)$/,"suffix":"cbn"}],"cbre":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cbre)$/,"suffix":"cbre"}],"cbs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cbs)$/,"suffix":"cbs"}],"cc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ftpaccess\.cc)$/,"suffix":"ftpaccess.cc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(game-server\.cc)$/,"suffix":"game-server.cc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(myphotos\.cc)$/,"suffix":"myphotos.cc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scrapping\.cc)$/,"suffix":"scrapping.cc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc)$/,"suffix":"cc"}],"cd":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cd)$/,"suffix":"gov.cd"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cd)$/,"suffix":"cd"}],"ceb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ceb)$/,"suffix":"ceb"}],"center":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(center)$/,"suffix":"center"}],"ceo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ceo)$/,"suffix":"ceo"}],"cern":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cern)$/,"suffix":"cern"}],"cf":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.cf)$/,"suffix":"blogspot.cf"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cf)$/,"suffix":"cf"}],"cfa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cfa)$/,"suffix":"cfa"}],"cfd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cfd)$/,"suffix":"cfd"}],"cg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cg)$/,"suffix":"cg"}],"ch":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ch)$/,"suffix":"blogspot.ch"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ch)$/,"suffix":"ch"}],"chanel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chanel)$/,"suffix":"chanel"}],"channel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(channel)$/,"suffix":"channel"}],"chase":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chase)$/,"suffix":"chase"}],"chat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chat)$/,"suffix":"chat"}],"cheap":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cheap)$/,"suffix":"cheap"}],"chintai":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chintai)$/,"suffix":"chintai"}],"chloe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chloe)$/,"suffix":"chloe"}],"christmas":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(christmas)$/,"suffix":"christmas"}],"chrome":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chrome)$/,"suffix":"chrome"}],"chrysler":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(chrysler)$/,"suffix":"chrysler"}],"church":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(church)$/,"suffix":"church"}],"ci":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ci)$/,"suffix":"ac.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.ci)$/,"suffix":"asso.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ci)$/,"suffix":"co.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ci)$/,"suffix":"com.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ed\.ci)$/,"suffix":"ed.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ci)$/,"suffix":"edu.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.ci)$/,"suffix":"go.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.ci)$/,"suffix":"gouv.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.ci)$/,"suffix":"int.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(md\.ci)$/,"suffix":"md.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ci)$/,"suffix":"net.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.ci)$/,"suffix":"or.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ci)$/,"suffix":"org.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(presse\.ci)$/,"suffix":"presse.ci"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--aroport-bya\.ci)$/,"suffix":"xn--aroport-bya.ci"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ci)$/,"suffix":"ci"}],"cipriani":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cipriani)$/,"suffix":"cipriani"}],"circle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(circle)$/,"suffix":"circle"}],"cisco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cisco)$/,"suffix":"cisco"}],"citadel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(citadel)$/,"suffix":"citadel"}],"citi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(citi)$/,"suffix":"citi"}],"citic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(citic)$/,"suffix":"citic"}],"city":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(city)$/,"suffix":"city"}],"cityeats":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cityeats)$/,"suffix":"cityeats"}],"ck":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ck)$/,"suffix":"www.ck"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.ck)$/,"suffix":"ck"}],"cl":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.cl)$/,"suffix":"blogspot.cl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.cl)$/,"suffix":"co.cl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.cl)$/,"suffix":"gob.cl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cl)$/,"suffix":"gov.cl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.cl)$/,"suffix":"mil.cl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cl)$/,"suffix":"cl"}],"claims":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(claims)$/,"suffix":"claims"}],"cleaning":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cleaning)$/,"suffix":"cleaning"}],"click":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(click)$/,"suffix":"click"}],"clinic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(clinic)$/,"suffix":"clinic"}],"clinique":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(clinique)$/,"suffix":"clinique"}],"clothing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(clothing)$/,"suffix":"clothing"}],"cloud":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloud)$/,"suffix":"cloud"}],"club":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(club)$/,"suffix":"club"}],"clubmed":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(clubmed)$/,"suffix":"clubmed"}],"cm":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.cm)$/,"suffix":"co.cm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.cm)$/,"suffix":"com.cm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cm)$/,"suffix":"gov.cm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.cm)$/,"suffix":"net.cm"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cm)$/,"suffix":"cm"}],"cn":[{"level":6,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3\.cn-north-1\.amazonaws\.com\.cn)$/,"suffix":"s3.cn-north-1.amazonaws.com.cn"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn-north-1\.compute\.amazonaws\.cn)$/,"suffix":"cn-north-1.compute.amazonaws.cn"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(compute\.amazonaws\.cn)$/,"suffix":"compute.amazonaws.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.cn)$/,"suffix":"ac.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ah\.cn)$/,"suffix":"ah.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bj\.cn)$/,"suffix":"bj.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.cn)$/,"suffix":"com.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cq\.cn)$/,"suffix":"cq.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.cn)$/,"suffix":"edu.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fj\.cn)$/,"suffix":"fj.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gd\.cn)$/,"suffix":"gd.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cn)$/,"suffix":"gov.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.cn)$/,"suffix":"gs.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gx\.cn)$/,"suffix":"gx.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gz\.cn)$/,"suffix":"gz.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ha\.cn)$/,"suffix":"ha.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hb\.cn)$/,"suffix":"hb.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(he\.cn)$/,"suffix":"he.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hi\.cn)$/,"suffix":"hi.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hk\.cn)$/,"suffix":"hk.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hl\.cn)$/,"suffix":"hl.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hn\.cn)$/,"suffix":"hn.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jl\.cn)$/,"suffix":"jl.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(js\.cn)$/,"suffix":"js.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jx\.cn)$/,"suffix":"jx.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ln\.cn)$/,"suffix":"ln.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.cn)$/,"suffix":"mil.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mo\.cn)$/,"suffix":"mo.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.cn)$/,"suffix":"net.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nm\.cn)$/,"suffix":"nm.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nx\.cn)$/,"suffix":"nx.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.cn)$/,"suffix":"org.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qh\.cn)$/,"suffix":"qh.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc\.cn)$/,"suffix":"sc.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sd\.cn)$/,"suffix":"sd.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sh\.cn)$/,"suffix":"sh.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sn\.cn)$/,"suffix":"sn.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sx\.cn)$/,"suffix":"sx.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tj\.cn)$/,"suffix":"tj.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tw\.cn)$/,"suffix":"tw.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xj\.cn)$/,"suffix":"xj.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--55qx5d\.cn)$/,"suffix":"xn--55qx5d.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--io0a7i\.cn)$/,"suffix":"xn--io0a7i.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--od0alg\.cn)$/,"suffix":"xn--od0alg.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xz\.cn)$/,"suffix":"xz.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yn\.cn)$/,"suffix":"yn.cn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zj\.cn)$/,"suffix":"zj.cn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn)$/,"suffix":"cn"}],"co":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.co)$/,"suffix":"blogspot.com.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arts\.co)$/,"suffix":"arts.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.co)$/,"suffix":"com.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.co)$/,"suffix":"edu.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.co)$/,"suffix":"firm.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.co)$/,"suffix":"gov.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.co)$/,"suffix":"info.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.co)$/,"suffix":"int.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.co)$/,"suffix":"mil.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.co)$/,"suffix":"net.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.co)$/,"suffix":"nom.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.co)$/,"suffix":"org.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rec\.co)$/,"suffix":"rec.co"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.co)$/,"suffix":"web.co"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(co)$/,"suffix":"co"}],"coach":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(coach)$/,"suffix":"coach"}],"codes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(codes)$/,"suffix":"codes"}],"coffee":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(coffee)$/,"suffix":"coffee"}],"college":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(college)$/,"suffix":"college"}],"cologne":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cologne)$/,"suffix":"cologne"}],"com":[{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap-northeast-1\.compute\.amazonaws\.com)$/,"suffix":"ap-northeast-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap-northeast-2\.compute\.amazonaws\.com)$/,"suffix":"ap-northeast-2.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap-southeast-1\.compute\.amazonaws\.com)$/,"suffix":"ap-southeast-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap-southeast-2\.compute\.amazonaws\.com)$/,"suffix":"ap-southeast-2.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu-central-1\.compute\.amazonaws\.com)$/,"suffix":"eu-central-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu-west-1\.compute\.amazonaws\.com)$/,"suffix":"eu-west-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3\.ap-northeast-2\.amazonaws\.com)$/,"suffix":"s3.ap-northeast-2.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3\.eu-central-1\.amazonaws\.com)$/,"suffix":"s3.eu-central-1.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa-east-1\.compute\.amazonaws\.com)$/,"suffix":"sa-east-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(us-gov-west-1\.compute\.amazonaws\.com)$/,"suffix":"us-gov-west-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(us-west-1\.compute\.amazonaws\.com)$/,"suffix":"us-west-1.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(us-west-2\.compute\.amazonaws\.com)$/,"suffix":"us-west-2.compute.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(z-1\.compute-1\.amazonaws\.com)$/,"suffix":"z-1.compute-1.amazonaws.com"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(z-2\.compute-1\.amazonaws\.com)$/,"suffix":"z-2.compute-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(compute-1\.amazonaws\.com)$/,"suffix":"compute-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(compute\.amazonaws\.com)$/,"suffix":"compute.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(elb\.amazonaws\.com)$/,"suffix":"elb.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-ap-northeast-1\.amazonaws\.com)$/,"suffix":"s3-ap-northeast-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-ap-northeast-2\.amazonaws\.com)$/,"suffix":"s3-ap-northeast-2.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-ap-southeast-1\.amazonaws\.com)$/,"suffix":"s3-ap-southeast-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-ap-southeast-2\.amazonaws\.com)$/,"suffix":"s3-ap-southeast-2.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-eu-central-1\.amazonaws\.com)$/,"suffix":"s3-eu-central-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-eu-west-1\.amazonaws\.com)$/,"suffix":"s3-eu-west-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-external-1\.amazonaws\.com)$/,"suffix":"s3-external-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-external-2\.amazonaws\.com)$/,"suffix":"s3-external-2.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-fips-us-gov-west-1\.amazonaws\.com)$/,"suffix":"s3-fips-us-gov-west-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-sa-east-1\.amazonaws\.com)$/,"suffix":"s3-sa-east-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-us-gov-west-1\.amazonaws\.com)$/,"suffix":"s3-us-gov-west-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-us-west-1\.amazonaws\.com)$/,"suffix":"s3-us-west-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3-us-west-2\.amazonaws\.com)$/,"suffix":"s3-us-west-2.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(s3\.amazonaws\.com)$/,"suffix":"s3.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(us-east-1\.amazonaws\.com)$/,"suffix":"us-east-1.amazonaws.com"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xen\.prgmr\.com)$/,"suffix":"xen.prgmr.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(1kapp\.com)$/,"suffix":"1kapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(4u\.com)$/,"suffix":"4u.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(africa\.com)$/,"suffix":"africa.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(appspot\.com)$/,"suffix":"appspot.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ar\.com)$/,"suffix":"ar.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(betainabox\.com)$/,"suffix":"betainabox.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogdns\.com)$/,"suffix":"blogdns.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com)$/,"suffix":"blogspot.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(br\.com)$/,"suffix":"br.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cechire\.com)$/,"suffix":"cechire.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloudcontrolapp\.com)$/,"suffix":"cloudcontrolapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloudcontrolled\.com)$/,"suffix":"cloudcontrolled.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn\.com)$/,"suffix":"cn.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.com)$/,"suffix":"co.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(codespot\.com)$/,"suffix":"codespot.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(de\.com)$/,"suffix":"de.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsalias\.com)$/,"suffix":"dnsalias.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsdojo\.com)$/,"suffix":"dnsdojo.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(doesntexist\.com)$/,"suffix":"doesntexist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dontexist\.com)$/,"suffix":"dontexist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(doomdns\.com)$/,"suffix":"doomdns.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dreamhosters\.com)$/,"suffix":"dreamhosters.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dsmynas\.com)$/,"suffix":"dsmynas.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyn-o-saur\.com)$/,"suffix":"dyn-o-saur.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dynalias\.com)$/,"suffix":"dynalias.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-at-home\.com)$/,"suffix":"dyndns-at-home.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-at-work\.com)$/,"suffix":"dyndns-at-work.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-blog\.com)$/,"suffix":"dyndns-blog.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-free\.com)$/,"suffix":"dyndns-free.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-home\.com)$/,"suffix":"dyndns-home.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-ip\.com)$/,"suffix":"dyndns-ip.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-mail\.com)$/,"suffix":"dyndns-mail.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-office\.com)$/,"suffix":"dyndns-office.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-pics\.com)$/,"suffix":"dyndns-pics.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-remote\.com)$/,"suffix":"dyndns-remote.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-server\.com)$/,"suffix":"dyndns-server.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-web\.com)$/,"suffix":"dyndns-web.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-wiki\.com)$/,"suffix":"dyndns-wiki.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns-work\.com)$/,"suffix":"dyndns-work.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elasticbeanstalk\.com)$/,"suffix":"elasticbeanstalk.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(est-a-la-maison\.com)$/,"suffix":"est-a-la-maison.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(est-a-la-masion\.com)$/,"suffix":"est-a-la-masion.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(est-le-patron\.com)$/,"suffix":"est-le-patron.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(est-mon-blogueur\.com)$/,"suffix":"est-mon-blogueur.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu\.com)$/,"suffix":"eu.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(familyds\.com)$/,"suffix":"familyds.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firebaseapp\.com)$/,"suffix":"firebaseapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flynnhub\.com)$/,"suffix":"flynnhub.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ak\.com)$/,"suffix":"from-ak.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-al\.com)$/,"suffix":"from-al.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ar\.com)$/,"suffix":"from-ar.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ca\.com)$/,"suffix":"from-ca.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ct\.com)$/,"suffix":"from-ct.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-dc\.com)$/,"suffix":"from-dc.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-de\.com)$/,"suffix":"from-de.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-fl\.com)$/,"suffix":"from-fl.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ga\.com)$/,"suffix":"from-ga.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-hi\.com)$/,"suffix":"from-hi.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ia\.com)$/,"suffix":"from-ia.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-id\.com)$/,"suffix":"from-id.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-il\.com)$/,"suffix":"from-il.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-in\.com)$/,"suffix":"from-in.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ks\.com)$/,"suffix":"from-ks.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ky\.com)$/,"suffix":"from-ky.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ma\.com)$/,"suffix":"from-ma.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-md\.com)$/,"suffix":"from-md.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-mi\.com)$/,"suffix":"from-mi.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-mn\.com)$/,"suffix":"from-mn.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-mo\.com)$/,"suffix":"from-mo.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ms\.com)$/,"suffix":"from-ms.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-mt\.com)$/,"suffix":"from-mt.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nc\.com)$/,"suffix":"from-nc.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nd\.com)$/,"suffix":"from-nd.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ne\.com)$/,"suffix":"from-ne.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nh\.com)$/,"suffix":"from-nh.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nj\.com)$/,"suffix":"from-nj.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nm\.com)$/,"suffix":"from-nm.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-nv\.com)$/,"suffix":"from-nv.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-oh\.com)$/,"suffix":"from-oh.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ok\.com)$/,"suffix":"from-ok.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-or\.com)$/,"suffix":"from-or.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-pa\.com)$/,"suffix":"from-pa.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-pr\.com)$/,"suffix":"from-pr.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ri\.com)$/,"suffix":"from-ri.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-sc\.com)$/,"suffix":"from-sc.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-sd\.com)$/,"suffix":"from-sd.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-tn\.com)$/,"suffix":"from-tn.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-tx\.com)$/,"suffix":"from-tx.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ut\.com)$/,"suffix":"from-ut.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-va\.com)$/,"suffix":"from-va.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-vt\.com)$/,"suffix":"from-vt.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-wa\.com)$/,"suffix":"from-wa.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-wi\.com)$/,"suffix":"from-wi.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-wv\.com)$/,"suffix":"from-wv.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-wy\.com)$/,"suffix":"from-wy.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gb\.com)$/,"suffix":"gb.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(getmyip\.com)$/,"suffix":"getmyip.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(githubusercontent\.com)$/,"suffix":"githubusercontent.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(googleapis\.com)$/,"suffix":"googleapis.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(googlecode\.com)$/,"suffix":"googlecode.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotdns\.com)$/,"suffix":"gotdns.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotpantheon\.com)$/,"suffix":"gotpantheon.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gr\.com)$/,"suffix":"gr.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(herokuapp\.com)$/,"suffix":"herokuapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(herokussl\.com)$/,"suffix":"herokussl.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hk\.com)$/,"suffix":"hk.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hobby-site\.com)$/,"suffix":"hobby-site.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homelinux\.com)$/,"suffix":"homelinux.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeunix\.com)$/,"suffix":"homeunix.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hu\.com)$/,"suffix":"hu.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iamallama\.com)$/,"suffix":"iamallama.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-anarchist\.com)$/,"suffix":"is-a-anarchist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-blogger\.com)$/,"suffix":"is-a-blogger.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-bookkeeper\.com)$/,"suffix":"is-a-bookkeeper.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-bulls-fan\.com)$/,"suffix":"is-a-bulls-fan.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-caterer\.com)$/,"suffix":"is-a-caterer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-chef\.com)$/,"suffix":"is-a-chef.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-conservative\.com)$/,"suffix":"is-a-conservative.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-cpa\.com)$/,"suffix":"is-a-cpa.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-cubicle-slave\.com)$/,"suffix":"is-a-cubicle-slave.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-democrat\.com)$/,"suffix":"is-a-democrat.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-designer\.com)$/,"suffix":"is-a-designer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-doctor\.com)$/,"suffix":"is-a-doctor.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-financialadvisor\.com)$/,"suffix":"is-a-financialadvisor.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-geek\.com)$/,"suffix":"is-a-geek.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-green\.com)$/,"suffix":"is-a-green.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-guru\.com)$/,"suffix":"is-a-guru.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-hard-worker\.com)$/,"suffix":"is-a-hard-worker.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-hunter\.com)$/,"suffix":"is-a-hunter.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-landscaper\.com)$/,"suffix":"is-a-landscaper.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-lawyer\.com)$/,"suffix":"is-a-lawyer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-liberal\.com)$/,"suffix":"is-a-liberal.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-libertarian\.com)$/,"suffix":"is-a-libertarian.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-llama\.com)$/,"suffix":"is-a-llama.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-musician\.com)$/,"suffix":"is-a-musician.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-nascarfan\.com)$/,"suffix":"is-a-nascarfan.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-nurse\.com)$/,"suffix":"is-a-nurse.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-painter\.com)$/,"suffix":"is-a-painter.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-personaltrainer\.com)$/,"suffix":"is-a-personaltrainer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-photographer\.com)$/,"suffix":"is-a-photographer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-player\.com)$/,"suffix":"is-a-player.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-republican\.com)$/,"suffix":"is-a-republican.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-rockstar\.com)$/,"suffix":"is-a-rockstar.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-socialist\.com)$/,"suffix":"is-a-socialist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-student\.com)$/,"suffix":"is-a-student.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-teacher\.com)$/,"suffix":"is-a-teacher.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-techie\.com)$/,"suffix":"is-a-techie.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-therapist\.com)$/,"suffix":"is-a-therapist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-accountant\.com)$/,"suffix":"is-an-accountant.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-actor\.com)$/,"suffix":"is-an-actor.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-actress\.com)$/,"suffix":"is-an-actress.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-anarchist\.com)$/,"suffix":"is-an-anarchist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-artist\.com)$/,"suffix":"is-an-artist.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-engineer\.com)$/,"suffix":"is-an-engineer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-an-entertainer\.com)$/,"suffix":"is-an-entertainer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-certified\.com)$/,"suffix":"is-certified.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-gone\.com)$/,"suffix":"is-gone.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-into-anime\.com)$/,"suffix":"is-into-anime.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-into-cars\.com)$/,"suffix":"is-into-cars.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-into-cartoons\.com)$/,"suffix":"is-into-cartoons.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-into-games\.com)$/,"suffix":"is-into-games.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-leet\.com)$/,"suffix":"is-leet.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-not-certified\.com)$/,"suffix":"is-not-certified.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-slick\.com)$/,"suffix":"is-slick.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-uberleet\.com)$/,"suffix":"is-uberleet.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-with-theband\.com)$/,"suffix":"is-with-theband.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa-geek\.com)$/,"suffix":"isa-geek.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa-hockeynut\.com)$/,"suffix":"isa-hockeynut.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(issmarterthanyou\.com)$/,"suffix":"issmarterthanyou.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jpn\.com)$/,"suffix":"jpn.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kr\.com)$/,"suffix":"kr.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(likes-pie\.com)$/,"suffix":"likes-pie.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(likescandy\.com)$/,"suffix":"likescandy.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mex\.com)$/,"suffix":"mex.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mydrobo\.com)$/,"suffix":"mydrobo.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(neat-url\.com)$/,"suffix":"neat-url.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nfshost\.com)$/,"suffix":"nfshost.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(no\.com)$/,"suffix":"no.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(operaunite\.com)$/,"suffix":"operaunite.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(outsystemscloud\.com)$/,"suffix":"outsystemscloud.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pagefrontapp\.com)$/,"suffix":"pagefrontapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pagespeedmobilizer\.com)$/,"suffix":"pagespeedmobilizer.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qa2\.com)$/,"suffix":"qa2.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(qc\.com)$/,"suffix":"qc.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rackmaze\.com)$/,"suffix":"rackmaze.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rhcloud\.com)$/,"suffix":"rhcloud.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ro\.com)$/,"suffix":"ro.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ru\.com)$/,"suffix":"ru.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.com)$/,"suffix":"sa.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saves-the-whales\.com)$/,"suffix":"saves-the-whales.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(se\.com)$/,"suffix":"se.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selfip\.com)$/,"suffix":"selfip.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sells-for-less\.com)$/,"suffix":"sells-for-less.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sells-for-u\.com)$/,"suffix":"sells-for-u.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(servebbs\.com)$/,"suffix":"servebbs.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(simple-url\.com)$/,"suffix":"simple-url.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sinaapp\.com)$/,"suffix":"sinaapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(space-to-rent\.com)$/,"suffix":"space-to-rent.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(teaches-yoga\.com)$/,"suffix":"teaches-yoga.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uk\.com)$/,"suffix":"uk.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(us\.com)$/,"suffix":"us.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uy\.com)$/,"suffix":"uy.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vipsinaapp\.com)$/,"suffix":"vipsinaapp.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(withgoogle\.com)$/,"suffix":"withgoogle.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(withyoutube\.com)$/,"suffix":"withyoutube.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(writesthisblog\.com)$/,"suffix":"writesthisblog.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xenapponazure\.com)$/,"suffix":"xenapponazure.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yolasite\.com)$/,"suffix":"yolasite.com"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(za\.com)$/,"suffix":"za.com"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(com)$/,"suffix":"com"}],"comcast":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(comcast)$/,"suffix":"comcast"}],"commbank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(commbank)$/,"suffix":"commbank"}],"community":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(community)$/,"suffix":"community"}],"company":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(company)$/,"suffix":"company"}],"compare":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(compare)$/,"suffix":"compare"}],"computer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(computer)$/,"suffix":"computer"}],"comsec":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(comsec)$/,"suffix":"comsec"}],"condos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(condos)$/,"suffix":"condos"}],"construction":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(construction)$/,"suffix":"construction"}],"consulting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(consulting)$/,"suffix":"consulting"}],"contact":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(contact)$/,"suffix":"contact"}],"contractors":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(contractors)$/,"suffix":"contractors"}],"cooking":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cooking)$/,"suffix":"cooking"}],"cookingchannel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cookingchannel)$/,"suffix":"cookingchannel"}],"cool":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cool)$/,"suffix":"cool"}],"coop":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop)$/,"suffix":"coop"}],"corsica":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(corsica)$/,"suffix":"corsica"}],"country":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(country)$/,"suffix":"country"}],"coupon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(coupon)$/,"suffix":"coupon"}],"coupons":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(coupons)$/,"suffix":"coupons"}],"courses":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(courses)$/,"suffix":"courses"}],"cr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.cr)$/,"suffix":"ac.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.cr)$/,"suffix":"co.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ed\.cr)$/,"suffix":"ed.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fi\.cr)$/,"suffix":"fi.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.cr)$/,"suffix":"go.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.cr)$/,"suffix":"or.cr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.cr)$/,"suffix":"sa.cr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cr)$/,"suffix":"cr"}],"credit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(credit)$/,"suffix":"credit"}],"creditcard":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(creditcard)$/,"suffix":"creditcard"}],"creditunion":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(creditunion)$/,"suffix":"creditunion"}],"cricket":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cricket)$/,"suffix":"cricket"}],"crown":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(crown)$/,"suffix":"crown"}],"crs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(crs)$/,"suffix":"crs"}],"cruise":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cruise)$/,"suffix":"cruise"}],"cruises":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cruises)$/,"suffix":"cruises"}],"csc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(csc)$/,"suffix":"csc"}],"cu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.cu)$/,"suffix":"com.cu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.cu)$/,"suffix":"edu.cu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cu)$/,"suffix":"gov.cu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(inf\.cu)$/,"suffix":"inf.cu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.cu)$/,"suffix":"net.cu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.cu)$/,"suffix":"org.cu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cu)$/,"suffix":"cu"}],"cuisinella":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cuisinella)$/,"suffix":"cuisinella"}],"cv":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.cv)$/,"suffix":"blogspot.cv"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cv)$/,"suffix":"cv"}],"cw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.cw)$/,"suffix":"com.cw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.cw)$/,"suffix":"edu.cw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.cw)$/,"suffix":"net.cw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.cw)$/,"suffix":"org.cw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cw)$/,"suffix":"cw"}],"cx":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ath\.cx)$/,"suffix":"ath.cx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cx)$/,"suffix":"gov.cx"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cx)$/,"suffix":"cx"}],"cy":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.cy)$/,"suffix":"blogspot.com.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.cy)$/,"suffix":"ac.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.cy)$/,"suffix":"biz.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.cy)$/,"suffix":"com.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ekloges\.cy)$/,"suffix":"ekloges.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.cy)$/,"suffix":"gov.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.cy)$/,"suffix":"ltd.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.cy)$/,"suffix":"name.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.cy)$/,"suffix":"net.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.cy)$/,"suffix":"org.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(parliament\.cy)$/,"suffix":"parliament.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(press\.cy)$/,"suffix":"press.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.cy)$/,"suffix":"pro.cy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.cy)$/,"suffix":"tm.cy"}],"cymru":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cymru)$/,"suffix":"cymru"}],"cyou":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cyou)$/,"suffix":"cyou"}],"cz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.cz)$/,"suffix":"blogspot.cz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.cz)$/,"suffix":"co.cz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(cz)$/,"suffix":"cz"}],"dabur":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dabur)$/,"suffix":"dabur"}],"dad":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dad)$/,"suffix":"dad"}],"dance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dance)$/,"suffix":"dance"}],"date":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(date)$/,"suffix":"date"}],"dating":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dating)$/,"suffix":"dating"}],"datsun":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(datsun)$/,"suffix":"datsun"}],"day":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(day)$/,"suffix":"day"}],"dclk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dclk)$/,"suffix":"dclk"}],"dds":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dds)$/,"suffix":"dds"}],"de":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.de)$/,"suffix":"blogspot.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.de)$/,"suffix":"com.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuettertdasnetz\.de)$/,"suffix":"fuettertdasnetz.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isteingeek\.de)$/,"suffix":"isteingeek.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(istmein\.de)$/,"suffix":"istmein.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lebtimnetz\.de)$/,"suffix":"lebtimnetz.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leitungsen\.de)$/,"suffix":"leitungsen.de"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(traeumtgerade\.de)$/,"suffix":"traeumtgerade.de"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(de)$/,"suffix":"de"}],"deal":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(deal)$/,"suffix":"deal"}],"dealer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dealer)$/,"suffix":"dealer"}],"deals":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(deals)$/,"suffix":"deals"}],"degree":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(degree)$/,"suffix":"degree"}],"delivery":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(delivery)$/,"suffix":"delivery"}],"dell":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dell)$/,"suffix":"dell"}],"deloitte":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(deloitte)$/,"suffix":"deloitte"}],"delta":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(delta)$/,"suffix":"delta"}],"democrat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(democrat)$/,"suffix":"democrat"}],"dental":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dental)$/,"suffix":"dental"}],"dentist":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dentist)$/,"suffix":"dentist"}],"desi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(desi)$/,"suffix":"desi"}],"design":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(design)$/,"suffix":"design"}],"dev":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dev)$/,"suffix":"dev"}],"dhl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dhl)$/,"suffix":"dhl"}],"diamonds":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(diamonds)$/,"suffix":"diamonds"}],"diet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(diet)$/,"suffix":"diet"}],"digital":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(digital)$/,"suffix":"digital"}],"direct":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(direct)$/,"suffix":"direct"}],"directory":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(directory)$/,"suffix":"directory"}],"discount":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(discount)$/,"suffix":"discount"}],"discover":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(discover)$/,"suffix":"discover"}],"dish":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dish)$/,"suffix":"dish"}],"diy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(diy)$/,"suffix":"diy"}],"dj":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dj)$/,"suffix":"dj"}],"dk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.dk)$/,"suffix":"blogspot.dk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dk)$/,"suffix":"dk"}],"dm":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.dm)$/,"suffix":"com.dm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.dm)$/,"suffix":"edu.dm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.dm)$/,"suffix":"gov.dm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.dm)$/,"suffix":"net.dm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.dm)$/,"suffix":"org.dm"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dm)$/,"suffix":"dm"}],"dnp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnp)$/,"suffix":"dnp"}],"do":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.do)$/,"suffix":"art.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.do)$/,"suffix":"com.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.do)$/,"suffix":"edu.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.do)$/,"suffix":"gob.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.do)$/,"suffix":"gov.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.do)$/,"suffix":"mil.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.do)$/,"suffix":"net.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.do)$/,"suffix":"org.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sld\.do)$/,"suffix":"sld.do"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.do)$/,"suffix":"web.do"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(do)$/,"suffix":"do"}],"docs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(docs)$/,"suffix":"docs"}],"dodge":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dodge)$/,"suffix":"dodge"}],"dog":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dog)$/,"suffix":"dog"}],"doha":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(doha)$/,"suffix":"doha"}],"domains":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(domains)$/,"suffix":"domains"}],"doosan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(doosan)$/,"suffix":"doosan"}],"dot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dot)$/,"suffix":"dot"}],"download":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(download)$/,"suffix":"download"}],"drive":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(drive)$/,"suffix":"drive"}],"dstv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dstv)$/,"suffix":"dstv"}],"dtv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dtv)$/,"suffix":"dtv"}],"dubai":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dubai)$/,"suffix":"dubai"}],"duck":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(duck)$/,"suffix":"duck"}],"dunlop":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dunlop)$/,"suffix":"dunlop"}],"duns":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(duns)$/,"suffix":"duns"}],"dupont":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dupont)$/,"suffix":"dupont"}],"durban":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(durban)$/,"suffix":"durban"}],"dvag":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dvag)$/,"suffix":"dvag"}],"dwg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dwg)$/,"suffix":"dwg"}],"dz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.dz)$/,"suffix":"art.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.dz)$/,"suffix":"asso.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.dz)$/,"suffix":"com.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.dz)$/,"suffix":"edu.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.dz)$/,"suffix":"gov.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.dz)$/,"suffix":"net.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.dz)$/,"suffix":"org.dz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pol\.dz)$/,"suffix":"pol.dz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(dz)$/,"suffix":"dz"}],"earth":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(earth)$/,"suffix":"earth"}],"eat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(eat)$/,"suffix":"eat"}],"ec":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ec)$/,"suffix":"com.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ec)$/,"suffix":"edu.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fin\.ec)$/,"suffix":"fin.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.ec)$/,"suffix":"gob.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ec)$/,"suffix":"gov.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ec)$/,"suffix":"info.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ec)$/,"suffix":"k12.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.ec)$/,"suffix":"med.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ec)$/,"suffix":"mil.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ec)$/,"suffix":"net.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ec)$/,"suffix":"org.ec"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.ec)$/,"suffix":"pro.ec"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ec)$/,"suffix":"ec"}],"edeka":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(edeka)$/,"suffix":"edeka"}],"edu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu)$/,"suffix":"edu"}],"education":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(education)$/,"suffix":"education"}],"ee":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.ee)$/,"suffix":"blogspot.com.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aip\.ee)$/,"suffix":"aip.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ee)$/,"suffix":"com.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ee)$/,"suffix":"edu.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fie\.ee)$/,"suffix":"fie.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ee)$/,"suffix":"gov.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ee)$/,"suffix":"lib.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.ee)$/,"suffix":"med.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ee)$/,"suffix":"org.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pri\.ee)$/,"suffix":"pri.ee"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(riik\.ee)$/,"suffix":"riik.ee"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ee)$/,"suffix":"ee"}],"eg":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.eg)$/,"suffix":"blogspot.com.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.eg)$/,"suffix":"com.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.eg)$/,"suffix":"edu.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eun\.eg)$/,"suffix":"eun.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.eg)$/,"suffix":"gov.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.eg)$/,"suffix":"mil.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.eg)$/,"suffix":"name.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.eg)$/,"suffix":"net.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.eg)$/,"suffix":"org.eg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sci\.eg)$/,"suffix":"sci.eg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(eg)$/,"suffix":"eg"}],"email":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(email)$/,"suffix":"email"}],"emerck":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(emerck)$/,"suffix":"emerck"}],"emerson":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(emerson)$/,"suffix":"emerson"}],"energy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(energy)$/,"suffix":"energy"}],"engineer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(engineer)$/,"suffix":"engineer"}],"engineering":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(engineering)$/,"suffix":"engineering"}],"enterprises":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(enterprises)$/,"suffix":"enterprises"}],"epost":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(epost)$/,"suffix":"epost"}],"epson":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(epson)$/,"suffix":"epson"}],"equipment":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(equipment)$/,"suffix":"equipment"}],"er":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.er)$/,"suffix":"er"}],"ericsson":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ericsson)$/,"suffix":"ericsson"}],"erni":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(erni)$/,"suffix":"erni"}],"es":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.es)$/,"suffix":"blogspot.com.es"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.es)$/,"suffix":"com.es"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.es)$/,"suffix":"edu.es"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.es)$/,"suffix":"gob.es"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.es)$/,"suffix":"nom.es"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.es)$/,"suffix":"org.es"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(es)$/,"suffix":"es"}],"esq":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(esq)$/,"suffix":"esq"}],"estate":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(estate)$/,"suffix":"estate"}],"esurance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(esurance)$/,"suffix":"esurance"}],"et":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.et)$/,"suffix":"biz.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.et)$/,"suffix":"com.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.et)$/,"suffix":"edu.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.et)$/,"suffix":"gov.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.et)$/,"suffix":"info.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.et)$/,"suffix":"name.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.et)$/,"suffix":"net.et"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.et)$/,"suffix":"org.et"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(et)$/,"suffix":"et"}],"etisalat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(etisalat)$/,"suffix":"etisalat"}],"eu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu)$/,"suffix":"eu"}],"eurovision":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(eurovision)$/,"suffix":"eurovision"}],"eus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(eus)$/,"suffix":"eus"}],"events":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(events)$/,"suffix":"events"}],"everbank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(everbank)$/,"suffix":"everbank"}],"exchange":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(exchange)$/,"suffix":"exchange"}],"expert":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(expert)$/,"suffix":"expert"}],"exposed":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(exposed)$/,"suffix":"exposed"}],"express":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(express)$/,"suffix":"express"}],"extraspace":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(extraspace)$/,"suffix":"extraspace"}],"fage":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fage)$/,"suffix":"fage"}],"fail":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fail)$/,"suffix":"fail"}],"fairwinds":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fairwinds)$/,"suffix":"fairwinds"}],"faith":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(faith)$/,"suffix":"faith"}],"family":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(family)$/,"suffix":"family"}],"fan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fan)$/,"suffix":"fan"}],"fans":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fans)$/,"suffix":"fans"}],"farm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(farm)$/,"suffix":"farm"}],"farmers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(farmers)$/,"suffix":"farmers"}],"fashion":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fashion)$/,"suffix":"fashion"}],"fast":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fast)$/,"suffix":"fast"}],"fedex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fedex)$/,"suffix":"fedex"}],"feedback":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(feedback)$/,"suffix":"feedback"}],"ferrari":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ferrari)$/,"suffix":"ferrari"}],"ferrero":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ferrero)$/,"suffix":"ferrero"}],"fi":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aland\.fi)$/,"suffix":"aland.fi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.fi)$/,"suffix":"blogspot.fi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iki\.fi)$/,"suffix":"iki.fi"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fi)$/,"suffix":"fi"}],"fiat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fiat)$/,"suffix":"fiat"}],"fidelity":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fidelity)$/,"suffix":"fidelity"}],"fido":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fido)$/,"suffix":"fido"}],"film":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(film)$/,"suffix":"film"}],"final":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(final)$/,"suffix":"final"}],"finance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(finance)$/,"suffix":"finance"}],"financial":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(financial)$/,"suffix":"financial"}],"fire":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fire)$/,"suffix":"fire"}],"firestone":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(firestone)$/,"suffix":"firestone"}],"firmdale":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(firmdale)$/,"suffix":"firmdale"}],"fish":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fish)$/,"suffix":"fish"}],"fishing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fishing)$/,"suffix":"fishing"}],"fit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fit)$/,"suffix":"fit"}],"fitness":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fitness)$/,"suffix":"fitness"}],"fj":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.fj)$/,"suffix":"fj"}],"fk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.fk)$/,"suffix":"fk"}],"flickr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(flickr)$/,"suffix":"flickr"}],"flights":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(flights)$/,"suffix":"flights"}],"flir":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(flir)$/,"suffix":"flir"}],"florist":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(florist)$/,"suffix":"florist"}],"flowers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(flowers)$/,"suffix":"flowers"}],"flsmidth":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(flsmidth)$/,"suffix":"flsmidth"}],"fly":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fly)$/,"suffix":"fly"}],"fm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fm)$/,"suffix":"fm"}],"fo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fo)$/,"suffix":"fo"}],"foo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(foo)$/,"suffix":"foo"}],"foodnetwork":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(foodnetwork)$/,"suffix":"foodnetwork"}],"football":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(football)$/,"suffix":"football"}],"ford":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ford)$/,"suffix":"ford"}],"forex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(forex)$/,"suffix":"forex"}],"forsale":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(forsale)$/,"suffix":"forsale"}],"forum":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(forum)$/,"suffix":"forum"}],"foundation":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(foundation)$/,"suffix":"foundation"}],"fox":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fox)$/,"suffix":"fox"}],"fr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aeroport\.fr)$/,"suffix":"aeroport.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(assedic\.fr)$/,"suffix":"assedic.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.fr)$/,"suffix":"asso.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(avocat\.fr)$/,"suffix":"avocat.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(avoues\.fr)$/,"suffix":"avoues.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.fr)$/,"suffix":"blogspot.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cci\.fr)$/,"suffix":"cci.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chambagri\.fr)$/,"suffix":"chambagri.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chirurgiens-dentistes\.fr)$/,"suffix":"chirurgiens-dentistes.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.fr)$/,"suffix":"com.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(experts-comptables\.fr)$/,"suffix":"experts-comptables.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(geometre-expert\.fr)$/,"suffix":"geometre-expert.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.fr)$/,"suffix":"gouv.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(greta\.fr)$/,"suffix":"greta.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(huissier-justice\.fr)$/,"suffix":"huissier-justice.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(medecin\.fr)$/,"suffix":"medecin.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.fr)$/,"suffix":"nom.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(notaires\.fr)$/,"suffix":"notaires.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pharmacien\.fr)$/,"suffix":"pharmacien.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(port\.fr)$/,"suffix":"port.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prd\.fr)$/,"suffix":"prd.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(presse\.fr)$/,"suffix":"presse.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.fr)$/,"suffix":"tm.fr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(veterinaire\.fr)$/,"suffix":"veterinaire.fr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fr)$/,"suffix":"fr"}],"free":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(free)$/,"suffix":"free"}],"fresenius":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fresenius)$/,"suffix":"fresenius"}],"frl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(frl)$/,"suffix":"frl"}],"frogans":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(frogans)$/,"suffix":"frogans"}],"frontdoor":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(frontdoor)$/,"suffix":"frontdoor"}],"frontier":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(frontier)$/,"suffix":"frontier"}],"ftr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ftr)$/,"suffix":"ftr"}],"fujitsu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujitsu)$/,"suffix":"fujitsu"}],"fujixerox":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujixerox)$/,"suffix":"fujixerox"}],"fund":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fund)$/,"suffix":"fund"}],"furniture":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(furniture)$/,"suffix":"furniture"}],"futbol":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(futbol)$/,"suffix":"futbol"}],"fyi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(fyi)$/,"suffix":"fyi"}],"ga":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ga)$/,"suffix":"ga"}],"gal":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gal)$/,"suffix":"gal"}],"gallery":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gallery)$/,"suffix":"gallery"}],"gallo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gallo)$/,"suffix":"gallo"}],"gallup":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gallup)$/,"suffix":"gallup"}],"game":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(game)$/,"suffix":"game"}],"games":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(games)$/,"suffix":"games"}],"gap":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gap)$/,"suffix":"gap"}],"garden":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(garden)$/,"suffix":"garden"}],"gb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gb)$/,"suffix":"gb"}],"gbiz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gbiz)$/,"suffix":"gbiz"}],"gd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gd)$/,"suffix":"gd"}],"gdn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gdn)$/,"suffix":"gdn"}],"ge":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ge)$/,"suffix":"com.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ge)$/,"suffix":"edu.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ge)$/,"suffix":"gov.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ge)$/,"suffix":"mil.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ge)$/,"suffix":"net.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ge)$/,"suffix":"org.ge"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pvt\.ge)$/,"suffix":"pvt.ge"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ge)$/,"suffix":"ge"}],"gea":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gea)$/,"suffix":"gea"}],"gent":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gent)$/,"suffix":"gent"}],"genting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(genting)$/,"suffix":"genting"}],"george":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(george)$/,"suffix":"george"}],"gf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gf)$/,"suffix":"gf"}],"gg":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.gg)$/,"suffix":"co.gg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gg)$/,"suffix":"net.gg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gg)$/,"suffix":"org.gg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gg)$/,"suffix":"gg"}],"ggee":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ggee)$/,"suffix":"ggee"}],"gh":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gh)$/,"suffix":"com.gh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gh)$/,"suffix":"edu.gh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.gh)$/,"suffix":"gov.gh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.gh)$/,"suffix":"mil.gh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gh)$/,"suffix":"org.gh"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gh)$/,"suffix":"gh"}],"gi":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gi)$/,"suffix":"com.gi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gi)$/,"suffix":"edu.gi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.gi)$/,"suffix":"gov.gi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.gi)$/,"suffix":"ltd.gi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mod\.gi)$/,"suffix":"mod.gi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gi)$/,"suffix":"org.gi"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gi)$/,"suffix":"gi"}],"gift":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gift)$/,"suffix":"gift"}],"gifts":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gifts)$/,"suffix":"gifts"}],"gives":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gives)$/,"suffix":"gives"}],"giving":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(giving)$/,"suffix":"giving"}],"gl":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.gl)$/,"suffix":"co.gl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gl)$/,"suffix":"com.gl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gl)$/,"suffix":"edu.gl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gl)$/,"suffix":"net.gl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gl)$/,"suffix":"org.gl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gl)$/,"suffix":"gl"}],"glade":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(glade)$/,"suffix":"glade"}],"glass":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(glass)$/,"suffix":"glass"}],"gle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gle)$/,"suffix":"gle"}],"global":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(global)$/,"suffix":"global"}],"globo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(globo)$/,"suffix":"globo"}],"gm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gm)$/,"suffix":"gm"}],"gmail":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gmail)$/,"suffix":"gmail"}],"gmo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gmo)$/,"suffix":"gmo"}],"gmx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gmx)$/,"suffix":"gmx"}],"gn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.gn)$/,"suffix":"ac.gn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gn)$/,"suffix":"com.gn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gn)$/,"suffix":"edu.gn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.gn)$/,"suffix":"gov.gn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gn)$/,"suffix":"net.gn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gn)$/,"suffix":"org.gn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gn)$/,"suffix":"gn"}],"godaddy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(godaddy)$/,"suffix":"godaddy"}],"gold":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gold)$/,"suffix":"gold"}],"goldpoint":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(goldpoint)$/,"suffix":"goldpoint"}],"golf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(golf)$/,"suffix":"golf"}],"goo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(goo)$/,"suffix":"goo"}],"goodhands":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(goodhands)$/,"suffix":"goodhands"}],"goodyear":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(goodyear)$/,"suffix":"goodyear"}],"goog":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(goog)$/,"suffix":"goog"}],"google":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(google)$/,"suffix":"google"}],"gop":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gop)$/,"suffix":"gop"}],"got":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(got)$/,"suffix":"got"}],"gotv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotv)$/,"suffix":"gotv"}],"gov":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov)$/,"suffix":"gov"}],"gp":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.gp)$/,"suffix":"asso.gp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gp)$/,"suffix":"com.gp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gp)$/,"suffix":"edu.gp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi\.gp)$/,"suffix":"mobi.gp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gp)$/,"suffix":"net.gp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gp)$/,"suffix":"org.gp"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gp)$/,"suffix":"gp"}],"gq":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gq)$/,"suffix":"gq"}],"gr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.gr)$/,"suffix":"blogspot.gr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gr)$/,"suffix":"com.gr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gr)$/,"suffix":"edu.gr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.gr)$/,"suffix":"gov.gr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gr)$/,"suffix":"net.gr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gr)$/,"suffix":"org.gr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gr)$/,"suffix":"gr"}],"grainger":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(grainger)$/,"suffix":"grainger"}],"graphics":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(graphics)$/,"suffix":"graphics"}],"gratis":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gratis)$/,"suffix":"gratis"}],"green":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(green)$/,"suffix":"green"}],"gripe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gripe)$/,"suffix":"gripe"}],"group":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(group)$/,"suffix":"group"}],"gs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs)$/,"suffix":"gs"}],"gt":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gt)$/,"suffix":"com.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gt)$/,"suffix":"edu.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.gt)$/,"suffix":"gob.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ind\.gt)$/,"suffix":"ind.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.gt)$/,"suffix":"mil.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gt)$/,"suffix":"net.gt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gt)$/,"suffix":"org.gt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gt)$/,"suffix":"gt"}],"gu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.gu)$/,"suffix":"gu"}],"guardian":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(guardian)$/,"suffix":"guardian"}],"gucci":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gucci)$/,"suffix":"gucci"}],"guge":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(guge)$/,"suffix":"guge"}],"guide":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(guide)$/,"suffix":"guide"}],"guitars":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(guitars)$/,"suffix":"guitars"}],"guru":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(guru)$/,"suffix":"guru"}],"gw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gw)$/,"suffix":"gw"}],"gy":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.gy)$/,"suffix":"co.gy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.gy)$/,"suffix":"com.gy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.gy)$/,"suffix":"edu.gy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.gy)$/,"suffix":"gov.gy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.gy)$/,"suffix":"net.gy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.gy)$/,"suffix":"org.gy"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(gy)$/,"suffix":"gy"}],"hair":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hair)$/,"suffix":"hair"}],"hamburg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamburg)$/,"suffix":"hamburg"}],"hangout":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hangout)$/,"suffix":"hangout"}],"haus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(haus)$/,"suffix":"haus"}],"hbo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hbo)$/,"suffix":"hbo"}],"hdfc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hdfc)$/,"suffix":"hdfc"}],"hdfcbank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hdfcbank)$/,"suffix":"hdfcbank"}],"health":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(health)$/,"suffix":"health"}],"healthcare":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(healthcare)$/,"suffix":"healthcare"}],"help":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(help)$/,"suffix":"help"}],"helsinki":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(helsinki)$/,"suffix":"helsinki"}],"here":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(here)$/,"suffix":"here"}],"hermes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hermes)$/,"suffix":"hermes"}],"hgtv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hgtv)$/,"suffix":"hgtv"}],"hiphop":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiphop)$/,"suffix":"hiphop"}],"hisamitsu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hisamitsu)$/,"suffix":"hisamitsu"}],"hitachi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitachi)$/,"suffix":"hitachi"}],"hiv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiv)$/,"suffix":"hiv"}],"hk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.hk)$/,"suffix":"blogspot.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.hk)$/,"suffix":"com.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.hk)$/,"suffix":"edu.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.hk)$/,"suffix":"gov.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(idv\.hk)$/,"suffix":"idv.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(inc\.hk)$/,"suffix":"inc.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.hk)$/,"suffix":"ltd.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.hk)$/,"suffix":"net.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.hk)$/,"suffix":"org.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--55qx5d\.hk)$/,"suffix":"xn--55qx5d.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ciqpn\.hk)$/,"suffix":"xn--ciqpn.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gmq050i\.hk)$/,"suffix":"xn--gmq050i.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gmqw5a\.hk)$/,"suffix":"xn--gmqw5a.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--io0a7i\.hk)$/,"suffix":"xn--io0a7i.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lcvr32d\.hk)$/,"suffix":"xn--lcvr32d.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mk0axi\.hk)$/,"suffix":"xn--mk0axi.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mxtq1m\.hk)$/,"suffix":"xn--mxtq1m.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--od0alg\.hk)$/,"suffix":"xn--od0alg.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--od0aq3b\.hk)$/,"suffix":"xn--od0aq3b.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tn0ag\.hk)$/,"suffix":"xn--tn0ag.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uc0atv\.hk)$/,"suffix":"xn--uc0atv.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uc0ay4a\.hk)$/,"suffix":"xn--uc0ay4a.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--wcvs22d\.hk)$/,"suffix":"xn--wcvs22d.hk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--zf0avx\.hk)$/,"suffix":"xn--zf0avx.hk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hk)$/,"suffix":"hk"}],"hkt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hkt)$/,"suffix":"hkt"}],"hm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hm)$/,"suffix":"hm"}],"hn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.hn)$/,"suffix":"com.hn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.hn)$/,"suffix":"edu.hn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.hn)$/,"suffix":"gob.hn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.hn)$/,"suffix":"mil.hn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.hn)$/,"suffix":"net.hn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.hn)$/,"suffix":"org.hn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hn)$/,"suffix":"hn"}],"hockey":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hockey)$/,"suffix":"hockey"}],"holdings":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(holdings)$/,"suffix":"holdings"}],"holiday":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(holiday)$/,"suffix":"holiday"}],"homedepot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(homedepot)$/,"suffix":"homedepot"}],"homegoods":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(homegoods)$/,"suffix":"homegoods"}],"homes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(homes)$/,"suffix":"homes"}],"homesense":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(homesense)$/,"suffix":"homesense"}],"honda":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(honda)$/,"suffix":"honda"}],"honeywell":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(honeywell)$/,"suffix":"honeywell"}],"horse":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(horse)$/,"suffix":"horse"}],"host":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(host)$/,"suffix":"host"}],"hosting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hosting)$/,"suffix":"hosting"}],"hot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hot)$/,"suffix":"hot"}],"hoteles":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hoteles)$/,"suffix":"hoteles"}],"hotmail":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hotmail)$/,"suffix":"hotmail"}],"house":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(house)$/,"suffix":"house"}],"how":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(how)$/,"suffix":"how"}],"hr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.hr)$/,"suffix":"blogspot.hr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.hr)$/,"suffix":"com.hr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from\.hr)$/,"suffix":"from.hr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iz\.hr)$/,"suffix":"iz.hr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.hr)$/,"suffix":"name.hr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hr)$/,"suffix":"hr"}],"hsbc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hsbc)$/,"suffix":"hsbc"}],"ht":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(adult\.ht)$/,"suffix":"adult.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.ht)$/,"suffix":"art.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.ht)$/,"suffix":"asso.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ht)$/,"suffix":"com.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.ht)$/,"suffix":"coop.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ht)$/,"suffix":"edu.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.ht)$/,"suffix":"firm.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.ht)$/,"suffix":"gouv.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ht)$/,"suffix":"info.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.ht)$/,"suffix":"med.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ht)$/,"suffix":"net.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ht)$/,"suffix":"org.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(perso\.ht)$/,"suffix":"perso.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pol\.ht)$/,"suffix":"pol.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.ht)$/,"suffix":"pro.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rel\.ht)$/,"suffix":"rel.ht"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shop\.ht)$/,"suffix":"shop.ht"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ht)$/,"suffix":"ht"}],"htc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(htc)$/,"suffix":"htc"}],"hu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(2000\.hu)$/,"suffix":"2000.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agrar\.hu)$/,"suffix":"agrar.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.hu)$/,"suffix":"blogspot.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bolt\.hu)$/,"suffix":"bolt.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(casino\.hu)$/,"suffix":"casino.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(city\.hu)$/,"suffix":"city.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.hu)$/,"suffix":"co.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(erotica\.hu)$/,"suffix":"erotica.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(erotika\.hu)$/,"suffix":"erotika.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(film\.hu)$/,"suffix":"film.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(forum\.hu)$/,"suffix":"forum.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(games\.hu)$/,"suffix":"games.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hotel\.hu)$/,"suffix":"hotel.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.hu)$/,"suffix":"info.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ingatlan\.hu)$/,"suffix":"ingatlan.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jogasz\.hu)$/,"suffix":"jogasz.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(konyvelo\.hu)$/,"suffix":"konyvelo.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lakas\.hu)$/,"suffix":"lakas.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(media\.hu)$/,"suffix":"media.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(news\.hu)$/,"suffix":"news.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.hu)$/,"suffix":"org.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(priv\.hu)$/,"suffix":"priv.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(reklam\.hu)$/,"suffix":"reklam.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sex\.hu)$/,"suffix":"sex.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shop\.hu)$/,"suffix":"shop.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sport\.hu)$/,"suffix":"sport.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(suli\.hu)$/,"suffix":"suli.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(szex\.hu)$/,"suffix":"szex.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.hu)$/,"suffix":"tm.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tozsde\.hu)$/,"suffix":"tozsde.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(utazas\.hu)$/,"suffix":"utazas.hu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(video\.hu)$/,"suffix":"video.hu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hu)$/,"suffix":"hu"}],"hughes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hughes)$/,"suffix":"hughes"}],"hyatt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hyatt)$/,"suffix":"hyatt"}],"hyundai":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(hyundai)$/,"suffix":"hyundai"}],"ibm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibm)$/,"suffix":"ibm"}],"icbc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(icbc)$/,"suffix":"icbc"}],"ice":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ice)$/,"suffix":"ice"}],"icu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(icu)$/,"suffix":"icu"}],"id":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.id)$/,"suffix":"blogspot.co.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.id)$/,"suffix":"ac.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.id)$/,"suffix":"biz.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.id)$/,"suffix":"co.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(desa\.id)$/,"suffix":"desa.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.id)$/,"suffix":"go.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.id)$/,"suffix":"mil.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(my\.id)$/,"suffix":"my.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.id)$/,"suffix":"net.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.id)$/,"suffix":"or.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.id)$/,"suffix":"sch.id"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.id)$/,"suffix":"web.id"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(id)$/,"suffix":"id"}],"ie":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ie)$/,"suffix":"blogspot.ie"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ie)$/,"suffix":"gov.ie"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ie)$/,"suffix":"ie"}],"ieee":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ieee)$/,"suffix":"ieee"}],"ifm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ifm)$/,"suffix":"ifm"}],"iinet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(iinet)$/,"suffix":"iinet"}],"ikano":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikano)$/,"suffix":"ikano"}],"il":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.il)$/,"suffix":"blogspot.co.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.il)$/,"suffix":"ac.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.il)$/,"suffix":"co.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.il)$/,"suffix":"gov.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(idf\.il)$/,"suffix":"idf.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.il)$/,"suffix":"k12.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(muni\.il)$/,"suffix":"muni.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.il)$/,"suffix":"net.il"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.il)$/,"suffix":"org.il"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(il)$/,"suffix":"il"}],"im":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.co\.im)$/,"suffix":"ltd.co.im"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(plc\.co\.im)$/,"suffix":"plc.co.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.im)$/,"suffix":"ac.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.im)$/,"suffix":"co.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.im)$/,"suffix":"com.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.im)$/,"suffix":"net.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.im)$/,"suffix":"org.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tt\.im)$/,"suffix":"tt.im"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.im)$/,"suffix":"tv.im"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(im)$/,"suffix":"im"}],"imamat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(imamat)$/,"suffix":"imamat"}],"imdb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(imdb)$/,"suffix":"imdb"}],"immo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(immo)$/,"suffix":"immo"}],"immobilien":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(immobilien)$/,"suffix":"immobilien"}],"in":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.in)$/,"suffix":"ac.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.in)$/,"suffix":"blogspot.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.in)$/,"suffix":"co.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.in)$/,"suffix":"edu.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.in)$/,"suffix":"firm.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gen\.in)$/,"suffix":"gen.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.in)$/,"suffix":"gov.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ind\.in)$/,"suffix":"ind.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.in)$/,"suffix":"mil.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.in)$/,"suffix":"net.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nic\.in)$/,"suffix":"nic.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.in)$/,"suffix":"org.in"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(res\.in)$/,"suffix":"res.in"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(in)$/,"suffix":"in"}],"industries":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(industries)$/,"suffix":"industries"}],"infiniti":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(infiniti)$/,"suffix":"infiniti"}],"info":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barrel-of-knowledge\.info)$/,"suffix":"barrel-of-knowledge.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barrell-of-knowledge\.info)$/,"suffix":"barrell-of-knowledge.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns\.info)$/,"suffix":"dyndns.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(for-our\.info)$/,"suffix":"for-our.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(groks-the\.info)$/,"suffix":"groks-the.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(groks-this\.info)$/,"suffix":"groks-this.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(here-for-more\.info)$/,"suffix":"here-for-more.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(knowsitall\.info)$/,"suffix":"knowsitall.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selfip\.info)$/,"suffix":"selfip.info"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(webhop\.info)$/,"suffix":"webhop.info"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(info)$/,"suffix":"info"}],"ing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ing)$/,"suffix":"ing"}],"ink":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ink)$/,"suffix":"ink"}],"institute":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(institute)$/,"suffix":"institute"}],"insurance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(insurance)$/,"suffix":"insurance"}],"insure":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(insure)$/,"suffix":"insure"}],"int":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu\.int)$/,"suffix":"eu.int"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(int)$/,"suffix":"int"}],"intel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(intel)$/,"suffix":"intel"}],"international":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(international)$/,"suffix":"international"}],"intuit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(intuit)$/,"suffix":"intuit"}],"investments":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(investments)$/,"suffix":"investments"}],"io":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.io)$/,"suffix":"com.io"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(github\.io)$/,"suffix":"github.io"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ngrok\.io)$/,"suffix":"ngrok.io"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nid\.io)$/,"suffix":"nid.io"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pantheon\.io)$/,"suffix":"pantheon.io"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandcats\.io)$/,"suffix":"sandcats.io"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(io)$/,"suffix":"io"}],"ipiranga":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ipiranga)$/,"suffix":"ipiranga"}],"iq":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.iq)$/,"suffix":"com.iq"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.iq)$/,"suffix":"edu.iq"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.iq)$/,"suffix":"gov.iq"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.iq)$/,"suffix":"mil.iq"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.iq)$/,"suffix":"net.iq"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.iq)$/,"suffix":"org.iq"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(iq)$/,"suffix":"iq"}],"ir":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ir)$/,"suffix":"ac.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ir)$/,"suffix":"co.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ir)$/,"suffix":"gov.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(id\.ir)$/,"suffix":"id.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ir)$/,"suffix":"net.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ir)$/,"suffix":"org.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.ir)$/,"suffix":"sch.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba3a4f16a\.ir)$/,"suffix":"xn--mgba3a4f16a.ir"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba3a4fra\.ir)$/,"suffix":"xn--mgba3a4fra.ir"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ir)$/,"suffix":"ir"}],"irish":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(irish)$/,"suffix":"irish"}],"is":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.is)$/,"suffix":"blogspot.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.is)$/,"suffix":"com.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cupcake\.is)$/,"suffix":"cupcake.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.is)$/,"suffix":"edu.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.is)$/,"suffix":"gov.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.is)$/,"suffix":"int.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.is)$/,"suffix":"net.is"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.is)$/,"suffix":"org.is"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(is)$/,"suffix":"is"}],"iselect":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(iselect)$/,"suffix":"iselect"}],"ismaili":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ismaili)$/,"suffix":"ismaili"}],"ist":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ist)$/,"suffix":"ist"}],"istanbul":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(istanbul)$/,"suffix":"istanbul"}],"it":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(abr\.it)$/,"suffix":"abr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(abruzzo\.it)$/,"suffix":"abruzzo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ag\.it)$/,"suffix":"ag.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agrigento\.it)$/,"suffix":"agrigento.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(al\.it)$/,"suffix":"al.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alessandria\.it)$/,"suffix":"alessandria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alto-adige\.it)$/,"suffix":"alto-adige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(altoadige\.it)$/,"suffix":"altoadige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(an\.it)$/,"suffix":"an.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ancona\.it)$/,"suffix":"ancona.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andria-barletta-trani\.it)$/,"suffix":"andria-barletta-trani.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andria-trani-barletta\.it)$/,"suffix":"andria-trani-barletta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andriabarlettatrani\.it)$/,"suffix":"andriabarlettatrani.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andriatranibarletta\.it)$/,"suffix":"andriatranibarletta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ao\.it)$/,"suffix":"ao.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aosta-valley\.it)$/,"suffix":"aosta-valley.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aosta\.it)$/,"suffix":"aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aostavalley\.it)$/,"suffix":"aostavalley.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aoste\.it)$/,"suffix":"aoste.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap\.it)$/,"suffix":"ap.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aq\.it)$/,"suffix":"aq.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aquila\.it)$/,"suffix":"aquila.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ar\.it)$/,"suffix":"ar.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arezzo\.it)$/,"suffix":"arezzo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ascoli-piceno\.it)$/,"suffix":"ascoli-piceno.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ascolipiceno\.it)$/,"suffix":"ascolipiceno.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asti\.it)$/,"suffix":"asti.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(at\.it)$/,"suffix":"at.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(av\.it)$/,"suffix":"av.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(avellino\.it)$/,"suffix":"avellino.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ba\.it)$/,"suffix":"ba.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(balsan\.it)$/,"suffix":"balsan.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bari\.it)$/,"suffix":"bari.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barletta-trani-andria\.it)$/,"suffix":"barletta-trani-andria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barlettatraniandria\.it)$/,"suffix":"barlettatraniandria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bas\.it)$/,"suffix":"bas.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(basilicata\.it)$/,"suffix":"basilicata.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(belluno\.it)$/,"suffix":"belluno.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(benevento\.it)$/,"suffix":"benevento.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bergamo\.it)$/,"suffix":"bergamo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bg\.it)$/,"suffix":"bg.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bi\.it)$/,"suffix":"bi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biella\.it)$/,"suffix":"biella.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bl\.it)$/,"suffix":"bl.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.it)$/,"suffix":"blogspot.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bn\.it)$/,"suffix":"bn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bo\.it)$/,"suffix":"bo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bologna\.it)$/,"suffix":"bologna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bolzano\.it)$/,"suffix":"bolzano.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bozen\.it)$/,"suffix":"bozen.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(br\.it)$/,"suffix":"br.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brescia\.it)$/,"suffix":"brescia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brindisi\.it)$/,"suffix":"brindisi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bs\.it)$/,"suffix":"bs.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bt\.it)$/,"suffix":"bt.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bz\.it)$/,"suffix":"bz.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ca\.it)$/,"suffix":"ca.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cagliari\.it)$/,"suffix":"cagliari.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cal\.it)$/,"suffix":"cal.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(calabria\.it)$/,"suffix":"calabria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(caltanissetta\.it)$/,"suffix":"caltanissetta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cam\.it)$/,"suffix":"cam.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(campania\.it)$/,"suffix":"campania.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(campidano-medio\.it)$/,"suffix":"campidano-medio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(campidanomedio\.it)$/,"suffix":"campidanomedio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(campobasso\.it)$/,"suffix":"campobasso.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(carbonia-iglesias\.it)$/,"suffix":"carbonia-iglesias.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(carboniaiglesias\.it)$/,"suffix":"carboniaiglesias.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(carrara-massa\.it)$/,"suffix":"carrara-massa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(carraramassa\.it)$/,"suffix":"carraramassa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(caserta\.it)$/,"suffix":"caserta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(catania\.it)$/,"suffix":"catania.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(catanzaro\.it)$/,"suffix":"catanzaro.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cb\.it)$/,"suffix":"cb.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ce\.it)$/,"suffix":"ce.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cesena-forli\.it)$/,"suffix":"cesena-forli.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cesenaforli\.it)$/,"suffix":"cesenaforli.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ch\.it)$/,"suffix":"ch.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chieti\.it)$/,"suffix":"chieti.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ci\.it)$/,"suffix":"ci.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cl\.it)$/,"suffix":"cl.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn\.it)$/,"suffix":"cn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.it)$/,"suffix":"co.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(como\.it)$/,"suffix":"como.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cosenza\.it)$/,"suffix":"cosenza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cr\.it)$/,"suffix":"cr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cremona\.it)$/,"suffix":"cremona.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(crotone\.it)$/,"suffix":"crotone.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cs\.it)$/,"suffix":"cs.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ct\.it)$/,"suffix":"ct.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cuneo\.it)$/,"suffix":"cuneo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cz\.it)$/,"suffix":"cz.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dell-ogliastra\.it)$/,"suffix":"dell-ogliastra.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dellogliastra\.it)$/,"suffix":"dellogliastra.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.it)$/,"suffix":"edu.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(emilia-romagna\.it)$/,"suffix":"emilia-romagna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(emiliaromagna\.it)$/,"suffix":"emiliaromagna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(emr\.it)$/,"suffix":"emr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(en\.it)$/,"suffix":"en.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(enna\.it)$/,"suffix":"enna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fc\.it)$/,"suffix":"fc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fe\.it)$/,"suffix":"fe.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fermo\.it)$/,"suffix":"fermo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ferrara\.it)$/,"suffix":"ferrara.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fg\.it)$/,"suffix":"fg.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fi\.it)$/,"suffix":"fi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firenze\.it)$/,"suffix":"firenze.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(florence\.it)$/,"suffix":"florence.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fm\.it)$/,"suffix":"fm.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(foggia\.it)$/,"suffix":"foggia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(forli-cesena\.it)$/,"suffix":"forli-cesena.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(forlicesena\.it)$/,"suffix":"forlicesena.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fr\.it)$/,"suffix":"fr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-v-giulia\.it)$/,"suffix":"friuli-v-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-ve-giulia\.it)$/,"suffix":"friuli-ve-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-vegiulia\.it)$/,"suffix":"friuli-vegiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-venezia-giulia\.it)$/,"suffix":"friuli-venezia-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-veneziagiulia\.it)$/,"suffix":"friuli-veneziagiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuli-vgiulia\.it)$/,"suffix":"friuli-vgiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuliv-giulia\.it)$/,"suffix":"friuliv-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friulive-giulia\.it)$/,"suffix":"friulive-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friulivegiulia\.it)$/,"suffix":"friulivegiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friulivenezia-giulia\.it)$/,"suffix":"friulivenezia-giulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friuliveneziagiulia\.it)$/,"suffix":"friuliveneziagiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(friulivgiulia\.it)$/,"suffix":"friulivgiulia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frosinone\.it)$/,"suffix":"frosinone.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fvg\.it)$/,"suffix":"fvg.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ge\.it)$/,"suffix":"ge.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(genoa\.it)$/,"suffix":"genoa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(genova\.it)$/,"suffix":"genova.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.it)$/,"suffix":"go.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gorizia\.it)$/,"suffix":"gorizia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.it)$/,"suffix":"gov.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gr\.it)$/,"suffix":"gr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grosseto\.it)$/,"suffix":"grosseto.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iglesias-carbonia\.it)$/,"suffix":"iglesias-carbonia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iglesiascarbonia\.it)$/,"suffix":"iglesiascarbonia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(im\.it)$/,"suffix":"im.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(imperia\.it)$/,"suffix":"imperia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is\.it)$/,"suffix":"is.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isernia\.it)$/,"suffix":"isernia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kr\.it)$/,"suffix":"kr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(la-spezia\.it)$/,"suffix":"la-spezia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(laquila\.it)$/,"suffix":"laquila.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(laspezia\.it)$/,"suffix":"laspezia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(latina\.it)$/,"suffix":"latina.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(laz\.it)$/,"suffix":"laz.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lazio\.it)$/,"suffix":"lazio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lc\.it)$/,"suffix":"lc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(le\.it)$/,"suffix":"le.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lecce\.it)$/,"suffix":"lecce.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lecco\.it)$/,"suffix":"lecco.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(li\.it)$/,"suffix":"li.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lig\.it)$/,"suffix":"lig.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(liguria\.it)$/,"suffix":"liguria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(livorno\.it)$/,"suffix":"livorno.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lo\.it)$/,"suffix":"lo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lodi\.it)$/,"suffix":"lodi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lom\.it)$/,"suffix":"lom.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lombardia\.it)$/,"suffix":"lombardia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lombardy\.it)$/,"suffix":"lombardy.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lt\.it)$/,"suffix":"lt.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lu\.it)$/,"suffix":"lu.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lucania\.it)$/,"suffix":"lucania.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lucca\.it)$/,"suffix":"lucca.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(macerata\.it)$/,"suffix":"macerata.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mantova\.it)$/,"suffix":"mantova.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mar\.it)$/,"suffix":"mar.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marche\.it)$/,"suffix":"marche.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(massa-carrara\.it)$/,"suffix":"massa-carrara.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(massacarrara\.it)$/,"suffix":"massacarrara.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(matera\.it)$/,"suffix":"matera.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mb\.it)$/,"suffix":"mb.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mc\.it)$/,"suffix":"mc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(me\.it)$/,"suffix":"me.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(medio-campidano\.it)$/,"suffix":"medio-campidano.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mediocampidano\.it)$/,"suffix":"mediocampidano.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(messina\.it)$/,"suffix":"messina.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mi\.it)$/,"suffix":"mi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(milan\.it)$/,"suffix":"milan.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(milano\.it)$/,"suffix":"milano.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mn\.it)$/,"suffix":"mn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mo\.it)$/,"suffix":"mo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(modena\.it)$/,"suffix":"modena.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mol\.it)$/,"suffix":"mol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(molise\.it)$/,"suffix":"molise.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monza-brianza\.it)$/,"suffix":"monza-brianza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monza-e-della-brianza\.it)$/,"suffix":"monza-e-della-brianza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monza\.it)$/,"suffix":"monza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monzabrianza\.it)$/,"suffix":"monzabrianza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monzaebrianza\.it)$/,"suffix":"monzaebrianza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monzaedellabrianza\.it)$/,"suffix":"monzaedellabrianza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ms\.it)$/,"suffix":"ms.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mt\.it)$/,"suffix":"mt.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(na\.it)$/,"suffix":"na.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naples\.it)$/,"suffix":"naples.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(napoli\.it)$/,"suffix":"napoli.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(no\.it)$/,"suffix":"no.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(novara\.it)$/,"suffix":"novara.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nu\.it)$/,"suffix":"nu.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nuoro\.it)$/,"suffix":"nuoro.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(og\.it)$/,"suffix":"og.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogliastra\.it)$/,"suffix":"ogliastra.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olbia-tempio\.it)$/,"suffix":"olbia-tempio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olbiatempio\.it)$/,"suffix":"olbiatempio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.it)$/,"suffix":"or.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oristano\.it)$/,"suffix":"oristano.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ot\.it)$/,"suffix":"ot.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pa\.it)$/,"suffix":"pa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(padova\.it)$/,"suffix":"padova.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(padua\.it)$/,"suffix":"padua.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(palermo\.it)$/,"suffix":"palermo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(parma\.it)$/,"suffix":"parma.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pavia\.it)$/,"suffix":"pavia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pc\.it)$/,"suffix":"pc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pd\.it)$/,"suffix":"pd.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pe\.it)$/,"suffix":"pe.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(perugia\.it)$/,"suffix":"perugia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pesaro-urbino\.it)$/,"suffix":"pesaro-urbino.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pesarourbino\.it)$/,"suffix":"pesarourbino.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pescara\.it)$/,"suffix":"pescara.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pg\.it)$/,"suffix":"pg.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pi\.it)$/,"suffix":"pi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(piacenza\.it)$/,"suffix":"piacenza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(piedmont\.it)$/,"suffix":"piedmont.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(piemonte\.it)$/,"suffix":"piemonte.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pisa\.it)$/,"suffix":"pisa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pistoia\.it)$/,"suffix":"pistoia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pmn\.it)$/,"suffix":"pmn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pn\.it)$/,"suffix":"pn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(po\.it)$/,"suffix":"po.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pordenone\.it)$/,"suffix":"pordenone.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(potenza\.it)$/,"suffix":"potenza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pr\.it)$/,"suffix":"pr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prato\.it)$/,"suffix":"prato.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pt\.it)$/,"suffix":"pt.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pu\.it)$/,"suffix":"pu.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pug\.it)$/,"suffix":"pug.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(puglia\.it)$/,"suffix":"puglia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pv\.it)$/,"suffix":"pv.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pz\.it)$/,"suffix":"pz.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ra\.it)$/,"suffix":"ra.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ragusa\.it)$/,"suffix":"ragusa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ravenna\.it)$/,"suffix":"ravenna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rc\.it)$/,"suffix":"rc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(re\.it)$/,"suffix":"re.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(reggio-calabria\.it)$/,"suffix":"reggio-calabria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(reggio-emilia\.it)$/,"suffix":"reggio-emilia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(reggiocalabria\.it)$/,"suffix":"reggiocalabria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(reggioemilia\.it)$/,"suffix":"reggioemilia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rg\.it)$/,"suffix":"rg.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ri\.it)$/,"suffix":"ri.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rieti\.it)$/,"suffix":"rieti.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rimini\.it)$/,"suffix":"rimini.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rm\.it)$/,"suffix":"rm.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rn\.it)$/,"suffix":"rn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ro\.it)$/,"suffix":"ro.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(roma\.it)$/,"suffix":"roma.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rome\.it)$/,"suffix":"rome.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rovigo\.it)$/,"suffix":"rovigo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.it)$/,"suffix":"sa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salerno\.it)$/,"suffix":"salerno.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sar\.it)$/,"suffix":"sar.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sardegna\.it)$/,"suffix":"sardegna.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sardinia\.it)$/,"suffix":"sardinia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sassari\.it)$/,"suffix":"sassari.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(savona\.it)$/,"suffix":"savona.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(si\.it)$/,"suffix":"si.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sic\.it)$/,"suffix":"sic.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sicilia\.it)$/,"suffix":"sicilia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sicily\.it)$/,"suffix":"sicily.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(siena\.it)$/,"suffix":"siena.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(siracusa\.it)$/,"suffix":"siracusa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(so\.it)$/,"suffix":"so.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sondrio\.it)$/,"suffix":"sondrio.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sp\.it)$/,"suffix":"sp.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sr\.it)$/,"suffix":"sr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ss\.it)$/,"suffix":"ss.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(suedtirol\.it)$/,"suffix":"suedtirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sv\.it)$/,"suffix":"sv.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ta\.it)$/,"suffix":"ta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(taa\.it)$/,"suffix":"taa.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(taranto\.it)$/,"suffix":"taranto.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(te\.it)$/,"suffix":"te.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tempio-olbia\.it)$/,"suffix":"tempio-olbia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tempioolbia\.it)$/,"suffix":"tempioolbia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(teramo\.it)$/,"suffix":"teramo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(terni\.it)$/,"suffix":"terni.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tn\.it)$/,"suffix":"tn.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(to\.it)$/,"suffix":"to.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(torino\.it)$/,"suffix":"torino.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tos\.it)$/,"suffix":"tos.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(toscana\.it)$/,"suffix":"toscana.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tp\.it)$/,"suffix":"tp.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tr\.it)$/,"suffix":"tr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trani-andria-barletta\.it)$/,"suffix":"trani-andria-barletta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trani-barletta-andria\.it)$/,"suffix":"trani-barletta-andria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(traniandriabarletta\.it)$/,"suffix":"traniandriabarletta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tranibarlettaandria\.it)$/,"suffix":"tranibarlettaandria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trapani\.it)$/,"suffix":"trapani.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-a-adige\.it)$/,"suffix":"trentino-a-adige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-aadige\.it)$/,"suffix":"trentino-aadige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-alto-adige\.it)$/,"suffix":"trentino-alto-adige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-altoadige\.it)$/,"suffix":"trentino-altoadige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-s-tirol\.it)$/,"suffix":"trentino-s-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-stirol\.it)$/,"suffix":"trentino-stirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-sud-tirol\.it)$/,"suffix":"trentino-sud-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-sudtirol\.it)$/,"suffix":"trentino-sudtirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-sued-tirol\.it)$/,"suffix":"trentino-sued-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino-suedtirol\.it)$/,"suffix":"trentino-suedtirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentino\.it)$/,"suffix":"trentino.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinoa-adige\.it)$/,"suffix":"trentinoa-adige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinoaadige\.it)$/,"suffix":"trentinoaadige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinoalto-adige\.it)$/,"suffix":"trentinoalto-adige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinoaltoadige\.it)$/,"suffix":"trentinoaltoadige.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinos-tirol\.it)$/,"suffix":"trentinos-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinostirol\.it)$/,"suffix":"trentinostirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinosud-tirol\.it)$/,"suffix":"trentinosud-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinosudtirol\.it)$/,"suffix":"trentinosudtirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinosued-tirol\.it)$/,"suffix":"trentinosued-tirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trentinosuedtirol\.it)$/,"suffix":"trentinosuedtirol.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trento\.it)$/,"suffix":"trento.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(treviso\.it)$/,"suffix":"treviso.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trieste\.it)$/,"suffix":"trieste.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ts\.it)$/,"suffix":"ts.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(turin\.it)$/,"suffix":"turin.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tuscany\.it)$/,"suffix":"tuscany.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.it)$/,"suffix":"tv.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ud\.it)$/,"suffix":"ud.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(udine\.it)$/,"suffix":"udine.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(umb\.it)$/,"suffix":"umb.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(umbria\.it)$/,"suffix":"umbria.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(urbino-pesaro\.it)$/,"suffix":"urbino-pesaro.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(urbinopesaro\.it)$/,"suffix":"urbinopesaro.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(va\.it)$/,"suffix":"va.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(val-d-aosta\.it)$/,"suffix":"val-d-aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(val-daosta\.it)$/,"suffix":"val-daosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vald-aosta\.it)$/,"suffix":"vald-aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valdaosta\.it)$/,"suffix":"valdaosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valle-aosta\.it)$/,"suffix":"valle-aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valle-d-aosta\.it)$/,"suffix":"valle-d-aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valle-daosta\.it)$/,"suffix":"valle-daosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valleaosta\.it)$/,"suffix":"valleaosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valled-aosta\.it)$/,"suffix":"valled-aosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valledaosta\.it)$/,"suffix":"valledaosta.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vallee-aoste\.it)$/,"suffix":"vallee-aoste.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valleeaoste\.it)$/,"suffix":"valleeaoste.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vao\.it)$/,"suffix":"vao.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(varese\.it)$/,"suffix":"varese.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vb\.it)$/,"suffix":"vb.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vc\.it)$/,"suffix":"vc.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vda\.it)$/,"suffix":"vda.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ve\.it)$/,"suffix":"ve.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ven\.it)$/,"suffix":"ven.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(veneto\.it)$/,"suffix":"veneto.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(venezia\.it)$/,"suffix":"venezia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(venice\.it)$/,"suffix":"venice.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(verbania\.it)$/,"suffix":"verbania.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vercelli\.it)$/,"suffix":"vercelli.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(verona\.it)$/,"suffix":"verona.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vi\.it)$/,"suffix":"vi.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vibo-valentia\.it)$/,"suffix":"vibo-valentia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vibovalentia\.it)$/,"suffix":"vibovalentia.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vicenza\.it)$/,"suffix":"vicenza.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(viterbo\.it)$/,"suffix":"viterbo.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vr\.it)$/,"suffix":"vr.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vs\.it)$/,"suffix":"vs.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vt\.it)$/,"suffix":"vt.it"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vv\.it)$/,"suffix":"vv.it"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(it)$/,"suffix":"it"}],"itau":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(itau)$/,"suffix":"itau"}],"itv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(itv)$/,"suffix":"itv"}],"iveco":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(iveco)$/,"suffix":"iveco"}],"iwc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwc)$/,"suffix":"iwc"}],"jaguar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jaguar)$/,"suffix":"jaguar"}],"java":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(java)$/,"suffix":"java"}],"jcb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jcb)$/,"suffix":"jcb"}],"jcp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jcp)$/,"suffix":"jcp"}],"je":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.je)$/,"suffix":"co.je"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.je)$/,"suffix":"net.je"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.je)$/,"suffix":"org.je"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(je)$/,"suffix":"je"}],"jeep":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jeep)$/,"suffix":"jeep"}],"jetzt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jetzt)$/,"suffix":"jetzt"}],"jewelry":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jewelry)$/,"suffix":"jewelry"}],"jio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jio)$/,"suffix":"jio"}],"jlc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jlc)$/,"suffix":"jlc"}],"jll":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jll)$/,"suffix":"jll"}],"jm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.jm)$/,"suffix":"jm"}],"jmp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jmp)$/,"suffix":"jmp"}],"jnj":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jnj)$/,"suffix":"jnj"}],"jo":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.jo)$/,"suffix":"com.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.jo)$/,"suffix":"edu.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.jo)$/,"suffix":"gov.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.jo)$/,"suffix":"mil.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.jo)$/,"suffix":"name.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.jo)$/,"suffix":"net.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.jo)$/,"suffix":"org.jo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.jo)$/,"suffix":"sch.jo"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jo)$/,"suffix":"jo"}],"jobs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jobs)$/,"suffix":"jobs"}],"joburg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(joburg)$/,"suffix":"joburg"}],"jot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jot)$/,"suffix":"jot"}],"joy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(joy)$/,"suffix":"joy"}],"jp":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(abashiri\.hokkaido\.jp)$/,"suffix":"abashiri.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(abeno\.osaka\.jp)$/,"suffix":"abeno.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(abiko\.chiba\.jp)$/,"suffix":"abiko.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(abira\.hokkaido\.jp)$/,"suffix":"abira.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(abu\.yamaguchi\.jp)$/,"suffix":"abu.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(achi\.nagano\.jp)$/,"suffix":"achi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(adachi\.tokyo\.jp)$/,"suffix":"adachi.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aga\.niigata\.jp)$/,"suffix":"aga.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(agano\.niigata\.jp)$/,"suffix":"agano.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(agematsu\.nagano\.jp)$/,"suffix":"agematsu.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aguni\.okinawa\.jp)$/,"suffix":"aguni.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aibetsu\.hokkaido\.jp)$/,"suffix":"aibetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aikawa\.kanagawa\.jp)$/,"suffix":"aikawa.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ainan\.ehime\.jp)$/,"suffix":"ainan.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aioi\.hyogo\.jp)$/,"suffix":"aioi.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aisai\.aichi\.jp)$/,"suffix":"aisai.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aisho\.shiga\.jp)$/,"suffix":"aisho.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aizubange\.fukushima\.jp)$/,"suffix":"aizubange.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aizumi\.tokushima\.jp)$/,"suffix":"aizumi.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aizumisato\.fukushima\.jp)$/,"suffix":"aizumisato.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aizuwakamatsu\.fukushima\.jp)$/,"suffix":"aizuwakamatsu.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akabira\.hokkaido\.jp)$/,"suffix":"akabira.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akagi\.shimane\.jp)$/,"suffix":"akagi.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akaiwa\.okayama\.jp)$/,"suffix":"akaiwa.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akashi\.hyogo\.jp)$/,"suffix":"akashi.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aki\.kochi\.jp)$/,"suffix":"aki.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akiruno\.tokyo\.jp)$/,"suffix":"akiruno.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akishima\.tokyo\.jp)$/,"suffix":"akishima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akita\.akita\.jp)$/,"suffix":"akita.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akkeshi\.hokkaido\.jp)$/,"suffix":"akkeshi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ako\.hyogo\.jp)$/,"suffix":"ako.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(akune\.kagoshima\.jp)$/,"suffix":"akune.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ama\.aichi\.jp)$/,"suffix":"ama.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ama\.shimane\.jp)$/,"suffix":"ama.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(amagasaki\.hyogo\.jp)$/,"suffix":"amagasaki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(amakusa\.kumamoto\.jp)$/,"suffix":"amakusa.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(amami\.kagoshima\.jp)$/,"suffix":"amami.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ami\.ibaraki\.jp)$/,"suffix":"ami.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(anamizu\.ishikawa\.jp)$/,"suffix":"anamizu.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(anan\.nagano\.jp)$/,"suffix":"anan.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(anan\.tokushima\.jp)$/,"suffix":"anan.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ando\.nara\.jp)$/,"suffix":"ando.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(anjo\.aichi\.jp)$/,"suffix":"anjo.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(annaka\.gunma\.jp)$/,"suffix":"annaka.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(anpachi\.gifu\.jp)$/,"suffix":"anpachi.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aogaki\.hyogo\.jp)$/,"suffix":"aogaki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aogashima\.tokyo\.jp)$/,"suffix":"aogashima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aoki\.nagano\.jp)$/,"suffix":"aoki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aomori\.aomori\.jp)$/,"suffix":"aomori.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arai\.shizuoka\.jp)$/,"suffix":"arai.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arakawa\.saitama\.jp)$/,"suffix":"arakawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arakawa\.tokyo\.jp)$/,"suffix":"arakawa.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arao\.kumamoto\.jp)$/,"suffix":"arao.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ariake\.saga\.jp)$/,"suffix":"ariake.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arida\.wakayama\.jp)$/,"suffix":"arida.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aridagawa\.wakayama\.jp)$/,"suffix":"aridagawa.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(arita\.saga\.jp)$/,"suffix":"arita.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asago\.hyogo\.jp)$/,"suffix":"asago.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.chiba\.jp)$/,"suffix":"asahi.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.ibaraki\.jp)$/,"suffix":"asahi.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.mie\.jp)$/,"suffix":"asahi.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.nagano\.jp)$/,"suffix":"asahi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.toyama\.jp)$/,"suffix":"asahi.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahi\.yamagata\.jp)$/,"suffix":"asahi.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asahikawa\.hokkaido\.jp)$/,"suffix":"asahikawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asaka\.saitama\.jp)$/,"suffix":"asaka.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asakawa\.fukushima\.jp)$/,"suffix":"asakawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asakuchi\.okayama\.jp)$/,"suffix":"asakuchi.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asaminami\.hiroshima\.jp)$/,"suffix":"asaminami.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ashibetsu\.hokkaido\.jp)$/,"suffix":"ashibetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ashikaga\.tochigi\.jp)$/,"suffix":"ashikaga.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ashiya\.fukuoka\.jp)$/,"suffix":"ashiya.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ashiya\.hyogo\.jp)$/,"suffix":"ashiya.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ashoro\.hokkaido\.jp)$/,"suffix":"ashoro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aso\.kumamoto\.jp)$/,"suffix":"aso.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(assabu\.hokkaido\.jp)$/,"suffix":"assabu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asuke\.aichi\.jp)$/,"suffix":"asuke.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(atami\.shizuoka\.jp)$/,"suffix":"atami.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(atsugi\.kanagawa\.jp)$/,"suffix":"atsugi.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(atsuma\.hokkaido\.jp)$/,"suffix":"atsuma.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(awaji\.hyogo\.jp)$/,"suffix":"awaji.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(aya\.miyazaki\.jp)$/,"suffix":"aya.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ayabe\.kyoto\.jp)$/,"suffix":"ayabe.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ayagawa\.kagawa\.jp)$/,"suffix":"ayagawa.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ayase\.kanagawa\.jp)$/,"suffix":"ayase.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(azumino\.nagano\.jp)$/,"suffix":"azumino.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bandai\.fukushima\.jp)$/,"suffix":"bandai.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bando\.ibaraki\.jp)$/,"suffix":"bando.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bato\.tochigi\.jp)$/,"suffix":"bato.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(beppu\.oita\.jp)$/,"suffix":"beppu.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bibai\.hokkaido\.jp)$/,"suffix":"bibai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(biei\.hokkaido\.jp)$/,"suffix":"biei.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bifuka\.hokkaido\.jp)$/,"suffix":"bifuka.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bihoro\.hokkaido\.jp)$/,"suffix":"bihoro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(biratori\.hokkaido\.jp)$/,"suffix":"biratori.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bizen\.okayama\.jp)$/,"suffix":"bizen.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bungoono\.oita\.jp)$/,"suffix":"bungoono.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bungotakada\.oita\.jp)$/,"suffix":"bungotakada.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bunkyo\.tokyo\.jp)$/,"suffix":"bunkyo.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(buzen\.fukuoka\.jp)$/,"suffix":"buzen.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chichibu\.saitama\.jp)$/,"suffix":"chichibu.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chigasaki\.kanagawa\.jp)$/,"suffix":"chigasaki.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chihayaakasaka\.osaka\.jp)$/,"suffix":"chihayaakasaka.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chijiwa\.nagasaki\.jp)$/,"suffix":"chijiwa.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikugo\.fukuoka\.jp)$/,"suffix":"chikugo.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikuho\.fukuoka\.jp)$/,"suffix":"chikuho.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikuhoku\.nagano\.jp)$/,"suffix":"chikuhoku.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikujo\.fukuoka\.jp)$/,"suffix":"chikujo.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikuma\.nagano\.jp)$/,"suffix":"chikuma.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikusei\.ibaraki\.jp)$/,"suffix":"chikusei.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikushino\.fukuoka\.jp)$/,"suffix":"chikushino.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chikuzen\.fukuoka\.jp)$/,"suffix":"chikuzen.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chino\.nagano\.jp)$/,"suffix":"chino.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chippubetsu\.hokkaido\.jp)$/,"suffix":"chippubetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chiryu\.aichi\.jp)$/,"suffix":"chiryu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chita\.aichi\.jp)$/,"suffix":"chita.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chitose\.hokkaido\.jp)$/,"suffix":"chitose.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chiyoda\.gunma\.jp)$/,"suffix":"chiyoda.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chiyoda\.tokyo\.jp)$/,"suffix":"chiyoda.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chizu\.tottori\.jp)$/,"suffix":"chizu.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chofu\.tokyo\.jp)$/,"suffix":"chofu.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chonan\.chiba\.jp)$/,"suffix":"chonan.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chosei\.chiba\.jp)$/,"suffix":"chosei.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(choshi\.chiba\.jp)$/,"suffix":"choshi.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(choyo\.kumamoto\.jp)$/,"suffix":"choyo.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuo\.chiba\.jp)$/,"suffix":"chuo.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuo\.fukuoka\.jp)$/,"suffix":"chuo.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuo\.osaka\.jp)$/,"suffix":"chuo.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuo\.tokyo\.jp)$/,"suffix":"chuo.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuo\.yamanashi\.jp)$/,"suffix":"chuo.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawasaki\.jp)$/,"suffix":"city.kawasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitakyushu\.jp)$/,"suffix":"city.kitakyushu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kobe\.jp)$/,"suffix":"city.kobe.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagoya\.jp)$/,"suffix":"city.nagoya.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sapporo\.jp)$/,"suffix":"city.sapporo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sendai\.jp)$/,"suffix":"city.sendai.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokohama\.jp)$/,"suffix":"city.yokohama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(daigo\.ibaraki\.jp)$/,"suffix":"daigo.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(daisen\.akita\.jp)$/,"suffix":"daisen.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(daito\.osaka\.jp)$/,"suffix":"daito.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(daiwa\.hiroshima\.jp)$/,"suffix":"daiwa.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(date\.fukushima\.jp)$/,"suffix":"date.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(date\.hokkaido\.jp)$/,"suffix":"date.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(dazaifu\.fukuoka\.jp)$/,"suffix":"dazaifu.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(doshi\.yamanashi\.jp)$/,"suffix":"doshi.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ebetsu\.hokkaido\.jp)$/,"suffix":"ebetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ebina\.kanagawa\.jp)$/,"suffix":"ebina.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ebino\.miyazaki\.jp)$/,"suffix":"ebino.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(echizen\.fukui\.jp)$/,"suffix":"echizen.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(edogawa\.tokyo\.jp)$/,"suffix":"edogawa.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(eiheiji\.fukui\.jp)$/,"suffix":"eiheiji.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(embetsu\.hokkaido\.jp)$/,"suffix":"embetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ena\.gifu\.jp)$/,"suffix":"ena.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(eniwa\.hokkaido\.jp)$/,"suffix":"eniwa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(erimo\.hokkaido\.jp)$/,"suffix":"erimo.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(esan\.hokkaido\.jp)$/,"suffix":"esan.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(esashi\.hokkaido\.jp)$/,"suffix":"esashi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(etajima\.hiroshima\.jp)$/,"suffix":"etajima.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuchu\.hiroshima\.jp)$/,"suffix":"fuchu.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuchu\.tokyo\.jp)$/,"suffix":"fuchu.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuchu\.toyama\.jp)$/,"suffix":"fuchu.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fudai\.iwate\.jp)$/,"suffix":"fudai.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuefuki\.yamanashi\.jp)$/,"suffix":"fuefuki.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuji\.shizuoka\.jp)$/,"suffix":"fuji.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujieda\.shizuoka\.jp)$/,"suffix":"fujieda.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujiidera\.osaka\.jp)$/,"suffix":"fujiidera.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujikawa\.shizuoka\.jp)$/,"suffix":"fujikawa.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujikawa\.yamanashi\.jp)$/,"suffix":"fujikawa.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujikawaguchiko\.yamanashi\.jp)$/,"suffix":"fujikawaguchiko.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujimi\.nagano\.jp)$/,"suffix":"fujimi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujimi\.saitama\.jp)$/,"suffix":"fujimi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujimino\.saitama\.jp)$/,"suffix":"fujimino.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujinomiya\.shizuoka\.jp)$/,"suffix":"fujinomiya.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujioka\.gunma\.jp)$/,"suffix":"fujioka.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujisato\.akita\.jp)$/,"suffix":"fujisato.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujisawa\.iwate\.jp)$/,"suffix":"fujisawa.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujisawa\.kanagawa\.jp)$/,"suffix":"fujisawa.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujishiro\.ibaraki\.jp)$/,"suffix":"fujishiro.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fujiyoshida\.yamanashi\.jp)$/,"suffix":"fujiyoshida.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukagawa\.hokkaido\.jp)$/,"suffix":"fukagawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukaya\.saitama\.jp)$/,"suffix":"fukaya.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukuchi\.fukuoka\.jp)$/,"suffix":"fukuchi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukuchiyama\.kyoto\.jp)$/,"suffix":"fukuchiyama.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukudomi\.saga\.jp)$/,"suffix":"fukudomi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukui\.fukui\.jp)$/,"suffix":"fukui.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukumitsu\.toyama\.jp)$/,"suffix":"fukumitsu.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukuroi\.shizuoka\.jp)$/,"suffix":"fukuroi.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukusaki\.hyogo\.jp)$/,"suffix":"fukusaki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukushima\.fukushima\.jp)$/,"suffix":"fukushima.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukushima\.hokkaido\.jp)$/,"suffix":"fukushima.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukuyama\.hiroshima\.jp)$/,"suffix":"fukuyama.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(funabashi\.chiba\.jp)$/,"suffix":"funabashi.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(funagata\.yamagata\.jp)$/,"suffix":"funagata.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(funahashi\.toyama\.jp)$/,"suffix":"funahashi.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(furano\.hokkaido\.jp)$/,"suffix":"furano.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(furubira\.hokkaido\.jp)$/,"suffix":"furubira.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(furudono\.fukushima\.jp)$/,"suffix":"furudono.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(furukawa\.miyagi\.jp)$/,"suffix":"furukawa.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuso\.aichi\.jp)$/,"suffix":"fuso.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fussa\.tokyo\.jp)$/,"suffix":"fussa.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(futaba\.fukushima\.jp)$/,"suffix":"futaba.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(futsu\.nagasaki\.jp)$/,"suffix":"futsu.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(futtsu\.chiba\.jp)$/,"suffix":"futtsu.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gamagori\.aichi\.jp)$/,"suffix":"gamagori.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gamo\.shiga\.jp)$/,"suffix":"gamo.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(geisei\.kochi\.jp)$/,"suffix":"geisei.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(genkai\.saga\.jp)$/,"suffix":"genkai.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gifu\.gifu\.jp)$/,"suffix":"gifu.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ginan\.gifu\.jp)$/,"suffix":"ginan.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ginowan\.okinawa\.jp)$/,"suffix":"ginowan.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ginoza\.okinawa\.jp)$/,"suffix":"ginoza.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gobo\.wakayama\.jp)$/,"suffix":"gobo.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(godo\.gifu\.jp)$/,"suffix":"godo.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gojome\.akita\.jp)$/,"suffix":"gojome.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gokase\.miyazaki\.jp)$/,"suffix":"gokase.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gonohe\.aomori\.jp)$/,"suffix":"gonohe.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gose\.nara\.jp)$/,"suffix":"gose.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gosen\.niigata\.jp)$/,"suffix":"gosen.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(goshiki\.hyogo\.jp)$/,"suffix":"goshiki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotemba\.shizuoka\.jp)$/,"suffix":"gotemba.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(goto\.nagasaki\.jp)$/,"suffix":"goto.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotsu\.shimane\.jp)$/,"suffix":"gotsu.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gujo\.gifu\.jp)$/,"suffix":"gujo.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gushikami\.okinawa\.jp)$/,"suffix":"gushikami.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gyokuto\.kumamoto\.jp)$/,"suffix":"gyokuto.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(habikino\.osaka\.jp)$/,"suffix":"habikino.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(haboro\.hokkaido\.jp)$/,"suffix":"haboro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hachijo\.tokyo\.jp)$/,"suffix":"hachijo.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hachinohe\.aomori\.jp)$/,"suffix":"hachinohe.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hachioji\.tokyo\.jp)$/,"suffix":"hachioji.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hachirogata\.akita\.jp)$/,"suffix":"hachirogata.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hadano\.kanagawa\.jp)$/,"suffix":"hadano.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(haebaru\.okinawa\.jp)$/,"suffix":"haebaru.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(haga\.tochigi\.jp)$/,"suffix":"haga.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hagi\.yamaguchi\.jp)$/,"suffix":"hagi.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(haibara\.shizuoka\.jp)$/,"suffix":"haibara.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakata\.fukuoka\.jp)$/,"suffix":"hakata.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakodate\.hokkaido\.jp)$/,"suffix":"hakodate.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakone\.kanagawa\.jp)$/,"suffix":"hakone.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakuba\.nagano\.jp)$/,"suffix":"hakuba.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakui\.ishikawa\.jp)$/,"suffix":"hakui.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hakusan\.ishikawa\.jp)$/,"suffix":"hakusan.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamada\.shimane\.jp)$/,"suffix":"hamada.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamamatsu\.shizuoka\.jp)$/,"suffix":"hamamatsu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamatama\.saga\.jp)$/,"suffix":"hamatama.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamatonbetsu\.hokkaido\.jp)$/,"suffix":"hamatonbetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamura\.tokyo\.jp)$/,"suffix":"hamura.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanamaki\.iwate\.jp)$/,"suffix":"hanamaki.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanamigawa\.chiba\.jp)$/,"suffix":"hanamigawa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanawa\.fukushima\.jp)$/,"suffix":"hanawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(handa\.aichi\.jp)$/,"suffix":"handa.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hannan\.osaka\.jp)$/,"suffix":"hannan.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanno\.saitama\.jp)$/,"suffix":"hanno.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hanyu\.saitama\.jp)$/,"suffix":"hanyu.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(happou\.akita\.jp)$/,"suffix":"happou.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hara\.nagano\.jp)$/,"suffix":"hara.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(harima\.hyogo\.jp)$/,"suffix":"harima.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hasama\.oita\.jp)$/,"suffix":"hasama.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hasami\.nagasaki\.jp)$/,"suffix":"hasami.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hashikami\.aomori\.jp)$/,"suffix":"hashikami.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hashima\.gifu\.jp)$/,"suffix":"hashima.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hashimoto\.wakayama\.jp)$/,"suffix":"hashimoto.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hasuda\.saitama\.jp)$/,"suffix":"hasuda.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hatogaya\.saitama\.jp)$/,"suffix":"hatogaya.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hatoyama\.saitama\.jp)$/,"suffix":"hatoyama.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hatsukaichi\.hiroshima\.jp)$/,"suffix":"hatsukaichi.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hayakawa\.yamanashi\.jp)$/,"suffix":"hayakawa.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hayashima\.okayama\.jp)$/,"suffix":"hayashima.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hazu\.aichi\.jp)$/,"suffix":"hazu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(heguri\.nara\.jp)$/,"suffix":"heguri.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hekinan\.aichi\.jp)$/,"suffix":"hekinan.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hichiso\.gifu\.jp)$/,"suffix":"hichiso.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hida\.gifu\.jp)$/,"suffix":"hida.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hidaka\.hokkaido\.jp)$/,"suffix":"hidaka.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hidaka\.kochi\.jp)$/,"suffix":"hidaka.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hidaka\.saitama\.jp)$/,"suffix":"hidaka.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hidaka\.wakayama\.jp)$/,"suffix":"hidaka.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashi\.fukuoka\.jp)$/,"suffix":"higashi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashi\.fukushima\.jp)$/,"suffix":"higashi.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashi\.okinawa\.jp)$/,"suffix":"higashi.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiagatsuma\.gunma\.jp)$/,"suffix":"higashiagatsuma.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashichichibu\.saitama\.jp)$/,"suffix":"higashichichibu.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashihiroshima\.hiroshima\.jp)$/,"suffix":"higashihiroshima.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiizu\.shizuoka\.jp)$/,"suffix":"higashiizu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiizumo\.shimane\.jp)$/,"suffix":"higashiizumo.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashikagawa\.kagawa\.jp)$/,"suffix":"higashikagawa.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashikagura\.hokkaido\.jp)$/,"suffix":"higashikagura.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashikawa\.hokkaido\.jp)$/,"suffix":"higashikawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashikurume\.tokyo\.jp)$/,"suffix":"higashikurume.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashimatsushima\.miyagi\.jp)$/,"suffix":"higashimatsushima.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashimatsuyama\.saitama\.jp)$/,"suffix":"higashimatsuyama.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashimurayama\.tokyo\.jp)$/,"suffix":"higashimurayama.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashinaruse\.akita\.jp)$/,"suffix":"higashinaruse.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashine\.yamagata\.jp)$/,"suffix":"higashine.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiomi\.shiga\.jp)$/,"suffix":"higashiomi.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiosaka\.osaka\.jp)$/,"suffix":"higashiosaka.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashishirakawa\.gifu\.jp)$/,"suffix":"higashishirakawa.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashisumiyoshi\.osaka\.jp)$/,"suffix":"higashisumiyoshi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashitsuno\.kochi\.jp)$/,"suffix":"higashitsuno.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiura\.aichi\.jp)$/,"suffix":"higashiura.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiyama\.kyoto\.jp)$/,"suffix":"higashiyama.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiyamato\.tokyo\.jp)$/,"suffix":"higashiyamato.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiyodogawa\.osaka\.jp)$/,"suffix":"higashiyodogawa.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(higashiyoshino\.nara\.jp)$/,"suffix":"higashiyoshino.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiji\.oita\.jp)$/,"suffix":"hiji.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hikari\.yamaguchi\.jp)$/,"suffix":"hikari.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hikawa\.shimane\.jp)$/,"suffix":"hikawa.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hikimi\.shimane\.jp)$/,"suffix":"hikimi.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hikone\.shiga\.jp)$/,"suffix":"hikone.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(himeji\.hyogo\.jp)$/,"suffix":"himeji.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(himeshima\.oita\.jp)$/,"suffix":"himeshima.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(himi\.toyama\.jp)$/,"suffix":"himi.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hino\.tokyo\.jp)$/,"suffix":"hino.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hino\.tottori\.jp)$/,"suffix":"hino.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hinode\.tokyo\.jp)$/,"suffix":"hinode.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hinohara\.tokyo\.jp)$/,"suffix":"hinohara.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hioki\.kagoshima\.jp)$/,"suffix":"hioki.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirado\.nagasaki\.jp)$/,"suffix":"hirado.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiraizumi\.iwate\.jp)$/,"suffix":"hiraizumi.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirakata\.osaka\.jp)$/,"suffix":"hirakata.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiranai\.aomori\.jp)$/,"suffix":"hiranai.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirara\.okinawa\.jp)$/,"suffix":"hirara.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirata\.fukushima\.jp)$/,"suffix":"hirata.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiratsuka\.kanagawa\.jp)$/,"suffix":"hiratsuka.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiraya\.nagano\.jp)$/,"suffix":"hiraya.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirogawa\.wakayama\.jp)$/,"suffix":"hirogawa.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirokawa\.fukuoka\.jp)$/,"suffix":"hirokawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirono\.fukushima\.jp)$/,"suffix":"hirono.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirono\.iwate\.jp)$/,"suffix":"hirono.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiroo\.hokkaido\.jp)$/,"suffix":"hiroo.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hirosaki\.aomori\.jp)$/,"suffix":"hirosaki.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hisayama\.fukuoka\.jp)$/,"suffix":"hisayama.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hita\.oita\.jp)$/,"suffix":"hita.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitachi\.ibaraki\.jp)$/,"suffix":"hitachi.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitachinaka\.ibaraki\.jp)$/,"suffix":"hitachinaka.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitachiomiya\.ibaraki\.jp)$/,"suffix":"hitachiomiya.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitachiota\.ibaraki\.jp)$/,"suffix":"hitachiota.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitoyoshi\.kumamoto\.jp)$/,"suffix":"hitoyoshi.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hizen\.saga\.jp)$/,"suffix":"hizen.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hofu\.yamaguchi\.jp)$/,"suffix":"hofu.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hokuryu\.hokkaido\.jp)$/,"suffix":"hokuryu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hokuto\.hokkaido\.jp)$/,"suffix":"hokuto.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hokuto\.yamanashi\.jp)$/,"suffix":"hokuto.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(honai\.ehime\.jp)$/,"suffix":"honai.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(honbetsu\.hokkaido\.jp)$/,"suffix":"honbetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hongo\.hiroshima\.jp)$/,"suffix":"hongo.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(honjo\.akita\.jp)$/,"suffix":"honjo.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(honjo\.saitama\.jp)$/,"suffix":"honjo.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(honjyo\.akita\.jp)$/,"suffix":"honjyo.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(horokanai\.hokkaido\.jp)$/,"suffix":"horokanai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(horonobe\.hokkaido\.jp)$/,"suffix":"horonobe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hyuga\.miyazaki\.jp)$/,"suffix":"hyuga.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibara\.okayama\.jp)$/,"suffix":"ibara.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibaraki\.ibaraki\.jp)$/,"suffix":"ibaraki.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibaraki\.osaka\.jp)$/,"suffix":"ibaraki.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibigawa\.gifu\.jp)$/,"suffix":"ibigawa.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichiba\.tokushima\.jp)$/,"suffix":"ichiba.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichihara\.chiba\.jp)$/,"suffix":"ichihara.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichikai\.tochigi\.jp)$/,"suffix":"ichikai.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichikawa\.chiba\.jp)$/,"suffix":"ichikawa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichikawa\.hyogo\.jp)$/,"suffix":"ichikawa.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichikawamisato\.yamanashi\.jp)$/,"suffix":"ichikawamisato.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichinohe\.iwate\.jp)$/,"suffix":"ichinohe.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichinomiya\.aichi\.jp)$/,"suffix":"ichinomiya.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichinomiya\.chiba\.jp)$/,"suffix":"ichinomiya.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ichinoseki\.iwate\.jp)$/,"suffix":"ichinoseki.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ide\.kyoto\.jp)$/,"suffix":"ide.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iheya\.okinawa\.jp)$/,"suffix":"iheya.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iida\.nagano\.jp)$/,"suffix":"iida.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iide\.yamagata\.jp)$/,"suffix":"iide.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iijima\.nagano\.jp)$/,"suffix":"iijima.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iitate\.fukushima\.jp)$/,"suffix":"iitate.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iiyama\.nagano\.jp)$/,"suffix":"iiyama.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iizuka\.fukuoka\.jp)$/,"suffix":"iizuka.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iizuna\.nagano\.jp)$/,"suffix":"iizuna.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikaruga\.nara\.jp)$/,"suffix":"ikaruga.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikata\.ehime\.jp)$/,"suffix":"ikata.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikawa\.akita\.jp)$/,"suffix":"ikawa.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikeda\.fukui\.jp)$/,"suffix":"ikeda.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikeda\.gifu\.jp)$/,"suffix":"ikeda.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikeda\.hokkaido\.jp)$/,"suffix":"ikeda.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikeda\.nagano\.jp)$/,"suffix":"ikeda.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikeda\.osaka\.jp)$/,"suffix":"ikeda.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iki\.nagasaki\.jp)$/,"suffix":"iki.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikoma\.nara\.jp)$/,"suffix":"ikoma.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ikusaka\.nagano\.jp)$/,"suffix":"ikusaka.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(imabari\.ehime\.jp)$/,"suffix":"imabari.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(imakane\.hokkaido\.jp)$/,"suffix":"imakane.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(imari\.saga\.jp)$/,"suffix":"imari.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(imizu\.toyama\.jp)$/,"suffix":"imizu.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ina\.ibaraki\.jp)$/,"suffix":"ina.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ina\.nagano\.jp)$/,"suffix":"ina.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ina\.saitama\.jp)$/,"suffix":"ina.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inabe\.mie\.jp)$/,"suffix":"inabe.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inagawa\.hyogo\.jp)$/,"suffix":"inagawa.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inagi\.tokyo\.jp)$/,"suffix":"inagi.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inami\.toyama\.jp)$/,"suffix":"inami.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inami\.wakayama\.jp)$/,"suffix":"inami.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inashiki\.ibaraki\.jp)$/,"suffix":"inashiki.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inatsuki\.fukuoka\.jp)$/,"suffix":"inatsuki.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inawashiro\.fukushima\.jp)$/,"suffix":"inawashiro.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inazawa\.aichi\.jp)$/,"suffix":"inazawa.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ine\.kyoto\.jp)$/,"suffix":"ine.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ino\.kochi\.jp)$/,"suffix":"ino.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inuyama\.aichi\.jp)$/,"suffix":"inuyama.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(inzai\.chiba\.jp)$/,"suffix":"inzai.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iruma\.saitama\.jp)$/,"suffix":"iruma.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa\.kagoshima\.jp)$/,"suffix":"isa.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isahaya\.nagasaki\.jp)$/,"suffix":"isahaya.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ise\.mie\.jp)$/,"suffix":"ise.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isehara\.kanagawa\.jp)$/,"suffix":"isehara.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isen\.kagoshima\.jp)$/,"suffix":"isen.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isesaki\.gunma\.jp)$/,"suffix":"isesaki.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishigaki\.okinawa\.jp)$/,"suffix":"ishigaki.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishikari\.hokkaido\.jp)$/,"suffix":"ishikari.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishikawa\.fukushima\.jp)$/,"suffix":"ishikawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishikawa\.okinawa\.jp)$/,"suffix":"ishikawa.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishinomaki\.miyagi\.jp)$/,"suffix":"ishinomaki.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isshiki\.aichi\.jp)$/,"suffix":"isshiki.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(isumi\.chiba\.jp)$/,"suffix":"isumi.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itabashi\.tokyo\.jp)$/,"suffix":"itabashi.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itako\.ibaraki\.jp)$/,"suffix":"itako.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itakura\.gunma\.jp)$/,"suffix":"itakura.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itami\.hyogo\.jp)$/,"suffix":"itami.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itano\.tokushima\.jp)$/,"suffix":"itano.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itayanagi\.aomori\.jp)$/,"suffix":"itayanagi.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ito\.shizuoka\.jp)$/,"suffix":"ito.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itoigawa\.niigata\.jp)$/,"suffix":"itoigawa.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(itoman\.okinawa\.jp)$/,"suffix":"itoman.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwade\.wakayama\.jp)$/,"suffix":"iwade.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwafune\.tochigi\.jp)$/,"suffix":"iwafune.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwaizumi\.iwate\.jp)$/,"suffix":"iwaizumi.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwaki\.fukushima\.jp)$/,"suffix":"iwaki.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwakuni\.yamaguchi\.jp)$/,"suffix":"iwakuni.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwakura\.aichi\.jp)$/,"suffix":"iwakura.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwama\.ibaraki\.jp)$/,"suffix":"iwama.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwamizawa\.hokkaido\.jp)$/,"suffix":"iwamizawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwanai\.hokkaido\.jp)$/,"suffix":"iwanai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwanuma\.miyagi\.jp)$/,"suffix":"iwanuma.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwata\.shizuoka\.jp)$/,"suffix":"iwata.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwate\.iwate\.jp)$/,"suffix":"iwate.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwatsuki\.saitama\.jp)$/,"suffix":"iwatsuki.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(iyo\.ehime\.jp)$/,"suffix":"iyo.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izena\.okinawa\.jp)$/,"suffix":"izena.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izu\.shizuoka\.jp)$/,"suffix":"izu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumi\.kagoshima\.jp)$/,"suffix":"izumi.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumi\.osaka\.jp)$/,"suffix":"izumi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumiotsu\.osaka\.jp)$/,"suffix":"izumiotsu.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumisano\.osaka\.jp)$/,"suffix":"izumisano.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumizaki\.fukushima\.jp)$/,"suffix":"izumizaki.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumo\.shimane\.jp)$/,"suffix":"izumo.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izumozaki\.niigata\.jp)$/,"suffix":"izumozaki.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(izunokuni\.shizuoka\.jp)$/,"suffix":"izunokuni.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(jinsekikogen\.hiroshima\.jp)$/,"suffix":"jinsekikogen.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(joboji\.iwate\.jp)$/,"suffix":"joboji.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(joetsu\.niigata\.jp)$/,"suffix":"joetsu.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(johana\.toyama\.jp)$/,"suffix":"johana.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(joso\.ibaraki\.jp)$/,"suffix":"joso.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(joyo\.kyoto\.jp)$/,"suffix":"joyo.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kadena\.okinawa\.jp)$/,"suffix":"kadena.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kadogawa\.miyazaki\.jp)$/,"suffix":"kadogawa.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kadoma\.osaka\.jp)$/,"suffix":"kadoma.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaga\.ishikawa\.jp)$/,"suffix":"kaga.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagami\.kochi\.jp)$/,"suffix":"kagami.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagamiishi\.fukushima\.jp)$/,"suffix":"kagamiishi.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagamino\.okayama\.jp)$/,"suffix":"kagamino.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagoshima\.kagoshima\.jp)$/,"suffix":"kagoshima.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaho\.fukuoka\.jp)$/,"suffix":"kaho.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kahoku\.ishikawa\.jp)$/,"suffix":"kahoku.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kahoku\.yamagata\.jp)$/,"suffix":"kahoku.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kai\.yamanashi\.jp)$/,"suffix":"kai.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kainan\.tokushima\.jp)$/,"suffix":"kainan.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kainan\.wakayama\.jp)$/,"suffix":"kainan.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaisei\.kanagawa\.jp)$/,"suffix":"kaisei.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaita\.hiroshima\.jp)$/,"suffix":"kaita.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaizuka\.osaka\.jp)$/,"suffix":"kaizuka.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kakamigahara\.gifu\.jp)$/,"suffix":"kakamigahara.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kakegawa\.shizuoka\.jp)$/,"suffix":"kakegawa.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kakinoki\.shimane\.jp)$/,"suffix":"kakinoki.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kakogawa\.hyogo\.jp)$/,"suffix":"kakogawa.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kakuda\.miyagi\.jp)$/,"suffix":"kakuda.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamagaya\.chiba\.jp)$/,"suffix":"kamagaya.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamaishi\.iwate\.jp)$/,"suffix":"kamaishi.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamakura\.kanagawa\.jp)$/,"suffix":"kamakura.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kameoka\.kyoto\.jp)$/,"suffix":"kameoka.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kameyama\.mie\.jp)$/,"suffix":"kameyama.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kami\.kochi\.jp)$/,"suffix":"kami.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kami\.miyagi\.jp)$/,"suffix":"kami.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamiamakusa\.kumamoto\.jp)$/,"suffix":"kamiamakusa.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamifurano\.hokkaido\.jp)$/,"suffix":"kamifurano.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamigori\.hyogo\.jp)$/,"suffix":"kamigori.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamiichi\.toyama\.jp)$/,"suffix":"kamiichi.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamiizumi\.saitama\.jp)$/,"suffix":"kamiizumi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamijima\.ehime\.jp)$/,"suffix":"kamijima.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamikawa\.hokkaido\.jp)$/,"suffix":"kamikawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamikawa\.hyogo\.jp)$/,"suffix":"kamikawa.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamikawa\.saitama\.jp)$/,"suffix":"kamikawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamikitayama\.nara\.jp)$/,"suffix":"kamikitayama.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamikoani\.akita\.jp)$/,"suffix":"kamikoani.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamimine\.saga\.jp)$/,"suffix":"kamimine.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaminokawa\.tochigi\.jp)$/,"suffix":"kaminokawa.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaminoyama\.yamagata\.jp)$/,"suffix":"kaminoyama.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamioka\.akita\.jp)$/,"suffix":"kamioka.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamisato\.saitama\.jp)$/,"suffix":"kamisato.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamishihoro\.hokkaido\.jp)$/,"suffix":"kamishihoro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamisu\.ibaraki\.jp)$/,"suffix":"kamisu.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamisunagawa\.hokkaido\.jp)$/,"suffix":"kamisunagawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamitonda\.wakayama\.jp)$/,"suffix":"kamitonda.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamitsue\.oita\.jp)$/,"suffix":"kamitsue.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamo\.kyoto\.jp)$/,"suffix":"kamo.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamo\.niigata\.jp)$/,"suffix":"kamo.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamoenai\.hokkaido\.jp)$/,"suffix":"kamoenai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamogawa\.chiba\.jp)$/,"suffix":"kamogawa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanan\.osaka\.jp)$/,"suffix":"kanan.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanazawa\.ishikawa\.jp)$/,"suffix":"kanazawa.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanegasaki\.iwate\.jp)$/,"suffix":"kanegasaki.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaneyama\.fukushima\.jp)$/,"suffix":"kaneyama.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaneyama\.yamagata\.jp)$/,"suffix":"kaneyama.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kani\.gifu\.jp)$/,"suffix":"kani.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanie\.aichi\.jp)$/,"suffix":"kanie.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanmaki\.nara\.jp)$/,"suffix":"kanmaki.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanna\.gunma\.jp)$/,"suffix":"kanna.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kannami\.shizuoka\.jp)$/,"suffix":"kannami.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanonji\.kagawa\.jp)$/,"suffix":"kanonji.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanoya\.kagoshima\.jp)$/,"suffix":"kanoya.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanra\.gunma\.jp)$/,"suffix":"kanra.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanuma\.tochigi\.jp)$/,"suffix":"kanuma.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanzaki\.saga\.jp)$/,"suffix":"kanzaki.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(karasuyama\.tochigi\.jp)$/,"suffix":"karasuyama.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(karatsu\.saga\.jp)$/,"suffix":"karatsu.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kariwa\.niigata\.jp)$/,"suffix":"kariwa.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kariya\.aichi\.jp)$/,"suffix":"kariya.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(karuizawa\.nagano\.jp)$/,"suffix":"karuizawa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(karumai\.iwate\.jp)$/,"suffix":"karumai.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasahara\.gifu\.jp)$/,"suffix":"kasahara.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasai\.hyogo\.jp)$/,"suffix":"kasai.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasama\.ibaraki\.jp)$/,"suffix":"kasama.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasamatsu\.gifu\.jp)$/,"suffix":"kasamatsu.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasaoka\.okayama\.jp)$/,"suffix":"kasaoka.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashiba\.nara\.jp)$/,"suffix":"kashiba.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashihara\.nara\.jp)$/,"suffix":"kashihara.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashima\.ibaraki\.jp)$/,"suffix":"kashima.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashima\.kumamoto\.jp)$/,"suffix":"kashima.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashima\.saga\.jp)$/,"suffix":"kashima.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashiwa\.chiba\.jp)$/,"suffix":"kashiwa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashiwara\.osaka\.jp)$/,"suffix":"kashiwara.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kashiwazaki\.niigata\.jp)$/,"suffix":"kashiwazaki.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasuga\.fukuoka\.jp)$/,"suffix":"kasuga.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasuga\.hyogo\.jp)$/,"suffix":"kasuga.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasugai\.aichi\.jp)$/,"suffix":"kasugai.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasukabe\.saitama\.jp)$/,"suffix":"kasukabe.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasumigaura\.ibaraki\.jp)$/,"suffix":"kasumigaura.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kasuya\.fukuoka\.jp)$/,"suffix":"kasuya.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katagami\.akita\.jp)$/,"suffix":"katagami.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katano\.osaka\.jp)$/,"suffix":"katano.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katashina\.gunma\.jp)$/,"suffix":"katashina.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katori\.chiba\.jp)$/,"suffix":"katori.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katsuragi\.nara\.jp)$/,"suffix":"katsuragi.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katsuragi\.wakayama\.jp)$/,"suffix":"katsuragi.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katsushika\.tokyo\.jp)$/,"suffix":"katsushika.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katsuura\.chiba\.jp)$/,"suffix":"katsuura.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(katsuyama\.fukui\.jp)$/,"suffix":"katsuyama.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawaba\.gunma\.jp)$/,"suffix":"kawaba.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawachinagano\.osaka\.jp)$/,"suffix":"kawachinagano.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawagoe\.mie\.jp)$/,"suffix":"kawagoe.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawagoe\.saitama\.jp)$/,"suffix":"kawagoe.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawaguchi\.saitama\.jp)$/,"suffix":"kawaguchi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawahara\.tottori\.jp)$/,"suffix":"kawahara.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawai\.iwate\.jp)$/,"suffix":"kawai.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawai\.nara\.jp)$/,"suffix":"kawai.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawajima\.saitama\.jp)$/,"suffix":"kawajima.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawakami\.nagano\.jp)$/,"suffix":"kawakami.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawakami\.nara\.jp)$/,"suffix":"kawakami.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawakita\.ishikawa\.jp)$/,"suffix":"kawakita.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawamata\.fukushima\.jp)$/,"suffix":"kawamata.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawaminami\.miyazaki\.jp)$/,"suffix":"kawaminami.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawanabe\.kagoshima\.jp)$/,"suffix":"kawanabe.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawanehon\.shizuoka\.jp)$/,"suffix":"kawanehon.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawanishi\.hyogo\.jp)$/,"suffix":"kawanishi.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawanishi\.nara\.jp)$/,"suffix":"kawanishi.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawanishi\.yamagata\.jp)$/,"suffix":"kawanishi.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawara\.fukuoka\.jp)$/,"suffix":"kawara.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawasaki\.miyagi\.jp)$/,"suffix":"kawasaki.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawatana\.nagasaki\.jp)$/,"suffix":"kawatana.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawaue\.gifu\.jp)$/,"suffix":"kawaue.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kawazu\.shizuoka\.jp)$/,"suffix":"kawazu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kayabe\.hokkaido\.jp)$/,"suffix":"kayabe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kazo\.saitama\.jp)$/,"suffix":"kazo.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kazuno\.akita\.jp)$/,"suffix":"kazuno.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(keisen\.fukuoka\.jp)$/,"suffix":"keisen.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kembuchi\.hokkaido\.jp)$/,"suffix":"kembuchi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kesennuma\.miyagi\.jp)$/,"suffix":"kesennuma.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kibichuo\.okayama\.jp)$/,"suffix":"kibichuo.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiho\.mie\.jp)$/,"suffix":"kiho.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kihoku\.ehime\.jp)$/,"suffix":"kihoku.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kijo\.miyazaki\.jp)$/,"suffix":"kijo.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kikonai\.hokkaido\.jp)$/,"suffix":"kikonai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kikuchi\.kumamoto\.jp)$/,"suffix":"kikuchi.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kikugawa\.shizuoka\.jp)$/,"suffix":"kikugawa.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kimino\.wakayama\.jp)$/,"suffix":"kimino.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kimitsu\.chiba\.jp)$/,"suffix":"kimitsu.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kimobetsu\.hokkaido\.jp)$/,"suffix":"kimobetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kin\.okinawa\.jp)$/,"suffix":"kin.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kinko\.kagoshima\.jp)$/,"suffix":"kinko.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kinokawa\.wakayama\.jp)$/,"suffix":"kinokawa.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kira\.aichi\.jp)$/,"suffix":"kira.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiryu\.gunma\.jp)$/,"suffix":"kiryu.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kisarazu\.chiba\.jp)$/,"suffix":"kisarazu.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kishiwada\.osaka\.jp)$/,"suffix":"kishiwada.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiso\.nagano\.jp)$/,"suffix":"kiso.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kisofukushima\.nagano\.jp)$/,"suffix":"kisofukushima.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kisosaki\.mie\.jp)$/,"suffix":"kisosaki.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kita\.kyoto\.jp)$/,"suffix":"kita.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kita\.osaka\.jp)$/,"suffix":"kita.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kita\.tokyo\.jp)$/,"suffix":"kita.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitaaiki\.nagano\.jp)$/,"suffix":"kitaaiki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitaakita\.akita\.jp)$/,"suffix":"kitaakita.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitadaito\.okinawa\.jp)$/,"suffix":"kitadaito.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitagata\.gifu\.jp)$/,"suffix":"kitagata.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitagata\.saga\.jp)$/,"suffix":"kitagata.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitagawa\.kochi\.jp)$/,"suffix":"kitagawa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitagawa\.miyazaki\.jp)$/,"suffix":"kitagawa.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitahata\.saga\.jp)$/,"suffix":"kitahata.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitahiroshima\.hokkaido\.jp)$/,"suffix":"kitahiroshima.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitakami\.iwate\.jp)$/,"suffix":"kitakami.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitakata\.fukushima\.jp)$/,"suffix":"kitakata.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitakata\.miyazaki\.jp)$/,"suffix":"kitakata.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitami\.hokkaido\.jp)$/,"suffix":"kitami.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitamoto\.saitama\.jp)$/,"suffix":"kitamoto.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitanakagusuku\.okinawa\.jp)$/,"suffix":"kitanakagusuku.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitashiobara\.fukushima\.jp)$/,"suffix":"kitashiobara.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitaura\.miyazaki\.jp)$/,"suffix":"kitaura.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitayama\.wakayama\.jp)$/,"suffix":"kitayama.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiwa\.mie\.jp)$/,"suffix":"kiwa.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiyama\.saga\.jp)$/,"suffix":"kiyama.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiyokawa\.kanagawa\.jp)$/,"suffix":"kiyokawa.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiyosato\.hokkaido\.jp)$/,"suffix":"kiyosato.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiyose\.tokyo\.jp)$/,"suffix":"kiyose.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiyosu\.aichi\.jp)$/,"suffix":"kiyosu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kizu\.kyoto\.jp)$/,"suffix":"kizu.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kobayashi\.miyazaki\.jp)$/,"suffix":"kobayashi.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kochi\.kochi\.jp)$/,"suffix":"kochi.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kodaira\.tokyo\.jp)$/,"suffix":"kodaira.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kofu\.yamanashi\.jp)$/,"suffix":"kofu.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koga\.fukuoka\.jp)$/,"suffix":"koga.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koga\.ibaraki\.jp)$/,"suffix":"koga.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koganei\.tokyo\.jp)$/,"suffix":"koganei.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koge\.tottori\.jp)$/,"suffix":"koge.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koka\.shiga\.jp)$/,"suffix":"koka.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kokonoe\.oita\.jp)$/,"suffix":"kokonoe.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kokubunji\.tokyo\.jp)$/,"suffix":"kokubunji.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komae\.tokyo\.jp)$/,"suffix":"komae.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komagane\.nagano\.jp)$/,"suffix":"komagane.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komaki\.aichi\.jp)$/,"suffix":"komaki.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komatsu\.ishikawa\.jp)$/,"suffix":"komatsu.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komatsushima\.tokushima\.jp)$/,"suffix":"komatsushima.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komono\.mie\.jp)$/,"suffix":"komono.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(komoro\.nagano\.jp)$/,"suffix":"komoro.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(konan\.aichi\.jp)$/,"suffix":"konan.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(konan\.shiga\.jp)$/,"suffix":"konan.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koori\.fukushima\.jp)$/,"suffix":"koori.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koriyama\.fukushima\.jp)$/,"suffix":"koriyama.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koryo\.nara\.jp)$/,"suffix":"koryo.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosa\.kumamoto\.jp)$/,"suffix":"kosa.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosai\.shizuoka\.jp)$/,"suffix":"kosai.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosaka\.akita\.jp)$/,"suffix":"kosaka.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosei\.shiga\.jp)$/,"suffix":"kosei.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koshigaya\.saitama\.jp)$/,"suffix":"koshigaya.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koshimizu\.hokkaido\.jp)$/,"suffix":"koshimizu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koshu\.yamanashi\.jp)$/,"suffix":"koshu.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosuge\.yamanashi\.jp)$/,"suffix":"kosuge.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kota\.aichi\.jp)$/,"suffix":"kota.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koto\.shiga\.jp)$/,"suffix":"koto.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koto\.tokyo\.jp)$/,"suffix":"koto.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kotohira\.kagawa\.jp)$/,"suffix":"kotohira.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kotoura\.tottori\.jp)$/,"suffix":"kotoura.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kouhoku\.saga\.jp)$/,"suffix":"kouhoku.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kounosu\.saitama\.jp)$/,"suffix":"kounosu.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kouyama\.kagoshima\.jp)$/,"suffix":"kouyama.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kouzushima\.tokyo\.jp)$/,"suffix":"kouzushima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koya\.wakayama\.jp)$/,"suffix":"koya.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(koza\.wakayama\.jp)$/,"suffix":"koza.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kozagawa\.wakayama\.jp)$/,"suffix":"kozagawa.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kozaki\.chiba\.jp)$/,"suffix":"kozaki.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuchinotsu\.nagasaki\.jp)$/,"suffix":"kuchinotsu.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kudamatsu\.yamaguchi\.jp)$/,"suffix":"kudamatsu.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kudoyama\.wakayama\.jp)$/,"suffix":"kudoyama.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kui\.hiroshima\.jp)$/,"suffix":"kui.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuji\.iwate\.jp)$/,"suffix":"kuji.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuju\.oita\.jp)$/,"suffix":"kuju.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kujukuri\.chiba\.jp)$/,"suffix":"kujukuri.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuki\.saitama\.jp)$/,"suffix":"kuki.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumagaya\.saitama\.jp)$/,"suffix":"kumagaya.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumakogen\.ehime\.jp)$/,"suffix":"kumakogen.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumamoto\.kumamoto\.jp)$/,"suffix":"kumamoto.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumano\.hiroshima\.jp)$/,"suffix":"kumano.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumano\.mie\.jp)$/,"suffix":"kumano.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumatori\.osaka\.jp)$/,"suffix":"kumatori.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumejima\.okinawa\.jp)$/,"suffix":"kumejima.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumenan\.okayama\.jp)$/,"suffix":"kumenan.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumiyama\.kyoto\.jp)$/,"suffix":"kumiyama.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunigami\.okinawa\.jp)$/,"suffix":"kunigami.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunimi\.fukushima\.jp)$/,"suffix":"kunimi.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunisaki\.oita\.jp)$/,"suffix":"kunisaki.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunitachi\.tokyo\.jp)$/,"suffix":"kunitachi.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunitomi\.miyazaki\.jp)$/,"suffix":"kunitomi.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunneppu\.hokkaido\.jp)$/,"suffix":"kunneppu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunohe\.iwate\.jp)$/,"suffix":"kunohe.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurashiki\.okayama\.jp)$/,"suffix":"kurashiki.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurate\.fukuoka\.jp)$/,"suffix":"kurate.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kure\.hiroshima\.jp)$/,"suffix":"kure.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuriyama\.hokkaido\.jp)$/,"suffix":"kuriyama.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurobe\.toyama\.jp)$/,"suffix":"kurobe.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurogi\.fukuoka\.jp)$/,"suffix":"kurogi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuroishi\.aomori\.jp)$/,"suffix":"kuroishi.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuroiso\.tochigi\.jp)$/,"suffix":"kuroiso.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuromatsunai\.hokkaido\.jp)$/,"suffix":"kuromatsunai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurotaki\.nara\.jp)$/,"suffix":"kurotaki.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurume\.fukuoka\.jp)$/,"suffix":"kurume.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kusatsu\.gunma\.jp)$/,"suffix":"kusatsu.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kusatsu\.shiga\.jp)$/,"suffix":"kusatsu.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kushima\.miyazaki\.jp)$/,"suffix":"kushima.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kushimoto\.wakayama\.jp)$/,"suffix":"kushimoto.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kushiro\.hokkaido\.jp)$/,"suffix":"kushiro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kusu\.oita\.jp)$/,"suffix":"kusu.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kutchan\.hokkaido\.jp)$/,"suffix":"kutchan.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuwana\.mie\.jp)$/,"suffix":"kuwana.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuzumaki\.iwate\.jp)$/,"suffix":"kuzumaki.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyonan\.chiba\.jp)$/,"suffix":"kyonan.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyotamba\.kyoto\.jp)$/,"suffix":"kyotamba.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyotanabe\.kyoto\.jp)$/,"suffix":"kyotanabe.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyotango\.kyoto\.jp)$/,"suffix":"kyotango.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyowa\.akita\.jp)$/,"suffix":"kyowa.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyowa\.hokkaido\.jp)$/,"suffix":"kyowa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyuragi\.saga\.jp)$/,"suffix":"kyuragi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(machida\.tokyo\.jp)$/,"suffix":"machida.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(maebashi\.gunma\.jp)$/,"suffix":"maebashi.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(maibara\.shiga\.jp)$/,"suffix":"maibara.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(maizuru\.kyoto\.jp)$/,"suffix":"maizuru.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(makinohara\.shizuoka\.jp)$/,"suffix":"makinohara.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(makurazaki\.kagoshima\.jp)$/,"suffix":"makurazaki.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mamurogawa\.yamagata\.jp)$/,"suffix":"mamurogawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(maniwa\.okayama\.jp)$/,"suffix":"maniwa.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(manno\.kagawa\.jp)$/,"suffix":"manno.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(marugame\.kagawa\.jp)$/,"suffix":"marugame.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(marumori\.miyagi\.jp)$/,"suffix":"marumori.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(masaki\.ehime\.jp)$/,"suffix":"masaki.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mashike\.hokkaido\.jp)$/,"suffix":"mashike.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mashiki\.kumamoto\.jp)$/,"suffix":"mashiki.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mashiko\.tochigi\.jp)$/,"suffix":"mashiko.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(masuda\.shimane\.jp)$/,"suffix":"masuda.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsubara\.osaka\.jp)$/,"suffix":"matsubara.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsubushi\.saitama\.jp)$/,"suffix":"matsubushi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsuda\.kanagawa\.jp)$/,"suffix":"matsuda.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsudo\.chiba\.jp)$/,"suffix":"matsudo.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsue\.shimane\.jp)$/,"suffix":"matsue.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsukawa\.nagano\.jp)$/,"suffix":"matsukawa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsumae\.hokkaido\.jp)$/,"suffix":"matsumae.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsumoto\.kagoshima\.jp)$/,"suffix":"matsumoto.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsumoto\.nagano\.jp)$/,"suffix":"matsumoto.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsuno\.ehime\.jp)$/,"suffix":"matsuno.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsusaka\.mie\.jp)$/,"suffix":"matsusaka.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsushige\.tokushima\.jp)$/,"suffix":"matsushige.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsushima\.miyagi\.jp)$/,"suffix":"matsushima.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsuura\.nagasaki\.jp)$/,"suffix":"matsuura.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsuyama\.ehime\.jp)$/,"suffix":"matsuyama.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(matsuzaki\.shizuoka\.jp)$/,"suffix":"matsuzaki.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(meguro\.tokyo\.jp)$/,"suffix":"meguro.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(meiwa\.gunma\.jp)$/,"suffix":"meiwa.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(meiwa\.mie\.jp)$/,"suffix":"meiwa.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miasa\.nagano\.jp)$/,"suffix":"miasa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mibu\.tochigi\.jp)$/,"suffix":"mibu.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(midori\.chiba\.jp)$/,"suffix":"midori.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(midori\.gunma\.jp)$/,"suffix":"midori.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mifune\.kumamoto\.jp)$/,"suffix":"mifune.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihama\.aichi\.jp)$/,"suffix":"mihama.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihama\.chiba\.jp)$/,"suffix":"mihama.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihama\.fukui\.jp)$/,"suffix":"mihama.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihama\.mie\.jp)$/,"suffix":"mihama.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihama\.wakayama\.jp)$/,"suffix":"mihama.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihara\.hiroshima\.jp)$/,"suffix":"mihara.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mihara\.kochi\.jp)$/,"suffix":"mihara.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miharu\.fukushima\.jp)$/,"suffix":"miharu.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miho\.ibaraki\.jp)$/,"suffix":"miho.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mikasa\.hokkaido\.jp)$/,"suffix":"mikasa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mikawa\.yamagata\.jp)$/,"suffix":"mikawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miki\.hyogo\.jp)$/,"suffix":"miki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mima\.tokushima\.jp)$/,"suffix":"mima.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mimata\.miyazaki\.jp)$/,"suffix":"mimata.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minakami\.gunma\.jp)$/,"suffix":"minakami.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamata\.kumamoto\.jp)$/,"suffix":"minamata.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minami-alps\.yamanashi\.jp)$/,"suffix":"minami-alps.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minami\.fukuoka\.jp)$/,"suffix":"minami.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minami\.kyoto\.jp)$/,"suffix":"minami.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minami\.tokushima\.jp)$/,"suffix":"minami.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiaiki\.nagano\.jp)$/,"suffix":"minamiaiki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiashigara\.kanagawa\.jp)$/,"suffix":"minamiashigara.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiawaji\.hyogo\.jp)$/,"suffix":"minamiawaji.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiboso\.chiba\.jp)$/,"suffix":"minamiboso.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamidaito\.okinawa\.jp)$/,"suffix":"minamidaito.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiechizen\.fukui\.jp)$/,"suffix":"minamiechizen.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamifurano\.hokkaido\.jp)$/,"suffix":"minamifurano.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiise\.mie\.jp)$/,"suffix":"minamiise.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiizu\.shizuoka\.jp)$/,"suffix":"minamiizu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamimaki\.nagano\.jp)$/,"suffix":"minamimaki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiminowa\.nagano\.jp)$/,"suffix":"minamiminowa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamioguni\.kumamoto\.jp)$/,"suffix":"minamioguni.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamisanriku\.miyagi\.jp)$/,"suffix":"minamisanriku.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamitane\.kagoshima\.jp)$/,"suffix":"minamitane.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiuonuma\.niigata\.jp)$/,"suffix":"minamiuonuma.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minamiyamashiro\.kyoto\.jp)$/,"suffix":"minamiyamashiro.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minano\.saitama\.jp)$/,"suffix":"minano.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minato\.osaka\.jp)$/,"suffix":"minato.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minato\.tokyo\.jp)$/,"suffix":"minato.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mino\.gifu\.jp)$/,"suffix":"mino.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minobu\.yamanashi\.jp)$/,"suffix":"minobu.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minoh\.osaka\.jp)$/,"suffix":"minoh.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minokamo\.gifu\.jp)$/,"suffix":"minokamo.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(minowa\.nagano\.jp)$/,"suffix":"minowa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misaki\.okayama\.jp)$/,"suffix":"misaki.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misaki\.osaka\.jp)$/,"suffix":"misaki.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misasa\.tottori\.jp)$/,"suffix":"misasa.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misato\.akita\.jp)$/,"suffix":"misato.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misato\.miyagi\.jp)$/,"suffix":"misato.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misato\.saitama\.jp)$/,"suffix":"misato.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misato\.shimane\.jp)$/,"suffix":"misato.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misato\.wakayama\.jp)$/,"suffix":"misato.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misawa\.aomori\.jp)$/,"suffix":"misawa.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mishima\.fukushima\.jp)$/,"suffix":"mishima.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mishima\.shizuoka\.jp)$/,"suffix":"mishima.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(misugi\.mie\.jp)$/,"suffix":"misugi.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitaka\.tokyo\.jp)$/,"suffix":"mitaka.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitake\.gifu\.jp)$/,"suffix":"mitake.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitane\.akita\.jp)$/,"suffix":"mitane.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mito\.ibaraki\.jp)$/,"suffix":"mito.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitou\.yamaguchi\.jp)$/,"suffix":"mitou.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitoyo\.kagawa\.jp)$/,"suffix":"mitoyo.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitsue\.nara\.jp)$/,"suffix":"mitsue.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitsuke\.niigata\.jp)$/,"suffix":"mitsuke.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miura\.kanagawa\.jp)$/,"suffix":"miura.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyada\.nagano\.jp)$/,"suffix":"miyada.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyake\.nara\.jp)$/,"suffix":"miyake.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyako\.fukuoka\.jp)$/,"suffix":"miyako.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyako\.iwate\.jp)$/,"suffix":"miyako.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyakonojo\.miyazaki\.jp)$/,"suffix":"miyakonojo.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyama\.fukuoka\.jp)$/,"suffix":"miyama.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyama\.mie\.jp)$/,"suffix":"miyama.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyashiro\.saitama\.jp)$/,"suffix":"miyashiro.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyawaka\.fukuoka\.jp)$/,"suffix":"miyawaka.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyazaki\.miyazaki\.jp)$/,"suffix":"miyazaki.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyazu\.kyoto\.jp)$/,"suffix":"miyazu.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyoshi\.aichi\.jp)$/,"suffix":"miyoshi.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyoshi\.hiroshima\.jp)$/,"suffix":"miyoshi.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyoshi\.saitama\.jp)$/,"suffix":"miyoshi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyoshi\.tokushima\.jp)$/,"suffix":"miyoshi.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyota\.nagano\.jp)$/,"suffix":"miyota.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mizuho\.tokyo\.jp)$/,"suffix":"mizuho.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mizumaki\.fukuoka\.jp)$/,"suffix":"mizumaki.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mizunami\.gifu\.jp)$/,"suffix":"mizunami.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mizusawa\.iwate\.jp)$/,"suffix":"mizusawa.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobara\.chiba\.jp)$/,"suffix":"mobara.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mochizuki\.nagano\.jp)$/,"suffix":"mochizuki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moka\.tochigi\.jp)$/,"suffix":"moka.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mombetsu\.hokkaido\.jp)$/,"suffix":"mombetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moriguchi\.osaka\.jp)$/,"suffix":"moriguchi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(morimachi\.shizuoka\.jp)$/,"suffix":"morimachi.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(morioka\.iwate\.jp)$/,"suffix":"morioka.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moriya\.ibaraki\.jp)$/,"suffix":"moriya.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moriyama\.shiga\.jp)$/,"suffix":"moriyama.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moriyoshi\.akita\.jp)$/,"suffix":"moriyoshi.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(morotsuka\.miyazaki\.jp)$/,"suffix":"morotsuka.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moroyama\.saitama\.jp)$/,"suffix":"moroyama.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(moseushi\.hokkaido\.jp)$/,"suffix":"moseushi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(motegi\.tochigi\.jp)$/,"suffix":"motegi.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(motobu\.okinawa\.jp)$/,"suffix":"motobu.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(motosu\.gifu\.jp)$/,"suffix":"motosu.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(motoyama\.kochi\.jp)$/,"suffix":"motoyama.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mugi\.tokushima\.jp)$/,"suffix":"mugi.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(muika\.niigata\.jp)$/,"suffix":"muika.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mukawa\.hokkaido\.jp)$/,"suffix":"mukawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(muko\.kyoto\.jp)$/,"suffix":"muko.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(munakata\.fukuoka\.jp)$/,"suffix":"munakata.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(murakami\.niigata\.jp)$/,"suffix":"murakami.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(murata\.miyagi\.jp)$/,"suffix":"murata.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(murayama\.yamagata\.jp)$/,"suffix":"murayama.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(muroran\.hokkaido\.jp)$/,"suffix":"muroran.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(muroto\.kochi\.jp)$/,"suffix":"muroto.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(musashimurayama\.tokyo\.jp)$/,"suffix":"musashimurayama.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(musashino\.tokyo\.jp)$/,"suffix":"musashino.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mutsu\.aomori\.jp)$/,"suffix":"mutsu.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mutsuzawa\.chiba\.jp)$/,"suffix":"mutsuzawa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(myoko\.niigata\.jp)$/,"suffix":"myoko.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nabari\.mie\.jp)$/,"suffix":"nabari.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nachikatsuura\.wakayama\.jp)$/,"suffix":"nachikatsuura.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagahama\.shiga\.jp)$/,"suffix":"nagahama.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagai\.yamagata\.jp)$/,"suffix":"nagai.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagano\.nagano\.jp)$/,"suffix":"nagano.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naganohara\.gunma\.jp)$/,"suffix":"naganohara.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagaoka\.niigata\.jp)$/,"suffix":"nagaoka.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagaokakyo\.kyoto\.jp)$/,"suffix":"nagaokakyo.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagara\.chiba\.jp)$/,"suffix":"nagara.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagareyama\.chiba\.jp)$/,"suffix":"nagareyama.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagasaki\.nagasaki\.jp)$/,"suffix":"nagasaki.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagasu\.kumamoto\.jp)$/,"suffix":"nagasu.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagato\.yamaguchi\.jp)$/,"suffix":"nagato.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagatoro\.saitama\.jp)$/,"suffix":"nagatoro.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagawa\.nagano\.jp)$/,"suffix":"nagawa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagi\.okayama\.jp)$/,"suffix":"nagi.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagiso\.nagano\.jp)$/,"suffix":"nagiso.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nago\.okinawa\.jp)$/,"suffix":"nago.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naha\.okinawa\.jp)$/,"suffix":"naha.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nahari\.kochi\.jp)$/,"suffix":"nahari.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naie\.hokkaido\.jp)$/,"suffix":"naie.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naka\.hiroshima\.jp)$/,"suffix":"naka.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naka\.ibaraki\.jp)$/,"suffix":"naka.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakadomari\.aomori\.jp)$/,"suffix":"nakadomari.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagawa\.fukuoka\.jp)$/,"suffix":"nakagawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagawa\.hokkaido\.jp)$/,"suffix":"nakagawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagawa\.nagano\.jp)$/,"suffix":"nakagawa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagawa\.tokushima\.jp)$/,"suffix":"nakagawa.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagusuku\.okinawa\.jp)$/,"suffix":"nakagusuku.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakagyo\.kyoto\.jp)$/,"suffix":"nakagyo.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakai\.kanagawa\.jp)$/,"suffix":"nakai.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakama\.fukuoka\.jp)$/,"suffix":"nakama.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakamichi\.yamanashi\.jp)$/,"suffix":"nakamichi.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakamura\.kochi\.jp)$/,"suffix":"nakamura.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakaniikawa\.toyama\.jp)$/,"suffix":"nakaniikawa.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakano\.nagano\.jp)$/,"suffix":"nakano.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakano\.tokyo\.jp)$/,"suffix":"nakano.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakanojo\.gunma\.jp)$/,"suffix":"nakanojo.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakanoto\.ishikawa\.jp)$/,"suffix":"nakanoto.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakasatsunai\.hokkaido\.jp)$/,"suffix":"nakasatsunai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakatane\.kagoshima\.jp)$/,"suffix":"nakatane.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakatombetsu\.hokkaido\.jp)$/,"suffix":"nakatombetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakatsugawa\.gifu\.jp)$/,"suffix":"nakatsugawa.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakayama\.yamagata\.jp)$/,"suffix":"nakayama.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakijin\.okinawa\.jp)$/,"suffix":"nakijin.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(namegata\.ibaraki\.jp)$/,"suffix":"namegata.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(namegawa\.saitama\.jp)$/,"suffix":"namegawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(namerikawa\.toyama\.jp)$/,"suffix":"namerikawa.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(namie\.fukushima\.jp)$/,"suffix":"namie.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(namikata\.ehime\.jp)$/,"suffix":"namikata.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanae\.hokkaido\.jp)$/,"suffix":"nanae.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanao\.ishikawa\.jp)$/,"suffix":"nanao.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanbu\.tottori\.jp)$/,"suffix":"nanbu.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanbu\.yamanashi\.jp)$/,"suffix":"nanbu.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nango\.fukushima\.jp)$/,"suffix":"nango.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanjo\.okinawa\.jp)$/,"suffix":"nanjo.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nankoku\.kochi\.jp)$/,"suffix":"nankoku.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanmoku\.gunma\.jp)$/,"suffix":"nanmoku.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanporo\.hokkaido\.jp)$/,"suffix":"nanporo.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nantan\.kyoto\.jp)$/,"suffix":"nantan.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanto\.toyama\.jp)$/,"suffix":"nanto.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nanyo\.yamagata\.jp)$/,"suffix":"nanyo.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naoshima\.kagawa\.jp)$/,"suffix":"naoshima.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nara\.nara\.jp)$/,"suffix":"nara.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(narashino\.chiba\.jp)$/,"suffix":"narashino.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(narita\.chiba\.jp)$/,"suffix":"narita.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(narusawa\.yamanashi\.jp)$/,"suffix":"narusawa.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(naruto\.tokushima\.jp)$/,"suffix":"naruto.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nasu\.tochigi\.jp)$/,"suffix":"nasu.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nasushiobara\.tochigi\.jp)$/,"suffix":"nasushiobara.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(natori\.miyagi\.jp)$/,"suffix":"natori.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nayoro\.hokkaido\.jp)$/,"suffix":"nayoro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nemuro\.hokkaido\.jp)$/,"suffix":"nemuro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nerima\.tokyo\.jp)$/,"suffix":"nerima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(neyagawa\.osaka\.jp)$/,"suffix":"neyagawa.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nichinan\.miyazaki\.jp)$/,"suffix":"nichinan.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nichinan\.tottori\.jp)$/,"suffix":"nichinan.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niigata\.niigata\.jp)$/,"suffix":"niigata.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niihama\.ehime\.jp)$/,"suffix":"niihama.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niikappu\.hokkaido\.jp)$/,"suffix":"niikappu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niimi\.okayama\.jp)$/,"suffix":"niimi.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niiza\.saitama\.jp)$/,"suffix":"niiza.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nikaho\.akita\.jp)$/,"suffix":"nikaho.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niki\.hokkaido\.jp)$/,"suffix":"niki.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nikko\.tochigi\.jp)$/,"suffix":"nikko.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ninohe\.iwate\.jp)$/,"suffix":"ninohe.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ninomiya\.kanagawa\.jp)$/,"suffix":"ninomiya.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nirasaki\.yamanashi\.jp)$/,"suffix":"nirasaki.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishi\.fukuoka\.jp)$/,"suffix":"nishi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishi\.osaka\.jp)$/,"suffix":"nishi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiaizu\.fukushima\.jp)$/,"suffix":"nishiaizu.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiarita\.saga\.jp)$/,"suffix":"nishiarita.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiawakura\.okayama\.jp)$/,"suffix":"nishiawakura.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiazai\.shiga\.jp)$/,"suffix":"nishiazai.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishigo\.fukushima\.jp)$/,"suffix":"nishigo.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishihara\.kumamoto\.jp)$/,"suffix":"nishihara.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishihara\.okinawa\.jp)$/,"suffix":"nishihara.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiizu\.shizuoka\.jp)$/,"suffix":"nishiizu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishikata\.tochigi\.jp)$/,"suffix":"nishikata.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishikatsura\.yamanashi\.jp)$/,"suffix":"nishikatsura.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishikawa\.yamagata\.jp)$/,"suffix":"nishikawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishimera\.miyazaki\.jp)$/,"suffix":"nishimera.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishinomiya\.hyogo\.jp)$/,"suffix":"nishinomiya.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishinoomote\.kagoshima\.jp)$/,"suffix":"nishinoomote.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishinoshima\.shimane\.jp)$/,"suffix":"nishinoshima.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishio\.aichi\.jp)$/,"suffix":"nishio.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiokoppe\.hokkaido\.jp)$/,"suffix":"nishiokoppe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishitosa\.kochi\.jp)$/,"suffix":"nishitosa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nishiwaki\.hyogo\.jp)$/,"suffix":"nishiwaki.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nisshin\.aichi\.jp)$/,"suffix":"nisshin.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(niyodogawa\.kochi\.jp)$/,"suffix":"niyodogawa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nobeoka\.miyazaki\.jp)$/,"suffix":"nobeoka.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noboribetsu\.hokkaido\.jp)$/,"suffix":"noboribetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noda\.chiba\.jp)$/,"suffix":"noda.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noda\.iwate\.jp)$/,"suffix":"noda.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nogata\.fukuoka\.jp)$/,"suffix":"nogata.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nogi\.tochigi\.jp)$/,"suffix":"nogi.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noheji\.aomori\.jp)$/,"suffix":"noheji.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nomi\.ishikawa\.jp)$/,"suffix":"nomi.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nonoichi\.ishikawa\.jp)$/,"suffix":"nonoichi.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nose\.osaka\.jp)$/,"suffix":"nose.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nosegawa\.nara\.jp)$/,"suffix":"nosegawa.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noshiro\.akita\.jp)$/,"suffix":"noshiro.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(noto\.ishikawa\.jp)$/,"suffix":"noto.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(notogawa\.shiga\.jp)$/,"suffix":"notogawa.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nozawaonsen\.nagano\.jp)$/,"suffix":"nozawaonsen.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(numata\.gunma\.jp)$/,"suffix":"numata.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(numata\.hokkaido\.jp)$/,"suffix":"numata.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(numazu\.shizuoka\.jp)$/,"suffix":"numazu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nyuzen\.toyama\.jp)$/,"suffix":"nyuzen.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oamishirasato\.chiba\.jp)$/,"suffix":"oamishirasato.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oarai\.ibaraki\.jp)$/,"suffix":"oarai.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obama\.fukui\.jp)$/,"suffix":"obama.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obama\.nagasaki\.jp)$/,"suffix":"obama.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obanazawa\.yamagata\.jp)$/,"suffix":"obanazawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obihiro\.hokkaido\.jp)$/,"suffix":"obihiro.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obira\.hokkaido\.jp)$/,"suffix":"obira.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obu\.aichi\.jp)$/,"suffix":"obu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(obuse\.nagano\.jp)$/,"suffix":"obuse.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ochi\.kochi\.jp)$/,"suffix":"ochi.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(odate\.akita\.jp)$/,"suffix":"odate.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(odawara\.kanagawa\.jp)$/,"suffix":"odawara.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oe\.yamagata\.jp)$/,"suffix":"oe.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ofunato\.iwate\.jp)$/,"suffix":"ofunato.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oga\.akita\.jp)$/,"suffix":"oga.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogaki\.gifu\.jp)$/,"suffix":"ogaki.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogano\.saitama\.jp)$/,"suffix":"ogano.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogasawara\.tokyo\.jp)$/,"suffix":"ogasawara.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogata\.akita\.jp)$/,"suffix":"ogata.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogawa\.ibaraki\.jp)$/,"suffix":"ogawa.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogawa\.nagano\.jp)$/,"suffix":"ogawa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogawa\.saitama\.jp)$/,"suffix":"ogawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogawara\.miyagi\.jp)$/,"suffix":"ogawara.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogi\.saga\.jp)$/,"suffix":"ogi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogimi\.okinawa\.jp)$/,"suffix":"ogimi.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogori\.fukuoka\.jp)$/,"suffix":"ogori.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ogose\.saitama\.jp)$/,"suffix":"ogose.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oguchi\.aichi\.jp)$/,"suffix":"oguchi.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oguni\.kumamoto\.jp)$/,"suffix":"oguni.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oguni\.yamagata\.jp)$/,"suffix":"oguni.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oharu\.aichi\.jp)$/,"suffix":"oharu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohda\.shimane\.jp)$/,"suffix":"ohda.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohi\.fukui\.jp)$/,"suffix":"ohi.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohira\.miyagi\.jp)$/,"suffix":"ohira.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohira\.tochigi\.jp)$/,"suffix":"ohira.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohkura\.yamagata\.jp)$/,"suffix":"ohkura.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ohtawara\.tochigi\.jp)$/,"suffix":"ohtawara.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oi\.kanagawa\.jp)$/,"suffix":"oi.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oirase\.aomori\.jp)$/,"suffix":"oirase.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oishida\.yamagata\.jp)$/,"suffix":"oishida.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oiso\.kanagawa\.jp)$/,"suffix":"oiso.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oita\.oita\.jp)$/,"suffix":"oita.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oizumi\.gunma\.jp)$/,"suffix":"oizumi.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oji\.nara\.jp)$/,"suffix":"oji.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ojiya\.niigata\.jp)$/,"suffix":"ojiya.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okagaki\.fukuoka\.jp)$/,"suffix":"okagaki.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okawa\.fukuoka\.jp)$/,"suffix":"okawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okawa\.kochi\.jp)$/,"suffix":"okawa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okaya\.nagano\.jp)$/,"suffix":"okaya.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okayama\.okayama\.jp)$/,"suffix":"okayama.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okazaki\.aichi\.jp)$/,"suffix":"okazaki.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okegawa\.saitama\.jp)$/,"suffix":"okegawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oketo\.hokkaido\.jp)$/,"suffix":"oketo.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oki\.fukuoka\.jp)$/,"suffix":"oki.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okinawa\.okinawa\.jp)$/,"suffix":"okinawa.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okinoshima\.shimane\.jp)$/,"suffix":"okinoshima.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okoppe\.hokkaido\.jp)$/,"suffix":"okoppe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okuizumo\.shimane\.jp)$/,"suffix":"okuizumo.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okuma\.fukushima\.jp)$/,"suffix":"okuma.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(okutama\.tokyo\.jp)$/,"suffix":"okutama.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omachi\.nagano\.jp)$/,"suffix":"omachi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omachi\.saga\.jp)$/,"suffix":"omachi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omaezaki\.shizuoka\.jp)$/,"suffix":"omaezaki.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ome\.tokyo\.jp)$/,"suffix":"ome.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omi\.nagano\.jp)$/,"suffix":"omi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omi\.niigata\.jp)$/,"suffix":"omi.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omigawa\.chiba\.jp)$/,"suffix":"omigawa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omihachiman\.shiga\.jp)$/,"suffix":"omihachiman.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omitama\.ibaraki\.jp)$/,"suffix":"omitama.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omiya\.saitama\.jp)$/,"suffix":"omiya.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omotego\.fukushima\.jp)$/,"suffix":"omotego.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omura\.nagasaki\.jp)$/,"suffix":"omura.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(omuta\.fukuoka\.jp)$/,"suffix":"omuta.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onagawa\.miyagi\.jp)$/,"suffix":"onagawa.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onga\.fukuoka\.jp)$/,"suffix":"onga.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onjuku\.chiba\.jp)$/,"suffix":"onjuku.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onna\.okinawa\.jp)$/,"suffix":"onna.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ono\.fukui\.jp)$/,"suffix":"ono.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ono\.fukushima\.jp)$/,"suffix":"ono.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ono\.hyogo\.jp)$/,"suffix":"ono.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onojo\.fukuoka\.jp)$/,"suffix":"onojo.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(onomichi\.hiroshima\.jp)$/,"suffix":"onomichi.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ookuwa\.nagano\.jp)$/,"suffix":"ookuwa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ooshika\.nagano\.jp)$/,"suffix":"ooshika.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ora\.gunma\.jp)$/,"suffix":"ora.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(osakasayama\.osaka\.jp)$/,"suffix":"osakasayama.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(osaki\.miyagi\.jp)$/,"suffix":"osaki.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(osakikamijima\.hiroshima\.jp)$/,"suffix":"osakikamijima.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oseto\.nagasaki\.jp)$/,"suffix":"oseto.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oshima\.tokyo\.jp)$/,"suffix":"oshima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oshima\.yamaguchi\.jp)$/,"suffix":"oshima.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oshino\.yamanashi\.jp)$/,"suffix":"oshino.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oshu\.iwate\.jp)$/,"suffix":"oshu.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ota\.gunma\.jp)$/,"suffix":"ota.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ota\.tokyo\.jp)$/,"suffix":"ota.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otake\.hiroshima\.jp)$/,"suffix":"otake.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otaki\.chiba\.jp)$/,"suffix":"otaki.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otaki\.nagano\.jp)$/,"suffix":"otaki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otaki\.saitama\.jp)$/,"suffix":"otaki.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otama\.fukushima\.jp)$/,"suffix":"otama.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otari\.nagano\.jp)$/,"suffix":"otari.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otaru\.hokkaido\.jp)$/,"suffix":"otaru.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oto\.fukuoka\.jp)$/,"suffix":"oto.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otobe\.hokkaido\.jp)$/,"suffix":"otobe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otofuke\.hokkaido\.jp)$/,"suffix":"otofuke.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otoineppu\.hokkaido\.jp)$/,"suffix":"otoineppu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otoyo\.kochi\.jp)$/,"suffix":"otoyo.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otsu\.shiga\.jp)$/,"suffix":"otsu.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otsuchi\.iwate\.jp)$/,"suffix":"otsuchi.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otsuki\.kochi\.jp)$/,"suffix":"otsuki.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(otsuki\.yamanashi\.jp)$/,"suffix":"otsuki.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ouchi\.saga\.jp)$/,"suffix":"ouchi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ouda\.nara\.jp)$/,"suffix":"ouda.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oumu\.hokkaido\.jp)$/,"suffix":"oumu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(owani\.aomori\.jp)$/,"suffix":"owani.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(owariasahi\.aichi\.jp)$/,"suffix":"owariasahi.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oyabe\.toyama\.jp)$/,"suffix":"oyabe.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oyama\.tochigi\.jp)$/,"suffix":"oyama.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oyamazaki\.kyoto\.jp)$/,"suffix":"oyamazaki.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oyodo\.nara\.jp)$/,"suffix":"oyodo.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ozora\.hokkaido\.jp)$/,"suffix":"ozora.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ozu\.ehime\.jp)$/,"suffix":"ozu.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ozu\.kumamoto\.jp)$/,"suffix":"ozu.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pippu\.hokkaido\.jp)$/,"suffix":"pippu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rankoshi\.hokkaido\.jp)$/,"suffix":"rankoshi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ranzan\.saitama\.jp)$/,"suffix":"ranzan.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rebun\.hokkaido\.jp)$/,"suffix":"rebun.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rifu\.miyagi\.jp)$/,"suffix":"rifu.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rikubetsu\.hokkaido\.jp)$/,"suffix":"rikubetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rikuzentakata\.iwate\.jp)$/,"suffix":"rikuzentakata.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rishiri\.hokkaido\.jp)$/,"suffix":"rishiri.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rishirifuji\.hokkaido\.jp)$/,"suffix":"rishirifuji.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ritto\.shiga\.jp)$/,"suffix":"ritto.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rokunohe\.aomori\.jp)$/,"suffix":"rokunohe.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ryokami\.saitama\.jp)$/,"suffix":"ryokami.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ryugasaki\.ibaraki\.jp)$/,"suffix":"ryugasaki.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ryuoh\.shiga\.jp)$/,"suffix":"ryuoh.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sabae\.fukui\.jp)$/,"suffix":"sabae.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sado\.niigata\.jp)$/,"suffix":"sado.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saga\.saga\.jp)$/,"suffix":"saga.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sagae\.yamagata\.jp)$/,"suffix":"sagae.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sagamihara\.kanagawa\.jp)$/,"suffix":"sagamihara.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saigawa\.fukuoka\.jp)$/,"suffix":"saigawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saijo\.ehime\.jp)$/,"suffix":"saijo.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saikai\.nagasaki\.jp)$/,"suffix":"saikai.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saiki\.oita\.jp)$/,"suffix":"saiki.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saitama\.saitama\.jp)$/,"suffix":"saitama.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saito\.miyazaki\.jp)$/,"suffix":"saito.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saka\.hiroshima\.jp)$/,"suffix":"saka.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakado\.saitama\.jp)$/,"suffix":"sakado.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakae\.chiba\.jp)$/,"suffix":"sakae.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakae\.nagano\.jp)$/,"suffix":"sakae.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakahogi\.gifu\.jp)$/,"suffix":"sakahogi.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakai\.fukui\.jp)$/,"suffix":"sakai.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakai\.ibaraki\.jp)$/,"suffix":"sakai.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakai\.osaka\.jp)$/,"suffix":"sakai.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakaiminato\.tottori\.jp)$/,"suffix":"sakaiminato.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakaki\.nagano\.jp)$/,"suffix":"sakaki.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakata\.yamagata\.jp)$/,"suffix":"sakata.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakawa\.kochi\.jp)$/,"suffix":"sakawa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakegawa\.yamagata\.jp)$/,"suffix":"sakegawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saku\.nagano\.jp)$/,"suffix":"saku.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakuho\.nagano\.jp)$/,"suffix":"sakuho.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakura\.chiba\.jp)$/,"suffix":"sakura.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakura\.tochigi\.jp)$/,"suffix":"sakura.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakuragawa\.ibaraki\.jp)$/,"suffix":"sakuragawa.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakurai\.nara\.jp)$/,"suffix":"sakurai.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakyo\.kyoto\.jp)$/,"suffix":"sakyo.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(samegawa\.fukushima\.jp)$/,"suffix":"samegawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(samukawa\.kanagawa\.jp)$/,"suffix":"samukawa.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanagochi\.tokushima\.jp)$/,"suffix":"sanagochi.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanda\.hyogo\.jp)$/,"suffix":"sanda.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sango\.nara\.jp)$/,"suffix":"sango.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanjo\.niigata\.jp)$/,"suffix":"sanjo.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sannan\.hyogo\.jp)$/,"suffix":"sannan.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sannohe\.aomori\.jp)$/,"suffix":"sannohe.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sano\.tochigi\.jp)$/,"suffix":"sano.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanuki\.kagawa\.jp)$/,"suffix":"sanuki.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(saroma\.hokkaido\.jp)$/,"suffix":"saroma.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sarufutsu\.hokkaido\.jp)$/,"suffix":"sarufutsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sasaguri\.fukuoka\.jp)$/,"suffix":"sasaguri.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sasayama\.hyogo\.jp)$/,"suffix":"sasayama.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sasebo\.nagasaki\.jp)$/,"suffix":"sasebo.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(satosho\.okayama\.jp)$/,"suffix":"satosho.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(satsumasendai\.kagoshima\.jp)$/,"suffix":"satsumasendai.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(satte\.saitama\.jp)$/,"suffix":"satte.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sayama\.osaka\.jp)$/,"suffix":"sayama.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sayama\.saitama\.jp)$/,"suffix":"sayama.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sayo\.hyogo\.jp)$/,"suffix":"sayo.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seihi\.nagasaki\.jp)$/,"suffix":"seihi.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seika\.kyoto\.jp)$/,"suffix":"seika.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seiro\.niigata\.jp)$/,"suffix":"seiro.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seirou\.niigata\.jp)$/,"suffix":"seirou.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seiyo\.ehime\.jp)$/,"suffix":"seiyo.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seki\.gifu\.jp)$/,"suffix":"seki.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sekigahara\.gifu\.jp)$/,"suffix":"sekigahara.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sekikawa\.niigata\.jp)$/,"suffix":"sekikawa.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(semboku\.akita\.jp)$/,"suffix":"semboku.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(semine\.miyagi\.jp)$/,"suffix":"semine.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sennan\.osaka\.jp)$/,"suffix":"sennan.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sera\.hiroshima\.jp)$/,"suffix":"sera.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seranishi\.hiroshima\.jp)$/,"suffix":"seranishi.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(setagaya\.tokyo\.jp)$/,"suffix":"setagaya.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(seto\.aichi\.jp)$/,"suffix":"seto.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(setouchi\.okayama\.jp)$/,"suffix":"setouchi.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(settsu\.osaka\.jp)$/,"suffix":"settsu.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shakotan\.hokkaido\.jp)$/,"suffix":"shakotan.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shari\.hokkaido\.jp)$/,"suffix":"shari.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibata\.miyagi\.jp)$/,"suffix":"shibata.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibata\.niigata\.jp)$/,"suffix":"shibata.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibecha\.hokkaido\.jp)$/,"suffix":"shibecha.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibetsu\.hokkaido\.jp)$/,"suffix":"shibetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibukawa\.gunma\.jp)$/,"suffix":"shibukawa.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shibuya\.tokyo\.jp)$/,"suffix":"shibuya.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shichikashuku\.miyagi\.jp)$/,"suffix":"shichikashuku.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shichinohe\.aomori\.jp)$/,"suffix":"shichinohe.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiiba\.miyazaki\.jp)$/,"suffix":"shiiba.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shijonawate\.osaka\.jp)$/,"suffix":"shijonawate.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shika\.ishikawa\.jp)$/,"suffix":"shika.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shikabe\.hokkaido\.jp)$/,"suffix":"shikabe.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shikama\.miyagi\.jp)$/,"suffix":"shikama.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shikaoi\.hokkaido\.jp)$/,"suffix":"shikaoi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shikatsu\.aichi\.jp)$/,"suffix":"shikatsu.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiki\.saitama\.jp)$/,"suffix":"shiki.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shikokuchuo\.ehime\.jp)$/,"suffix":"shikokuchuo.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shima\.mie\.jp)$/,"suffix":"shima.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimabara\.nagasaki\.jp)$/,"suffix":"shimabara.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimada\.shizuoka\.jp)$/,"suffix":"shimada.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimamaki\.hokkaido\.jp)$/,"suffix":"shimamaki.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimamoto\.osaka\.jp)$/,"suffix":"shimamoto.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimane\.shimane\.jp)$/,"suffix":"shimane.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimizu\.hokkaido\.jp)$/,"suffix":"shimizu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimizu\.shizuoka\.jp)$/,"suffix":"shimizu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimoda\.shizuoka\.jp)$/,"suffix":"shimoda.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimodate\.ibaraki\.jp)$/,"suffix":"shimodate.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimofusa\.chiba\.jp)$/,"suffix":"shimofusa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimogo\.fukushima\.jp)$/,"suffix":"shimogo.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimoichi\.nara\.jp)$/,"suffix":"shimoichi.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimoji\.okinawa\.jp)$/,"suffix":"shimoji.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimokawa\.hokkaido\.jp)$/,"suffix":"shimokawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimokitayama\.nara\.jp)$/,"suffix":"shimokitayama.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimonita\.gunma\.jp)$/,"suffix":"shimonita.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimonoseki\.yamaguchi\.jp)$/,"suffix":"shimonoseki.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimosuwa\.nagano\.jp)$/,"suffix":"shimosuwa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimotsuke\.tochigi\.jp)$/,"suffix":"shimotsuke.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimotsuma\.ibaraki\.jp)$/,"suffix":"shimotsuma.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinagawa\.tokyo\.jp)$/,"suffix":"shinagawa.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinanomachi\.nagano\.jp)$/,"suffix":"shinanomachi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shingo\.aomori\.jp)$/,"suffix":"shingo.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shingu\.fukuoka\.jp)$/,"suffix":"shingu.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shingu\.hyogo\.jp)$/,"suffix":"shingu.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shingu\.wakayama\.jp)$/,"suffix":"shingu.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinichi\.hiroshima\.jp)$/,"suffix":"shinichi.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinjo\.nara\.jp)$/,"suffix":"shinjo.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinjo\.okayama\.jp)$/,"suffix":"shinjo.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinjo\.yamagata\.jp)$/,"suffix":"shinjo.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinjuku\.tokyo\.jp)$/,"suffix":"shinjuku.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinkamigoto\.nagasaki\.jp)$/,"suffix":"shinkamigoto.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinonsen\.hyogo\.jp)$/,"suffix":"shinonsen.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinshinotsu\.hokkaido\.jp)$/,"suffix":"shinshinotsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinshiro\.aichi\.jp)$/,"suffix":"shinshiro.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinto\.gunma\.jp)$/,"suffix":"shinto.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shintoku\.hokkaido\.jp)$/,"suffix":"shintoku.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shintomi\.miyazaki\.jp)$/,"suffix":"shintomi.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shinyoshitomi\.fukuoka\.jp)$/,"suffix":"shinyoshitomi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiogama\.miyagi\.jp)$/,"suffix":"shiogama.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiojiri\.nagano\.jp)$/,"suffix":"shiojiri.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shioya\.tochigi\.jp)$/,"suffix":"shioya.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirahama\.wakayama\.jp)$/,"suffix":"shirahama.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirakawa\.fukushima\.jp)$/,"suffix":"shirakawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirakawa\.gifu\.jp)$/,"suffix":"shirakawa.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirako\.chiba\.jp)$/,"suffix":"shirako.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiranuka\.hokkaido\.jp)$/,"suffix":"shiranuka.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiraoi\.hokkaido\.jp)$/,"suffix":"shiraoi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiraoka\.saitama\.jp)$/,"suffix":"shiraoka.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirataka\.yamagata\.jp)$/,"suffix":"shirataka.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiriuchi\.hokkaido\.jp)$/,"suffix":"shiriuchi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiroi\.chiba\.jp)$/,"suffix":"shiroi.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiroishi\.miyagi\.jp)$/,"suffix":"shiroishi.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiroishi\.saga\.jp)$/,"suffix":"shiroishi.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shirosato\.ibaraki\.jp)$/,"suffix":"shirosato.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shishikui\.tokushima\.jp)$/,"suffix":"shishikui.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiso\.hyogo\.jp)$/,"suffix":"shiso.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shisui\.chiba\.jp)$/,"suffix":"shisui.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shitara\.aichi\.jp)$/,"suffix":"shitara.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiwa\.iwate\.jp)$/,"suffix":"shiwa.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shizukuishi\.iwate\.jp)$/,"suffix":"shizukuishi.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shizuoka\.shizuoka\.jp)$/,"suffix":"shizuoka.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shobara\.hiroshima\.jp)$/,"suffix":"shobara.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shonai\.fukuoka\.jp)$/,"suffix":"shonai.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shonai\.yamagata\.jp)$/,"suffix":"shonai.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shoo\.okayama\.jp)$/,"suffix":"shoo.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(showa\.fukushima\.jp)$/,"suffix":"showa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(showa\.gunma\.jp)$/,"suffix":"showa.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(showa\.yamanashi\.jp)$/,"suffix":"showa.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(shunan\.yamaguchi\.jp)$/,"suffix":"shunan.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sobetsu\.hokkaido\.jp)$/,"suffix":"sobetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sodegaura\.chiba\.jp)$/,"suffix":"sodegaura.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soeda\.fukuoka\.jp)$/,"suffix":"soeda.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soja\.okayama\.jp)$/,"suffix":"soja.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soka\.saitama\.jp)$/,"suffix":"soka.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soma\.fukushima\.jp)$/,"suffix":"soma.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soni\.nara\.jp)$/,"suffix":"soni.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(soo\.kagoshima\.jp)$/,"suffix":"soo.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sosa\.chiba\.jp)$/,"suffix":"sosa.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sowa\.ibaraki\.jp)$/,"suffix":"sowa.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sue\.fukuoka\.jp)$/,"suffix":"sue.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suginami\.tokyo\.jp)$/,"suffix":"suginami.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sugito\.saitama\.jp)$/,"suffix":"sugito.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suifu\.ibaraki\.jp)$/,"suffix":"suifu.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suita\.osaka\.jp)$/,"suffix":"suita.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sukagawa\.fukushima\.jp)$/,"suffix":"sukagawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sukumo\.kochi\.jp)$/,"suffix":"sukumo.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sumida\.tokyo\.jp)$/,"suffix":"sumida.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sumita\.iwate\.jp)$/,"suffix":"sumita.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sumoto\.hyogo\.jp)$/,"suffix":"sumoto.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sumoto\.kumamoto\.jp)$/,"suffix":"sumoto.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sunagawa\.hokkaido\.jp)$/,"suffix":"sunagawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(susaki\.kochi\.jp)$/,"suffix":"susaki.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(susono\.shizuoka\.jp)$/,"suffix":"susono.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suwa\.nagano\.jp)$/,"suffix":"suwa.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suzaka\.nagano\.jp)$/,"suffix":"suzaka.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suzu\.ishikawa\.jp)$/,"suffix":"suzu.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(suzuka\.mie\.jp)$/,"suffix":"suzuka.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tabayama\.yamanashi\.jp)$/,"suffix":"tabayama.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tabuse\.yamaguchi\.jp)$/,"suffix":"tabuse.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tachiarai\.fukuoka\.jp)$/,"suffix":"tachiarai.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tachikawa\.tokyo\.jp)$/,"suffix":"tachikawa.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tadaoka\.osaka\.jp)$/,"suffix":"tadaoka.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tado\.mie\.jp)$/,"suffix":"tado.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tadotsu\.kagawa\.jp)$/,"suffix":"tadotsu.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tagajo\.miyagi\.jp)$/,"suffix":"tagajo.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tagami\.niigata\.jp)$/,"suffix":"tagami.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tagawa\.fukuoka\.jp)$/,"suffix":"tagawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tahara\.aichi\.jp)$/,"suffix":"tahara.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taiji\.wakayama\.jp)$/,"suffix":"taiji.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taiki\.hokkaido\.jp)$/,"suffix":"taiki.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taiki\.mie\.jp)$/,"suffix":"taiki.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tainai\.niigata\.jp)$/,"suffix":"tainai.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taira\.toyama\.jp)$/,"suffix":"taira.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taishi\.hyogo\.jp)$/,"suffix":"taishi.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taishi\.osaka\.jp)$/,"suffix":"taishi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taishin\.fukushima\.jp)$/,"suffix":"taishin.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taito\.tokyo\.jp)$/,"suffix":"taito.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taiwa\.miyagi\.jp)$/,"suffix":"taiwa.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tajimi\.gifu\.jp)$/,"suffix":"tajimi.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tajiri\.osaka\.jp)$/,"suffix":"tajiri.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taka\.hyogo\.jp)$/,"suffix":"taka.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takagi\.nagano\.jp)$/,"suffix":"takagi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takahagi\.ibaraki\.jp)$/,"suffix":"takahagi.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takahama\.aichi\.jp)$/,"suffix":"takahama.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takahama\.fukui\.jp)$/,"suffix":"takahama.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takaharu\.miyazaki\.jp)$/,"suffix":"takaharu.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takahashi\.okayama\.jp)$/,"suffix":"takahashi.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takahata\.yamagata\.jp)$/,"suffix":"takahata.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takaishi\.osaka\.jp)$/,"suffix":"takaishi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takamatsu\.kagawa\.jp)$/,"suffix":"takamatsu.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takamori\.kumamoto\.jp)$/,"suffix":"takamori.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takamori\.nagano\.jp)$/,"suffix":"takamori.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takanabe\.miyazaki\.jp)$/,"suffix":"takanabe.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takanezawa\.tochigi\.jp)$/,"suffix":"takanezawa.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takaoka\.toyama\.jp)$/,"suffix":"takaoka.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takarazuka\.hyogo\.jp)$/,"suffix":"takarazuka.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takasago\.hyogo\.jp)$/,"suffix":"takasago.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takasaki\.gunma\.jp)$/,"suffix":"takasaki.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takashima\.shiga\.jp)$/,"suffix":"takashima.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takasu\.hokkaido\.jp)$/,"suffix":"takasu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takata\.fukuoka\.jp)$/,"suffix":"takata.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takatori\.nara\.jp)$/,"suffix":"takatori.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takatsuki\.osaka\.jp)$/,"suffix":"takatsuki.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takatsuki\.shiga\.jp)$/,"suffix":"takatsuki.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takayama\.gifu\.jp)$/,"suffix":"takayama.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takayama\.gunma\.jp)$/,"suffix":"takayama.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takayama\.nagano\.jp)$/,"suffix":"takayama.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takazaki\.miyazaki\.jp)$/,"suffix":"takazaki.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takehara\.hiroshima\.jp)$/,"suffix":"takehara.hiroshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taketa\.oita\.jp)$/,"suffix":"taketa.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taketomi\.okinawa\.jp)$/,"suffix":"taketomi.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taki\.mie\.jp)$/,"suffix":"taki.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takikawa\.hokkaido\.jp)$/,"suffix":"takikawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takino\.hyogo\.jp)$/,"suffix":"takino.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takinoue\.hokkaido\.jp)$/,"suffix":"takinoue.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(takko\.aomori\.jp)$/,"suffix":"takko.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tako\.chiba\.jp)$/,"suffix":"tako.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(taku\.saga\.jp)$/,"suffix":"taku.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tama\.tokyo\.jp)$/,"suffix":"tama.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamakawa\.fukushima\.jp)$/,"suffix":"tamakawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamaki\.mie\.jp)$/,"suffix":"tamaki.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamamura\.gunma\.jp)$/,"suffix":"tamamura.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamano\.okayama\.jp)$/,"suffix":"tamano.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamatsukuri\.ibaraki\.jp)$/,"suffix":"tamatsukuri.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamayu\.shimane\.jp)$/,"suffix":"tamayu.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tamba\.hyogo\.jp)$/,"suffix":"tamba.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tanabe\.kyoto\.jp)$/,"suffix":"tanabe.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tanabe\.wakayama\.jp)$/,"suffix":"tanabe.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tanagura\.fukushima\.jp)$/,"suffix":"tanagura.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tanohata\.iwate\.jp)$/,"suffix":"tanohata.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tara\.saga\.jp)$/,"suffix":"tara.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tarama\.okinawa\.jp)$/,"suffix":"tarama.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tarui\.gifu\.jp)$/,"suffix":"tarui.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tarumizu\.kagoshima\.jp)$/,"suffix":"tarumizu.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatebayashi\.gunma\.jp)$/,"suffix":"tatebayashi.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tateshina\.nagano\.jp)$/,"suffix":"tateshina.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tateyama\.chiba\.jp)$/,"suffix":"tateyama.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tateyama\.toyama\.jp)$/,"suffix":"tateyama.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatsuno\.hyogo\.jp)$/,"suffix":"tatsuno.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatsuno\.nagano\.jp)$/,"suffix":"tatsuno.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tawaramoto\.nara\.jp)$/,"suffix":"tawaramoto.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tendo\.yamagata\.jp)$/,"suffix":"tendo.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tenei\.fukushima\.jp)$/,"suffix":"tenei.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tenkawa\.nara\.jp)$/,"suffix":"tenkawa.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tenri\.nara\.jp)$/,"suffix":"tenri.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(teshikaga\.hokkaido\.jp)$/,"suffix":"teshikaga.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toba\.mie\.jp)$/,"suffix":"toba.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tobe\.ehime\.jp)$/,"suffix":"tobe.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tobetsu\.hokkaido\.jp)$/,"suffix":"tobetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tobishima\.aichi\.jp)$/,"suffix":"tobishima.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tochigi\.tochigi\.jp)$/,"suffix":"tochigi.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tochio\.niigata\.jp)$/,"suffix":"tochio.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toda\.saitama\.jp)$/,"suffix":"toda.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toei\.aichi\.jp)$/,"suffix":"toei.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toga\.toyama\.jp)$/,"suffix":"toga.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(togakushi\.nagano\.jp)$/,"suffix":"togakushi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(togane\.chiba\.jp)$/,"suffix":"togane.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(togitsu\.nagasaki\.jp)$/,"suffix":"togitsu.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(togo\.aichi\.jp)$/,"suffix":"togo.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(togura\.nagano\.jp)$/,"suffix":"togura.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tohma\.hokkaido\.jp)$/,"suffix":"tohma.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tohnosho\.chiba\.jp)$/,"suffix":"tohnosho.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toho\.fukuoka\.jp)$/,"suffix":"toho.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokai\.aichi\.jp)$/,"suffix":"tokai.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokai\.ibaraki\.jp)$/,"suffix":"tokai.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokamachi\.niigata\.jp)$/,"suffix":"tokamachi.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokashiki\.okinawa\.jp)$/,"suffix":"tokashiki.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toki\.gifu\.jp)$/,"suffix":"toki.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokigawa\.saitama\.jp)$/,"suffix":"tokigawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokoname\.aichi\.jp)$/,"suffix":"tokoname.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokorozawa\.saitama\.jp)$/,"suffix":"tokorozawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokushima\.tokushima\.jp)$/,"suffix":"tokushima.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokuyama\.yamaguchi\.jp)$/,"suffix":"tokuyama.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomakomai\.hokkaido\.jp)$/,"suffix":"tomakomai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomari\.hokkaido\.jp)$/,"suffix":"tomari.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tome\.miyagi\.jp)$/,"suffix":"tome.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomi\.nagano\.jp)$/,"suffix":"tomi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomigusuku\.okinawa\.jp)$/,"suffix":"tomigusuku.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomika\.gifu\.jp)$/,"suffix":"tomika.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomioka\.gunma\.jp)$/,"suffix":"tomioka.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomisato\.chiba\.jp)$/,"suffix":"tomisato.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomiya\.miyagi\.jp)$/,"suffix":"tomiya.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomobe\.ibaraki\.jp)$/,"suffix":"tomobe.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tonaki\.okinawa\.jp)$/,"suffix":"tonaki.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tonami\.toyama\.jp)$/,"suffix":"tonami.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tondabayashi\.osaka\.jp)$/,"suffix":"tondabayashi.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tone\.ibaraki\.jp)$/,"suffix":"tone.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tono\.iwate\.jp)$/,"suffix":"tono.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tonosho\.kagawa\.jp)$/,"suffix":"tonosho.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toon\.ehime\.jp)$/,"suffix":"toon.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(torahime\.shiga\.jp)$/,"suffix":"torahime.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toride\.ibaraki\.jp)$/,"suffix":"toride.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tosa\.kochi\.jp)$/,"suffix":"tosa.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tosashimizu\.kochi\.jp)$/,"suffix":"tosashimizu.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toshima\.tokyo\.jp)$/,"suffix":"toshima.tokyo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tosu\.saga\.jp)$/,"suffix":"tosu.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tottori\.tottori\.jp)$/,"suffix":"tottori.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(towada\.aomori\.jp)$/,"suffix":"towada.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toya\.hokkaido\.jp)$/,"suffix":"toya.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyako\.hokkaido\.jp)$/,"suffix":"toyako.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyama\.toyama\.jp)$/,"suffix":"toyama.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyo\.kochi\.jp)$/,"suffix":"toyo.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyoake\.aichi\.jp)$/,"suffix":"toyoake.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyohashi\.aichi\.jp)$/,"suffix":"toyohashi.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyokawa\.aichi\.jp)$/,"suffix":"toyokawa.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyonaka\.osaka\.jp)$/,"suffix":"toyonaka.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyone\.aichi\.jp)$/,"suffix":"toyone.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyono\.osaka\.jp)$/,"suffix":"toyono.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyooka\.hyogo\.jp)$/,"suffix":"toyooka.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyosato\.shiga\.jp)$/,"suffix":"toyosato.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyota\.aichi\.jp)$/,"suffix":"toyota.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyota\.yamaguchi\.jp)$/,"suffix":"toyota.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyotomi\.hokkaido\.jp)$/,"suffix":"toyotomi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyotsu\.fukuoka\.jp)$/,"suffix":"toyotsu.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyoura\.hokkaido\.jp)$/,"suffix":"toyoura.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tozawa\.yamagata\.jp)$/,"suffix":"tozawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsu\.mie\.jp)$/,"suffix":"tsu.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsubame\.niigata\.jp)$/,"suffix":"tsubame.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsubata\.ishikawa\.jp)$/,"suffix":"tsubata.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsubetsu\.hokkaido\.jp)$/,"suffix":"tsubetsu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuchiura\.ibaraki\.jp)$/,"suffix":"tsuchiura.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuga\.tochigi\.jp)$/,"suffix":"tsuga.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsugaru\.aomori\.jp)$/,"suffix":"tsugaru.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuiki\.fukuoka\.jp)$/,"suffix":"tsuiki.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsukigata\.hokkaido\.jp)$/,"suffix":"tsukigata.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsukiyono\.gunma\.jp)$/,"suffix":"tsukiyono.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsukuba\.ibaraki\.jp)$/,"suffix":"tsukuba.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsukui\.kanagawa\.jp)$/,"suffix":"tsukui.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsukumi\.oita\.jp)$/,"suffix":"tsukumi.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsumagoi\.gunma\.jp)$/,"suffix":"tsumagoi.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsunan\.niigata\.jp)$/,"suffix":"tsunan.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuno\.kochi\.jp)$/,"suffix":"tsuno.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuno\.miyazaki\.jp)$/,"suffix":"tsuno.miyazaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuru\.yamanashi\.jp)$/,"suffix":"tsuru.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuruga\.fukui\.jp)$/,"suffix":"tsuruga.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsurugashima\.saitama\.jp)$/,"suffix":"tsurugashima.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsurugi\.ishikawa\.jp)$/,"suffix":"tsurugi.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuruoka\.yamagata\.jp)$/,"suffix":"tsuruoka.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuruta\.aomori\.jp)$/,"suffix":"tsuruta.aomori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsushima\.aichi\.jp)$/,"suffix":"tsushima.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsushima\.nagasaki\.jp)$/,"suffix":"tsushima.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuwano\.shimane\.jp)$/,"suffix":"tsuwano.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsuyama\.okayama\.jp)$/,"suffix":"tsuyama.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ube\.yamaguchi\.jp)$/,"suffix":"ube.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uchihara\.ibaraki\.jp)$/,"suffix":"uchihara.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uchiko\.ehime\.jp)$/,"suffix":"uchiko.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uchinada\.ishikawa\.jp)$/,"suffix":"uchinada.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uchinomi\.kagawa\.jp)$/,"suffix":"uchinomi.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uda\.nara\.jp)$/,"suffix":"uda.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(udono\.mie\.jp)$/,"suffix":"udono.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ueda\.nagano\.jp)$/,"suffix":"ueda.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ueno\.gunma\.jp)$/,"suffix":"ueno.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uenohara\.yamanashi\.jp)$/,"suffix":"uenohara.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uji\.kyoto\.jp)$/,"suffix":"uji.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ujiie\.tochigi\.jp)$/,"suffix":"ujiie.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ujitawara\.kyoto\.jp)$/,"suffix":"ujitawara.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uki\.kumamoto\.jp)$/,"suffix":"uki.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ukiha\.fukuoka\.jp)$/,"suffix":"ukiha.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(umaji\.kochi\.jp)$/,"suffix":"umaji.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(umi\.fukuoka\.jp)$/,"suffix":"umi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(unazuki\.toyama\.jp)$/,"suffix":"unazuki.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(unnan\.shimane\.jp)$/,"suffix":"unnan.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(unzen\.nagasaki\.jp)$/,"suffix":"unzen.nagasaki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uonuma\.niigata\.jp)$/,"suffix":"uonuma.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uozu\.toyama\.jp)$/,"suffix":"uozu.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(urakawa\.hokkaido\.jp)$/,"suffix":"urakawa.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(urasoe\.okinawa\.jp)$/,"suffix":"urasoe.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(urausu\.hokkaido\.jp)$/,"suffix":"urausu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(urawa\.saitama\.jp)$/,"suffix":"urawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(urayasu\.chiba\.jp)$/,"suffix":"urayasu.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ureshino\.mie\.jp)$/,"suffix":"ureshino.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uruma\.okinawa\.jp)$/,"suffix":"uruma.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uryu\.hokkaido\.jp)$/,"suffix":"uryu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(usa\.oita\.jp)$/,"suffix":"usa.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ushiku\.ibaraki\.jp)$/,"suffix":"ushiku.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(usui\.fukuoka\.jp)$/,"suffix":"usui.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(usuki\.oita\.jp)$/,"suffix":"usuki.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(utashinai\.hokkaido\.jp)$/,"suffix":"utashinai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(utazu\.kagawa\.jp)$/,"suffix":"utazu.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uto\.kumamoto\.jp)$/,"suffix":"uto.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(utsunomiya\.tochigi\.jp)$/,"suffix":"utsunomiya.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uwajima\.ehime\.jp)$/,"suffix":"uwajima.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wada\.nagano\.jp)$/,"suffix":"wada.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wajiki\.tokushima\.jp)$/,"suffix":"wajiki.tokushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wajima\.ishikawa\.jp)$/,"suffix":"wajima.ishikawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakasa\.fukui\.jp)$/,"suffix":"wakasa.fukui.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakasa\.tottori\.jp)$/,"suffix":"wakasa.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakayama\.wakayama\.jp)$/,"suffix":"wakayama.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wake\.okayama\.jp)$/,"suffix":"wake.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakkanai\.hokkaido\.jp)$/,"suffix":"wakkanai.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakuya\.miyagi\.jp)$/,"suffix":"wakuya.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wanouchi\.gifu\.jp)$/,"suffix":"wanouchi.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(warabi\.saitama\.jp)$/,"suffix":"warabi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wassamu\.hokkaido\.jp)$/,"suffix":"wassamu.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(watarai\.mie\.jp)$/,"suffix":"watarai.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(watari\.miyagi\.jp)$/,"suffix":"watari.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wazuka\.kyoto\.jp)$/,"suffix":"wazuka.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yabu\.hyogo\.jp)$/,"suffix":"yabu.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yabuki\.fukushima\.jp)$/,"suffix":"yabuki.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yachimata\.chiba\.jp)$/,"suffix":"yachimata.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yachiyo\.chiba\.jp)$/,"suffix":"yachiyo.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yachiyo\.ibaraki\.jp)$/,"suffix":"yachiyo.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yaese\.okinawa\.jp)$/,"suffix":"yaese.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yahaba\.iwate\.jp)$/,"suffix":"yahaba.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yahiko\.niigata\.jp)$/,"suffix":"yahiko.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yaita\.tochigi\.jp)$/,"suffix":"yaita.tochigi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yaizu\.shizuoka\.jp)$/,"suffix":"yaizu.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yakage\.okayama\.jp)$/,"suffix":"yakage.okayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yakumo\.hokkaido\.jp)$/,"suffix":"yakumo.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yakumo\.shimane\.jp)$/,"suffix":"yakumo.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamada\.fukuoka\.jp)$/,"suffix":"yamada.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamada\.iwate\.jp)$/,"suffix":"yamada.iwate.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamada\.toyama\.jp)$/,"suffix":"yamada.toyama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamaga\.kumamoto\.jp)$/,"suffix":"yamaga.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamagata\.gifu\.jp)$/,"suffix":"yamagata.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamagata\.ibaraki\.jp)$/,"suffix":"yamagata.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamagata\.nagano\.jp)$/,"suffix":"yamagata.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamagata\.yamagata\.jp)$/,"suffix":"yamagata.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamakita\.kanagawa\.jp)$/,"suffix":"yamakita.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamamoto\.miyagi\.jp)$/,"suffix":"yamamoto.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamanakako\.yamanashi\.jp)$/,"suffix":"yamanakako.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamanashi\.yamanashi\.jp)$/,"suffix":"yamanashi.yamanashi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamanobe\.yamagata\.jp)$/,"suffix":"yamanobe.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamanouchi\.nagano\.jp)$/,"suffix":"yamanouchi.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamashina\.kyoto\.jp)$/,"suffix":"yamashina.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamato\.fukushima\.jp)$/,"suffix":"yamato.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamato\.kanagawa\.jp)$/,"suffix":"yamato.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamato\.kumamoto\.jp)$/,"suffix":"yamato.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamatokoriyama\.nara\.jp)$/,"suffix":"yamatokoriyama.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamatotakada\.nara\.jp)$/,"suffix":"yamatotakada.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamatsuri\.fukushima\.jp)$/,"suffix":"yamatsuri.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamazoe\.nara\.jp)$/,"suffix":"yamazoe.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yame\.fukuoka\.jp)$/,"suffix":"yame.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yanagawa\.fukuoka\.jp)$/,"suffix":"yanagawa.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yanaizu\.fukushima\.jp)$/,"suffix":"yanaizu.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yao\.osaka\.jp)$/,"suffix":"yao.osaka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yaotsu\.gifu\.jp)$/,"suffix":"yaotsu.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yasaka\.nagano\.jp)$/,"suffix":"yasaka.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yashio\.saitama\.jp)$/,"suffix":"yashio.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yashiro\.hyogo\.jp)$/,"suffix":"yashiro.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yasu\.shiga\.jp)$/,"suffix":"yasu.shiga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yasuda\.kochi\.jp)$/,"suffix":"yasuda.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yasugi\.shimane\.jp)$/,"suffix":"yasugi.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yasuoka\.nagano\.jp)$/,"suffix":"yasuoka.nagano.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yatomi\.aichi\.jp)$/,"suffix":"yatomi.aichi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yatsuka\.shimane\.jp)$/,"suffix":"yatsuka.shimane.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yatsushiro\.kumamoto\.jp)$/,"suffix":"yatsushiro.kumamoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yawara\.ibaraki\.jp)$/,"suffix":"yawara.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yawata\.kyoto\.jp)$/,"suffix":"yawata.kyoto.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yawatahama\.ehime\.jp)$/,"suffix":"yawatahama.ehime.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yazu\.tottori\.jp)$/,"suffix":"yazu.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoichi\.hokkaido\.jp)$/,"suffix":"yoichi.hokkaido.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoita\.niigata\.jp)$/,"suffix":"yoita.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoka\.hyogo\.jp)$/,"suffix":"yoka.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokaichiba\.chiba\.jp)$/,"suffix":"yokaichiba.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokawa\.hyogo\.jp)$/,"suffix":"yokawa.hyogo.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokkaichi\.mie\.jp)$/,"suffix":"yokkaichi.mie.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokoshibahikari\.chiba\.jp)$/,"suffix":"yokoshibahikari.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokosuka\.kanagawa\.jp)$/,"suffix":"yokosuka.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokote\.akita\.jp)$/,"suffix":"yokote.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokoze\.saitama\.jp)$/,"suffix":"yokoze.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yomitan\.okinawa\.jp)$/,"suffix":"yomitan.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yonabaru\.okinawa\.jp)$/,"suffix":"yonabaru.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yonago\.tottori\.jp)$/,"suffix":"yonago.tottori.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yonaguni\.okinawa\.jp)$/,"suffix":"yonaguni.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yonezawa\.yamagata\.jp)$/,"suffix":"yonezawa.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yono\.saitama\.jp)$/,"suffix":"yono.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yorii\.saitama\.jp)$/,"suffix":"yorii.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoro\.gifu\.jp)$/,"suffix":"yoro.gifu.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshida\.saitama\.jp)$/,"suffix":"yoshida.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshida\.shizuoka\.jp)$/,"suffix":"yoshida.shizuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshikawa\.saitama\.jp)$/,"suffix":"yoshikawa.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshimi\.saitama\.jp)$/,"suffix":"yoshimi.saitama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshino\.nara\.jp)$/,"suffix":"yoshino.nara.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshinogari\.saga\.jp)$/,"suffix":"yoshinogari.saga.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoshioka\.gunma\.jp)$/,"suffix":"yoshioka.gunma.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yotsukaido\.chiba\.jp)$/,"suffix":"yotsukaido.chiba.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuasa\.wakayama\.jp)$/,"suffix":"yuasa.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yufu\.oita\.jp)$/,"suffix":"yufu.oita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yugawa\.fukushima\.jp)$/,"suffix":"yugawa.fukushima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yugawara\.kanagawa\.jp)$/,"suffix":"yugawara.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuki\.ibaraki\.jp)$/,"suffix":"yuki.ibaraki.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yukuhashi\.fukuoka\.jp)$/,"suffix":"yukuhashi.fukuoka.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yura\.wakayama\.jp)$/,"suffix":"yura.wakayama.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yurihonjo\.akita\.jp)$/,"suffix":"yurihonjo.akita.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yusuhara\.kochi\.jp)$/,"suffix":"yusuhara.kochi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yusui\.kagoshima\.jp)$/,"suffix":"yusui.kagoshima.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuu\.yamaguchi\.jp)$/,"suffix":"yuu.yamaguchi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuza\.yamagata\.jp)$/,"suffix":"yuza.yamagata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuzawa\.niigata\.jp)$/,"suffix":"yuzawa.niigata.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zama\.kanagawa\.jp)$/,"suffix":"zama.kanagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zamami\.okinawa\.jp)$/,"suffix":"zamami.okinawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zao\.miyagi\.jp)$/,"suffix":"zao.miyagi.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zentsuji\.kagawa\.jp)$/,"suffix":"zentsuji.kagawa.jp"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zushi\.kanagawa\.jp)$/,"suffix":"zushi.kanagawa.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.jp)$/,"suffix":"ac.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ad\.jp)$/,"suffix":"ad.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aichi\.jp)$/,"suffix":"aichi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(akita\.jp)$/,"suffix":"akita.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aomori\.jp)$/,"suffix":"aomori.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.jp)$/,"suffix":"blogspot.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chiba\.jp)$/,"suffix":"chiba.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.jp)$/,"suffix":"co.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ed\.jp)$/,"suffix":"ed.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ehime\.jp)$/,"suffix":"ehime.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukui\.jp)$/,"suffix":"fukui.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukuoka\.jp)$/,"suffix":"fukuoka.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fukushima\.jp)$/,"suffix":"fukushima.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gifu\.jp)$/,"suffix":"gifu.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.jp)$/,"suffix":"go.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gr\.jp)$/,"suffix":"gr.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gunma\.jp)$/,"suffix":"gunma.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hiroshima\.jp)$/,"suffix":"hiroshima.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hokkaido\.jp)$/,"suffix":"hokkaido.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hyogo\.jp)$/,"suffix":"hyogo.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibaraki\.jp)$/,"suffix":"ibaraki.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ishikawa\.jp)$/,"suffix":"ishikawa.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwate\.jp)$/,"suffix":"iwate.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagawa\.jp)$/,"suffix":"kagawa.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kagoshima\.jp)$/,"suffix":"kagoshima.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kanagawa\.jp)$/,"suffix":"kanagawa.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.kawasaki\.jp)$/,"suffix":"kawasaki.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.kitakyushu\.jp)$/,"suffix":"kitakyushu.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.kobe\.jp)$/,"suffix":"kobe.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kochi\.jp)$/,"suffix":"kochi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kumamoto\.jp)$/,"suffix":"kumamoto.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyoto\.jp)$/,"suffix":"kyoto.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lg\.jp)$/,"suffix":"lg.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mie\.jp)$/,"suffix":"mie.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyagi\.jp)$/,"suffix":"miyagi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(miyazaki\.jp)$/,"suffix":"miyazaki.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagano\.jp)$/,"suffix":"nagano.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagasaki\.jp)$/,"suffix":"nagasaki.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.nagoya\.jp)$/,"suffix":"nagoya.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nara\.jp)$/,"suffix":"nara.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.jp)$/,"suffix":"ne.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(niigata\.jp)$/,"suffix":"niigata.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oita\.jp)$/,"suffix":"oita.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(okayama\.jp)$/,"suffix":"okayama.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(okinawa\.jp)$/,"suffix":"okinawa.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.jp)$/,"suffix":"or.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(osaka\.jp)$/,"suffix":"osaka.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saga\.jp)$/,"suffix":"saga.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saitama\.jp)$/,"suffix":"saitama.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.sapporo\.jp)$/,"suffix":"sapporo.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.sendai\.jp)$/,"suffix":"sendai.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiga\.jp)$/,"suffix":"shiga.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shimane\.jp)$/,"suffix":"shimane.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shizuoka\.jp)$/,"suffix":"shizuoka.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tochigi\.jp)$/,"suffix":"tochigi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokushima\.jp)$/,"suffix":"tokushima.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokyo\.jp)$/,"suffix":"tokyo.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tottori\.jp)$/,"suffix":"tottori.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyama\.jp)$/,"suffix":"toyama.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wakayama\.jp)$/,"suffix":"wakayama.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--0trq7p7nn\.jp)$/,"suffix":"xn--0trq7p7nn.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--1ctwo\.jp)$/,"suffix":"xn--1ctwo.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--1lqs03n\.jp)$/,"suffix":"xn--1lqs03n.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--1lqs71d\.jp)$/,"suffix":"xn--1lqs71d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--2m4a15e\.jp)$/,"suffix":"xn--2m4a15e.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--32vp30h\.jp)$/,"suffix":"xn--32vp30h.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--4it168d\.jp)$/,"suffix":"xn--4it168d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--4it797k\.jp)$/,"suffix":"xn--4it797k.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--4pvxs\.jp)$/,"suffix":"xn--4pvxs.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--5js045d\.jp)$/,"suffix":"xn--5js045d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--5rtp49c\.jp)$/,"suffix":"xn--5rtp49c.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--5rtq34k\.jp)$/,"suffix":"xn--5rtq34k.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--6btw5a\.jp)$/,"suffix":"xn--6btw5a.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--6orx2r\.jp)$/,"suffix":"xn--6orx2r.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--7t0a264c\.jp)$/,"suffix":"xn--7t0a264c.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--8ltr62k\.jp)$/,"suffix":"xn--8ltr62k.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--8pvr4u\.jp)$/,"suffix":"xn--8pvr4u.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--c3s14m\.jp)$/,"suffix":"xn--c3s14m.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--d5qv7z876c\.jp)$/,"suffix":"xn--d5qv7z876c.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--djrs72d6uy\.jp)$/,"suffix":"xn--djrs72d6uy.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--djty4k\.jp)$/,"suffix":"xn--djty4k.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--efvn9s\.jp)$/,"suffix":"xn--efvn9s.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ehqz56n\.jp)$/,"suffix":"xn--ehqz56n.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--elqq16h\.jp)$/,"suffix":"xn--elqq16h.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--f6qx53a\.jp)$/,"suffix":"xn--f6qx53a.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--k7yn95e\.jp)$/,"suffix":"xn--k7yn95e.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kbrq7o\.jp)$/,"suffix":"xn--kbrq7o.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--klt787d\.jp)$/,"suffix":"xn--klt787d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kltp7d\.jp)$/,"suffix":"xn--kltp7d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kltx9a\.jp)$/,"suffix":"xn--kltx9a.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--klty5x\.jp)$/,"suffix":"xn--klty5x.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mkru45i\.jp)$/,"suffix":"xn--mkru45i.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nit225k\.jp)$/,"suffix":"xn--nit225k.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ntso0iqx3a\.jp)$/,"suffix":"xn--ntso0iqx3a.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ntsq17g\.jp)$/,"suffix":"xn--ntsq17g.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--pssu33l\.jp)$/,"suffix":"xn--pssu33l.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--qqqt11m\.jp)$/,"suffix":"xn--qqqt11m.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rht27z\.jp)$/,"suffix":"xn--rht27z.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rht3d\.jp)$/,"suffix":"xn--rht3d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rht61e\.jp)$/,"suffix":"xn--rht61e.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rny31h\.jp)$/,"suffix":"xn--rny31h.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tor131o\.jp)$/,"suffix":"xn--tor131o.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uist22h\.jp)$/,"suffix":"xn--uist22h.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uisz3g\.jp)$/,"suffix":"xn--uisz3g.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uuwu58a\.jp)$/,"suffix":"xn--uuwu58a.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vgu402c\.jp)$/,"suffix":"xn--vgu402c.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--zbx025d\.jp)$/,"suffix":"xn--zbx025d.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamagata\.jp)$/,"suffix":"yamagata.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamaguchi\.jp)$/,"suffix":"yamaguchi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamanashi\.jp)$/,"suffix":"yamanashi.jp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.yokohama\.jp)$/,"suffix":"yokohama.jp"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jp)$/,"suffix":"jp"}],"jpmorgan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jpmorgan)$/,"suffix":"jpmorgan"}],"jprs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(jprs)$/,"suffix":"jprs"}],"juegos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(juegos)$/,"suffix":"juegos"}],"juniper":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(juniper)$/,"suffix":"juniper"}],"kaufen":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaufen)$/,"suffix":"kaufen"}],"kddi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kddi)$/,"suffix":"kddi"}],"ke":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.ke)$/,"suffix":"blogspot.co.ke"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.ke)$/,"suffix":"ke"}],"kerryhotels":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kerryhotels)$/,"suffix":"kerryhotels"}],"kerrylogistics":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kerrylogistics)$/,"suffix":"kerrylogistics"}],"kerryproperties":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kerryproperties)$/,"suffix":"kerryproperties"}],"kfh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kfh)$/,"suffix":"kfh"}],"kg":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.kg)$/,"suffix":"com.kg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.kg)$/,"suffix":"edu.kg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.kg)$/,"suffix":"gov.kg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.kg)$/,"suffix":"mil.kg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.kg)$/,"suffix":"net.kg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.kg)$/,"suffix":"org.kg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kg)$/,"suffix":"kg"}],"kh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.kh)$/,"suffix":"kh"}],"ki":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.ki)$/,"suffix":"biz.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ki)$/,"suffix":"com.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ki)$/,"suffix":"edu.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ki)$/,"suffix":"gov.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ki)$/,"suffix":"info.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ki)$/,"suffix":"net.ki"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ki)$/,"suffix":"org.ki"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ki)$/,"suffix":"ki"}],"kia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kia)$/,"suffix":"kia"}],"kim":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kim)$/,"suffix":"kim"}],"kinder":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kinder)$/,"suffix":"kinder"}],"kindle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kindle)$/,"suffix":"kindle"}],"kitchen":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kitchen)$/,"suffix":"kitchen"}],"kiwi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiwi)$/,"suffix":"kiwi"}],"km":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ass\.km)$/,"suffix":"ass.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.km)$/,"suffix":"asso.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.km)$/,"suffix":"com.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.km)$/,"suffix":"coop.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.km)$/,"suffix":"edu.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.km)$/,"suffix":"gouv.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.km)$/,"suffix":"gov.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(medecin\.km)$/,"suffix":"medecin.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.km)$/,"suffix":"mil.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.km)$/,"suffix":"nom.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(notaires\.km)$/,"suffix":"notaires.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.km)$/,"suffix":"org.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pharmaciens\.km)$/,"suffix":"pharmaciens.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prd\.km)$/,"suffix":"prd.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(presse\.km)$/,"suffix":"presse.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.km)$/,"suffix":"tm.km"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(veterinaire\.km)$/,"suffix":"veterinaire.km"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(km)$/,"suffix":"km"}],"kn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.kn)$/,"suffix":"edu.kn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.kn)$/,"suffix":"gov.kn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.kn)$/,"suffix":"net.kn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.kn)$/,"suffix":"org.kn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kn)$/,"suffix":"kn"}],"koeln":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(koeln)$/,"suffix":"koeln"}],"komatsu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(komatsu)$/,"suffix":"komatsu"}],"kosher":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kosher)$/,"suffix":"kosher"}],"kp":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.kp)$/,"suffix":"com.kp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.kp)$/,"suffix":"edu.kp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.kp)$/,"suffix":"gov.kp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.kp)$/,"suffix":"org.kp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rep\.kp)$/,"suffix":"rep.kp"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tra\.kp)$/,"suffix":"tra.kp"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kp)$/,"suffix":"kp"}],"kpmg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kpmg)$/,"suffix":"kpmg"}],"kpn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kpn)$/,"suffix":"kpn"}],"kr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.kr)$/,"suffix":"ac.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.kr)$/,"suffix":"blogspot.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(busan\.kr)$/,"suffix":"busan.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chungbuk\.kr)$/,"suffix":"chungbuk.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chungnam\.kr)$/,"suffix":"chungnam.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.kr)$/,"suffix":"co.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(daegu\.kr)$/,"suffix":"daegu.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(daejeon\.kr)$/,"suffix":"daejeon.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(es\.kr)$/,"suffix":"es.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gangwon\.kr)$/,"suffix":"gangwon.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.kr)$/,"suffix":"go.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gwangju\.kr)$/,"suffix":"gwangju.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gyeongbuk\.kr)$/,"suffix":"gyeongbuk.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gyeonggi\.kr)$/,"suffix":"gyeonggi.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gyeongnam\.kr)$/,"suffix":"gyeongnam.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hs\.kr)$/,"suffix":"hs.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(incheon\.kr)$/,"suffix":"incheon.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jeju\.kr)$/,"suffix":"jeju.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jeonbuk\.kr)$/,"suffix":"jeonbuk.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jeonnam\.kr)$/,"suffix":"jeonnam.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kg\.kr)$/,"suffix":"kg.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.kr)$/,"suffix":"mil.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ms\.kr)$/,"suffix":"ms.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.kr)$/,"suffix":"ne.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.kr)$/,"suffix":"or.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pe\.kr)$/,"suffix":"pe.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(re\.kr)$/,"suffix":"re.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc\.kr)$/,"suffix":"sc.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(seoul\.kr)$/,"suffix":"seoul.kr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ulsan\.kr)$/,"suffix":"ulsan.kr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kr)$/,"suffix":"kr"}],"krd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(krd)$/,"suffix":"krd"}],"kred":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kred)$/,"suffix":"kred"}],"kuokgroup":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuokgroup)$/,"suffix":"kuokgroup"}],"kw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.kw)$/,"suffix":"kw"}],"ky":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ky)$/,"suffix":"com.ky"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ky)$/,"suffix":"edu.ky"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ky)$/,"suffix":"gov.ky"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ky)$/,"suffix":"net.ky"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ky)$/,"suffix":"org.ky"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ky)$/,"suffix":"ky"}],"kyknet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyknet)$/,"suffix":"kyknet"}],"kyoto":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyoto)$/,"suffix":"kyoto"}],"kz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.kz)$/,"suffix":"com.kz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.kz)$/,"suffix":"edu.kz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.kz)$/,"suffix":"gov.kz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.kz)$/,"suffix":"mil.kz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.kz)$/,"suffix":"net.kz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.kz)$/,"suffix":"org.kz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(kz)$/,"suffix":"kz"}],"la":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(c\.la)$/,"suffix":"c.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.la)$/,"suffix":"com.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.la)$/,"suffix":"edu.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.la)$/,"suffix":"gov.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.la)$/,"suffix":"info.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.la)$/,"suffix":"int.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.la)$/,"suffix":"net.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.la)$/,"suffix":"org.la"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(per\.la)$/,"suffix":"per.la"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(la)$/,"suffix":"la"}],"lacaixa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lacaixa)$/,"suffix":"lacaixa"}],"ladbrokes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ladbrokes)$/,"suffix":"ladbrokes"}],"lamborghini":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lamborghini)$/,"suffix":"lamborghini"}],"lamer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lamer)$/,"suffix":"lamer"}],"lancaster":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lancaster)$/,"suffix":"lancaster"}],"lancia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lancia)$/,"suffix":"lancia"}],"lancome":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lancome)$/,"suffix":"lancome"}],"land":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(land)$/,"suffix":"land"}],"landrover":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(landrover)$/,"suffix":"landrover"}],"lanxess":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lanxess)$/,"suffix":"lanxess"}],"lasalle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lasalle)$/,"suffix":"lasalle"}],"lat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lat)$/,"suffix":"lat"}],"latino":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(latino)$/,"suffix":"latino"}],"latrobe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(latrobe)$/,"suffix":"latrobe"}],"law":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(law)$/,"suffix":"law"}],"lawyer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lawyer)$/,"suffix":"lawyer"}],"lb":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.lb)$/,"suffix":"com.lb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.lb)$/,"suffix":"edu.lb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lb)$/,"suffix":"gov.lb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.lb)$/,"suffix":"net.lb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.lb)$/,"suffix":"org.lb"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lb)$/,"suffix":"lb"}],"lc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.lc)$/,"suffix":"co.lc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.lc)$/,"suffix":"com.lc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.lc)$/,"suffix":"edu.lc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lc)$/,"suffix":"gov.lc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.lc)$/,"suffix":"net.lc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.lc)$/,"suffix":"org.lc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lc)$/,"suffix":"lc"}],"lds":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lds)$/,"suffix":"lds"}],"lease":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lease)$/,"suffix":"lease"}],"leclerc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(leclerc)$/,"suffix":"leclerc"}],"lefrak":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lefrak)$/,"suffix":"lefrak"}],"legal":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(legal)$/,"suffix":"legal"}],"lego":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lego)$/,"suffix":"lego"}],"lexus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lexus)$/,"suffix":"lexus"}],"lgbt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lgbt)$/,"suffix":"lgbt"}],"li":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.li)$/,"suffix":"blogspot.li"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(li)$/,"suffix":"li"}],"liaison":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(liaison)$/,"suffix":"liaison"}],"lidl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lidl)$/,"suffix":"lidl"}],"life":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(life)$/,"suffix":"life"}],"lifeinsurance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lifeinsurance)$/,"suffix":"lifeinsurance"}],"lifestyle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lifestyle)$/,"suffix":"lifestyle"}],"lighting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lighting)$/,"suffix":"lighting"}],"like":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(like)$/,"suffix":"like"}],"lilly":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lilly)$/,"suffix":"lilly"}],"limited":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(limited)$/,"suffix":"limited"}],"limo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(limo)$/,"suffix":"limo"}],"lincoln":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lincoln)$/,"suffix":"lincoln"}],"linde":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(linde)$/,"suffix":"linde"}],"link":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(link)$/,"suffix":"link"}],"lipsy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lipsy)$/,"suffix":"lipsy"}],"live":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(live)$/,"suffix":"live"}],"living":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(living)$/,"suffix":"living"}],"lixil":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lixil)$/,"suffix":"lixil"}],"lk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.lk)$/,"suffix":"ac.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(assn\.lk)$/,"suffix":"assn.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.lk)$/,"suffix":"com.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.lk)$/,"suffix":"edu.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lk)$/,"suffix":"gov.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grp\.lk)$/,"suffix":"grp.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hotel\.lk)$/,"suffix":"hotel.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.lk)$/,"suffix":"int.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.lk)$/,"suffix":"ltd.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.lk)$/,"suffix":"net.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ngo\.lk)$/,"suffix":"ngo.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.lk)$/,"suffix":"org.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.lk)$/,"suffix":"sch.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(soc\.lk)$/,"suffix":"soc.lk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.lk)$/,"suffix":"web.lk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lk)$/,"suffix":"lk"}],"loan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(loan)$/,"suffix":"loan"}],"loans":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(loans)$/,"suffix":"loans"}],"locker":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(locker)$/,"suffix":"locker"}],"locus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(locus)$/,"suffix":"locus"}],"loft":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(loft)$/,"suffix":"loft"}],"lol":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lol)$/,"suffix":"lol"}],"london":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(london)$/,"suffix":"london"}],"lotte":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lotte)$/,"suffix":"lotte"}],"lotto":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lotto)$/,"suffix":"lotto"}],"love":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(love)$/,"suffix":"love"}],"lpl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lpl)$/,"suffix":"lpl"}],"lplfinancial":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lplfinancial)$/,"suffix":"lplfinancial"}],"lr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.lr)$/,"suffix":"com.lr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.lr)$/,"suffix":"edu.lr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lr)$/,"suffix":"gov.lr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.lr)$/,"suffix":"net.lr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.lr)$/,"suffix":"org.lr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lr)$/,"suffix":"lr"}],"ls":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ls)$/,"suffix":"co.ls"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ls)$/,"suffix":"org.ls"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ls)$/,"suffix":"ls"}],"lt":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.lt)$/,"suffix":"blogspot.lt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lt)$/,"suffix":"gov.lt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lt)$/,"suffix":"lt"}],"ltd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd)$/,"suffix":"ltd"}],"ltda":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltda)$/,"suffix":"ltda"}],"lu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.lu)$/,"suffix":"blogspot.lu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lu)$/,"suffix":"lu"}],"lundbeck":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lundbeck)$/,"suffix":"lundbeck"}],"lupin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lupin)$/,"suffix":"lupin"}],"luxe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(luxe)$/,"suffix":"luxe"}],"luxury":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(luxury)$/,"suffix":"luxury"}],"lv":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asn\.lv)$/,"suffix":"asn.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.lv)$/,"suffix":"com.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(conf\.lv)$/,"suffix":"conf.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.lv)$/,"suffix":"edu.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.lv)$/,"suffix":"gov.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(id\.lv)$/,"suffix":"id.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.lv)$/,"suffix":"mil.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.lv)$/,"suffix":"net.lv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.lv)$/,"suffix":"org.lv"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(lv)$/,"suffix":"lv"}],"ly":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ly)$/,"suffix":"com.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ly)$/,"suffix":"edu.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ly)$/,"suffix":"gov.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(id\.ly)$/,"suffix":"id.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.ly)$/,"suffix":"med.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ly)$/,"suffix":"net.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ly)$/,"suffix":"org.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plc\.ly)$/,"suffix":"plc.ly"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.ly)$/,"suffix":"sch.ly"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ly)$/,"suffix":"ly"}],"ma":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ma)$/,"suffix":"ac.ma"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ma)$/,"suffix":"co.ma"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ma)$/,"suffix":"gov.ma"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ma)$/,"suffix":"net.ma"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ma)$/,"suffix":"org.ma"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(press\.ma)$/,"suffix":"press.ma"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ma)$/,"suffix":"ma"}],"macys":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(macys)$/,"suffix":"macys"}],"madrid":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(madrid)$/,"suffix":"madrid"}],"maif":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(maif)$/,"suffix":"maif"}],"maison":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(maison)$/,"suffix":"maison"}],"makeup":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(makeup)$/,"suffix":"makeup"}],"man":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(man)$/,"suffix":"man"}],"management":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(management)$/,"suffix":"management"}],"mango":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mango)$/,"suffix":"mango"}],"market":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(market)$/,"suffix":"market"}],"marketing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(marketing)$/,"suffix":"marketing"}],"markets":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(markets)$/,"suffix":"markets"}],"marriott":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(marriott)$/,"suffix":"marriott"}],"marshalls":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(marshalls)$/,"suffix":"marshalls"}],"maserati":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(maserati)$/,"suffix":"maserati"}],"mattel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mattel)$/,"suffix":"mattel"}],"mba":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mba)$/,"suffix":"mba"}],"mc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.mc)$/,"suffix":"asso.mc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.mc)$/,"suffix":"tm.mc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mc)$/,"suffix":"mc"}],"mcd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mcd)$/,"suffix":"mcd"}],"mcdonalds":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mcdonalds)$/,"suffix":"mcdonalds"}],"mckinsey":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mckinsey)$/,"suffix":"mckinsey"}],"md":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.md)$/,"suffix":"blogspot.md"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(md)$/,"suffix":"md"}],"me":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.me)$/,"suffix":"ac.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.me)$/,"suffix":"co.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(diskstation\.me)$/,"suffix":"diskstation.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dscloud\.me)$/,"suffix":"dscloud.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.me)$/,"suffix":"edu.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.me)$/,"suffix":"gov.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(i234\.me)$/,"suffix":"i234.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(its\.me)$/,"suffix":"its.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(myds\.me)$/,"suffix":"myds.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.me)$/,"suffix":"net.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.me)$/,"suffix":"org.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(priv\.me)$/,"suffix":"priv.me"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(synology\.me)$/,"suffix":"synology.me"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(me)$/,"suffix":"me"}],"med":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(med)$/,"suffix":"med"}],"media":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(media)$/,"suffix":"media"}],"meet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(meet)$/,"suffix":"meet"}],"melbourne":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(melbourne)$/,"suffix":"melbourne"}],"meme":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(meme)$/,"suffix":"meme"}],"memorial":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(memorial)$/,"suffix":"memorial"}],"men":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(men)$/,"suffix":"men"}],"menu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(menu)$/,"suffix":"menu"}],"meo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(meo)$/,"suffix":"meo"}],"metlife":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(metlife)$/,"suffix":"metlife"}],"mg":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.mg)$/,"suffix":"co.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mg)$/,"suffix":"com.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mg)$/,"suffix":"edu.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mg)$/,"suffix":"gov.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.mg)$/,"suffix":"mil.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.mg)$/,"suffix":"nom.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mg)$/,"suffix":"org.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prd\.mg)$/,"suffix":"prd.mg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.mg)$/,"suffix":"tm.mg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mg)$/,"suffix":"mg"}],"mh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mh)$/,"suffix":"mh"}],"miami":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(miami)$/,"suffix":"miami"}],"microsoft":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(microsoft)$/,"suffix":"microsoft"}],"mil":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil)$/,"suffix":"mil"}],"mini":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mini)$/,"suffix":"mini"}],"mint":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mint)$/,"suffix":"mint"}],"mit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mit)$/,"suffix":"mit"}],"mitsubishi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mitsubishi)$/,"suffix":"mitsubishi"}],"mk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.mk)$/,"suffix":"blogspot.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mk)$/,"suffix":"com.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mk)$/,"suffix":"edu.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mk)$/,"suffix":"gov.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(inf\.mk)$/,"suffix":"inf.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.mk)$/,"suffix":"name.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mk)$/,"suffix":"net.mk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mk)$/,"suffix":"org.mk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mk)$/,"suffix":"mk"}],"ml":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ml)$/,"suffix":"com.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ml)$/,"suffix":"edu.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.ml)$/,"suffix":"gouv.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ml)$/,"suffix":"gov.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ml)$/,"suffix":"net.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ml)$/,"suffix":"org.ml"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(presse\.ml)$/,"suffix":"presse.ml"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ml)$/,"suffix":"ml"}],"mlb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mlb)$/,"suffix":"mlb"}],"mls":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mls)$/,"suffix":"mls"}],"mm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.mm)$/,"suffix":"mm"}],"mma":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mma)$/,"suffix":"mma"}],"mn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mn)$/,"suffix":"edu.mn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mn)$/,"suffix":"gov.mn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nyc\.mn)$/,"suffix":"nyc.mn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mn)$/,"suffix":"org.mn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mn)$/,"suffix":"mn"}],"mnet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mnet)$/,"suffix":"mnet"}],"mo":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mo)$/,"suffix":"com.mo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mo)$/,"suffix":"edu.mo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mo)$/,"suffix":"gov.mo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mo)$/,"suffix":"net.mo"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mo)$/,"suffix":"org.mo"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mo)$/,"suffix":"mo"}],"mobi":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dscloud\.mobi)$/,"suffix":"dscloud.mobi"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi)$/,"suffix":"mobi"}],"mobily":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobily)$/,"suffix":"mobily"}],"moda":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(moda)$/,"suffix":"moda"}],"moe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(moe)$/,"suffix":"moe"}],"moi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(moi)$/,"suffix":"moi"}],"mom":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mom)$/,"suffix":"mom"}],"monash":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(monash)$/,"suffix":"monash"}],"money":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(money)$/,"suffix":"money"}],"monster":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(monster)$/,"suffix":"monster"}],"montblanc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(montblanc)$/,"suffix":"montblanc"}],"mopar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mopar)$/,"suffix":"mopar"}],"mormon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mormon)$/,"suffix":"mormon"}],"mortgage":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mortgage)$/,"suffix":"mortgage"}],"moscow":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(moscow)$/,"suffix":"moscow"}],"moto":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(moto)$/,"suffix":"moto"}],"motorcycles":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(motorcycles)$/,"suffix":"motorcycles"}],"mov":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mov)$/,"suffix":"mov"}],"movie":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(movie)$/,"suffix":"movie"}],"movistar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(movistar)$/,"suffix":"movistar"}],"mp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mp)$/,"suffix":"mp"}],"mq":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mq)$/,"suffix":"mq"}],"mr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.mr)$/,"suffix":"blogspot.mr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mr)$/,"suffix":"gov.mr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mr)$/,"suffix":"mr"}],"ms":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ms)$/,"suffix":"com.ms"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ms)$/,"suffix":"edu.ms"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ms)$/,"suffix":"gov.ms"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ms)$/,"suffix":"net.ms"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ms)$/,"suffix":"org.ms"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ms)$/,"suffix":"ms"}],"msd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(msd)$/,"suffix":"msd"}],"mt":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.mt)$/,"suffix":"blogspot.com.mt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mt)$/,"suffix":"com.mt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mt)$/,"suffix":"edu.mt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mt)$/,"suffix":"net.mt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mt)$/,"suffix":"org.mt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mt)$/,"suffix":"mt"}],"mtn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mtn)$/,"suffix":"mtn"}],"mtpc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mtpc)$/,"suffix":"mtpc"}],"mtr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mtr)$/,"suffix":"mtr"}],"mu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.mu)$/,"suffix":"ac.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.mu)$/,"suffix":"co.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mu)$/,"suffix":"com.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mu)$/,"suffix":"gov.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mu)$/,"suffix":"net.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.mu)$/,"suffix":"or.mu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mu)$/,"suffix":"org.mu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mu)$/,"suffix":"mu"}],"multichoice":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(multichoice)$/,"suffix":"multichoice"}],"museum":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(academy\.museum)$/,"suffix":"academy.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agriculture\.museum)$/,"suffix":"agriculture.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(air\.museum)$/,"suffix":"air.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(airguard\.museum)$/,"suffix":"airguard.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alabama\.museum)$/,"suffix":"alabama.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alaska\.museum)$/,"suffix":"alaska.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amber\.museum)$/,"suffix":"amber.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ambulance\.museum)$/,"suffix":"ambulance.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(american\.museum)$/,"suffix":"american.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(americana\.museum)$/,"suffix":"americana.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(americanantiques\.museum)$/,"suffix":"americanantiques.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(americanart\.museum)$/,"suffix":"americanart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amsterdam\.museum)$/,"suffix":"amsterdam.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(and\.museum)$/,"suffix":"and.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(annefrank\.museum)$/,"suffix":"annefrank.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(anthro\.museum)$/,"suffix":"anthro.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(anthropology\.museum)$/,"suffix":"anthropology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(antiques\.museum)$/,"suffix":"antiques.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aquarium\.museum)$/,"suffix":"aquarium.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arboretum\.museum)$/,"suffix":"arboretum.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(archaeological\.museum)$/,"suffix":"archaeological.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(archaeology\.museum)$/,"suffix":"archaeology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(architecture\.museum)$/,"suffix":"architecture.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.museum)$/,"suffix":"art.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(artanddesign\.museum)$/,"suffix":"artanddesign.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(artcenter\.museum)$/,"suffix":"artcenter.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(artdeco\.museum)$/,"suffix":"artdeco.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arteducation\.museum)$/,"suffix":"arteducation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(artgallery\.museum)$/,"suffix":"artgallery.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arts\.museum)$/,"suffix":"arts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(artsandcrafts\.museum)$/,"suffix":"artsandcrafts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asmatart\.museum)$/,"suffix":"asmatart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(assassination\.museum)$/,"suffix":"assassination.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(assisi\.museum)$/,"suffix":"assisi.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(association\.museum)$/,"suffix":"association.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(astronomy\.museum)$/,"suffix":"astronomy.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(atlanta\.museum)$/,"suffix":"atlanta.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(austin\.museum)$/,"suffix":"austin.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(australia\.museum)$/,"suffix":"australia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(automotive\.museum)$/,"suffix":"automotive.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aviation\.museum)$/,"suffix":"aviation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(axis\.museum)$/,"suffix":"axis.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(badajoz\.museum)$/,"suffix":"badajoz.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baghdad\.museum)$/,"suffix":"baghdad.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bahn\.museum)$/,"suffix":"bahn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bale\.museum)$/,"suffix":"bale.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baltimore\.museum)$/,"suffix":"baltimore.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barcelona\.museum)$/,"suffix":"barcelona.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baseball\.museum)$/,"suffix":"baseball.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(basel\.museum)$/,"suffix":"basel.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baths\.museum)$/,"suffix":"baths.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bauern\.museum)$/,"suffix":"bauern.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(beauxarts\.museum)$/,"suffix":"beauxarts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(beeldengeluid\.museum)$/,"suffix":"beeldengeluid.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bellevue\.museum)$/,"suffix":"bellevue.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bergbau\.museum)$/,"suffix":"bergbau.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(berkeley\.museum)$/,"suffix":"berkeley.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(berlin\.museum)$/,"suffix":"berlin.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bern\.museum)$/,"suffix":"bern.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bible\.museum)$/,"suffix":"bible.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bilbao\.museum)$/,"suffix":"bilbao.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bill\.museum)$/,"suffix":"bill.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(birdart\.museum)$/,"suffix":"birdart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(birthplace\.museum)$/,"suffix":"birthplace.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bonn\.museum)$/,"suffix":"bonn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(boston\.museum)$/,"suffix":"boston.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(botanical\.museum)$/,"suffix":"botanical.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(botanicalgarden\.museum)$/,"suffix":"botanicalgarden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(botanicgarden\.museum)$/,"suffix":"botanicgarden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(botany\.museum)$/,"suffix":"botany.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brandywinevalley\.museum)$/,"suffix":"brandywinevalley.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brasil\.museum)$/,"suffix":"brasil.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bristol\.museum)$/,"suffix":"bristol.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(british\.museum)$/,"suffix":"british.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(britishcolumbia\.museum)$/,"suffix":"britishcolumbia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(broadcast\.museum)$/,"suffix":"broadcast.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brunel\.museum)$/,"suffix":"brunel.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brussel\.museum)$/,"suffix":"brussel.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brussels\.museum)$/,"suffix":"brussels.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bruxelles\.museum)$/,"suffix":"bruxelles.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(building\.museum)$/,"suffix":"building.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(burghof\.museum)$/,"suffix":"burghof.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bus\.museum)$/,"suffix":"bus.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bushey\.museum)$/,"suffix":"bushey.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cadaques\.museum)$/,"suffix":"cadaques.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(california\.museum)$/,"suffix":"california.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cambridge\.museum)$/,"suffix":"cambridge.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(can\.museum)$/,"suffix":"can.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(canada\.museum)$/,"suffix":"canada.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(capebreton\.museum)$/,"suffix":"capebreton.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(carrier\.museum)$/,"suffix":"carrier.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cartoonart\.museum)$/,"suffix":"cartoonart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(casadelamoneda\.museum)$/,"suffix":"casadelamoneda.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(castle\.museum)$/,"suffix":"castle.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(castres\.museum)$/,"suffix":"castres.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(celtic\.museum)$/,"suffix":"celtic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(center\.museum)$/,"suffix":"center.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chattanooga\.museum)$/,"suffix":"chattanooga.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cheltenham\.museum)$/,"suffix":"cheltenham.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chesapeakebay\.museum)$/,"suffix":"chesapeakebay.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chicago\.museum)$/,"suffix":"chicago.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(children\.museum)$/,"suffix":"children.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(childrens\.museum)$/,"suffix":"childrens.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(childrensgarden\.museum)$/,"suffix":"childrensgarden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chiropractic\.museum)$/,"suffix":"chiropractic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chocolate\.museum)$/,"suffix":"chocolate.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(christiansburg\.museum)$/,"suffix":"christiansburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cincinnati\.museum)$/,"suffix":"cincinnati.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cinema\.museum)$/,"suffix":"cinema.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(circus\.museum)$/,"suffix":"circus.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(civilisation\.museum)$/,"suffix":"civilisation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(civilization\.museum)$/,"suffix":"civilization.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(civilwar\.museum)$/,"suffix":"civilwar.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(clinton\.museum)$/,"suffix":"clinton.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(clock\.museum)$/,"suffix":"clock.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coal\.museum)$/,"suffix":"coal.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coastaldefence\.museum)$/,"suffix":"coastaldefence.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cody\.museum)$/,"suffix":"cody.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coldwar\.museum)$/,"suffix":"coldwar.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(collection\.museum)$/,"suffix":"collection.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(colonialwilliamsburg\.museum)$/,"suffix":"colonialwilliamsburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coloradoplateau\.museum)$/,"suffix":"coloradoplateau.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(columbia\.museum)$/,"suffix":"columbia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(columbus\.museum)$/,"suffix":"columbus.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(communication\.museum)$/,"suffix":"communication.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(communications\.museum)$/,"suffix":"communications.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(community\.museum)$/,"suffix":"community.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(computer\.museum)$/,"suffix":"computer.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(computerhistory\.museum)$/,"suffix":"computerhistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(contemporary\.museum)$/,"suffix":"contemporary.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(contemporaryart\.museum)$/,"suffix":"contemporaryart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(convent\.museum)$/,"suffix":"convent.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(copenhagen\.museum)$/,"suffix":"copenhagen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(corporation\.museum)$/,"suffix":"corporation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(corvette\.museum)$/,"suffix":"corvette.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(costume\.museum)$/,"suffix":"costume.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(countryestate\.museum)$/,"suffix":"countryestate.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(county\.museum)$/,"suffix":"county.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(crafts\.museum)$/,"suffix":"crafts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cranbrook\.museum)$/,"suffix":"cranbrook.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(creation\.museum)$/,"suffix":"creation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cultural\.museum)$/,"suffix":"cultural.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(culturalcenter\.museum)$/,"suffix":"culturalcenter.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(culture\.museum)$/,"suffix":"culture.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cyber\.museum)$/,"suffix":"cyber.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cymru\.museum)$/,"suffix":"cymru.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dali\.museum)$/,"suffix":"dali.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dallas\.museum)$/,"suffix":"dallas.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(database\.museum)$/,"suffix":"database.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ddr\.museum)$/,"suffix":"ddr.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(decorativearts\.museum)$/,"suffix":"decorativearts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(delaware\.museum)$/,"suffix":"delaware.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(delmenhorst\.museum)$/,"suffix":"delmenhorst.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(denmark\.museum)$/,"suffix":"denmark.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(depot\.museum)$/,"suffix":"depot.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(design\.museum)$/,"suffix":"design.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(detroit\.museum)$/,"suffix":"detroit.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dinosaur\.museum)$/,"suffix":"dinosaur.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(discovery\.museum)$/,"suffix":"discovery.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dolls\.museum)$/,"suffix":"dolls.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(donostia\.museum)$/,"suffix":"donostia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(durham\.museum)$/,"suffix":"durham.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eastafrica\.museum)$/,"suffix":"eastafrica.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eastcoast\.museum)$/,"suffix":"eastcoast.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(education\.museum)$/,"suffix":"education.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(educational\.museum)$/,"suffix":"educational.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(egyptian\.museum)$/,"suffix":"egyptian.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eisenbahn\.museum)$/,"suffix":"eisenbahn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elburg\.museum)$/,"suffix":"elburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elvendrell\.museum)$/,"suffix":"elvendrell.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(embroidery\.museum)$/,"suffix":"embroidery.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(encyclopedic\.museum)$/,"suffix":"encyclopedic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(england\.museum)$/,"suffix":"england.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(entomology\.museum)$/,"suffix":"entomology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(environment\.museum)$/,"suffix":"environment.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(environmentalconservation\.museum)$/,"suffix":"environmentalconservation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(epilepsy\.museum)$/,"suffix":"epilepsy.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(essex\.museum)$/,"suffix":"essex.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(estate\.museum)$/,"suffix":"estate.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ethnology\.museum)$/,"suffix":"ethnology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(exeter\.museum)$/,"suffix":"exeter.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(exhibition\.museum)$/,"suffix":"exhibition.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(family\.museum)$/,"suffix":"family.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(farm\.museum)$/,"suffix":"farm.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(farmequipment\.museum)$/,"suffix":"farmequipment.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(farmers\.museum)$/,"suffix":"farmers.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(farmstead\.museum)$/,"suffix":"farmstead.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(field\.museum)$/,"suffix":"field.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(figueres\.museum)$/,"suffix":"figueres.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(filatelia\.museum)$/,"suffix":"filatelia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(film\.museum)$/,"suffix":"film.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fineart\.museum)$/,"suffix":"fineart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(finearts\.museum)$/,"suffix":"finearts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(finland\.museum)$/,"suffix":"finland.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flanders\.museum)$/,"suffix":"flanders.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(florida\.museum)$/,"suffix":"florida.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(force\.museum)$/,"suffix":"force.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fortmissoula\.museum)$/,"suffix":"fortmissoula.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fortworth\.museum)$/,"suffix":"fortworth.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(foundation\.museum)$/,"suffix":"foundation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(francaise\.museum)$/,"suffix":"francaise.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frankfurt\.museum)$/,"suffix":"frankfurt.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(franziskaner\.museum)$/,"suffix":"franziskaner.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(freemasonry\.museum)$/,"suffix":"freemasonry.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(freiburg\.museum)$/,"suffix":"freiburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fribourg\.museum)$/,"suffix":"fribourg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frog\.museum)$/,"suffix":"frog.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fundacio\.museum)$/,"suffix":"fundacio.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(furniture\.museum)$/,"suffix":"furniture.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gallery\.museum)$/,"suffix":"gallery.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(garden\.museum)$/,"suffix":"garden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gateway\.museum)$/,"suffix":"gateway.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(geelvinck\.museum)$/,"suffix":"geelvinck.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gemological\.museum)$/,"suffix":"gemological.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(geology\.museum)$/,"suffix":"geology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(georgia\.museum)$/,"suffix":"georgia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(giessen\.museum)$/,"suffix":"giessen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(glas\.museum)$/,"suffix":"glas.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(glass\.museum)$/,"suffix":"glass.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gorge\.museum)$/,"suffix":"gorge.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grandrapids\.museum)$/,"suffix":"grandrapids.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(graz\.museum)$/,"suffix":"graz.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(guernsey\.museum)$/,"suffix":"guernsey.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(halloffame\.museum)$/,"suffix":"halloffame.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamburg\.museum)$/,"suffix":"hamburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(handson\.museum)$/,"suffix":"handson.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(harvestcelebration\.museum)$/,"suffix":"harvestcelebration.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hawaii\.museum)$/,"suffix":"hawaii.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(health\.museum)$/,"suffix":"health.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(heimatunduhren\.museum)$/,"suffix":"heimatunduhren.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hellas\.museum)$/,"suffix":"hellas.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(helsinki\.museum)$/,"suffix":"helsinki.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hembygdsforbund\.museum)$/,"suffix":"hembygdsforbund.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(heritage\.museum)$/,"suffix":"heritage.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(histoire\.museum)$/,"suffix":"histoire.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historical\.museum)$/,"suffix":"historical.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historicalsociety\.museum)$/,"suffix":"historicalsociety.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historichouses\.museum)$/,"suffix":"historichouses.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historisch\.museum)$/,"suffix":"historisch.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historisches\.museum)$/,"suffix":"historisches.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(history\.museum)$/,"suffix":"history.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(historyofscience\.museum)$/,"suffix":"historyofscience.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(horology\.museum)$/,"suffix":"horology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(house\.museum)$/,"suffix":"house.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(humanities\.museum)$/,"suffix":"humanities.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(illustration\.museum)$/,"suffix":"illustration.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(imageandsound\.museum)$/,"suffix":"imageandsound.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(indian\.museum)$/,"suffix":"indian.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(indiana\.museum)$/,"suffix":"indiana.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(indianapolis\.museum)$/,"suffix":"indianapolis.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(indianmarket\.museum)$/,"suffix":"indianmarket.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(intelligence\.museum)$/,"suffix":"intelligence.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(interactive\.museum)$/,"suffix":"interactive.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iraq\.museum)$/,"suffix":"iraq.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iron\.museum)$/,"suffix":"iron.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isleofman\.museum)$/,"suffix":"isleofman.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jamison\.museum)$/,"suffix":"jamison.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jefferson\.museum)$/,"suffix":"jefferson.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jerusalem\.museum)$/,"suffix":"jerusalem.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jewelry\.museum)$/,"suffix":"jewelry.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jewish\.museum)$/,"suffix":"jewish.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jewishart\.museum)$/,"suffix":"jewishart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jfk\.museum)$/,"suffix":"jfk.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(journalism\.museum)$/,"suffix":"journalism.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(judaica\.museum)$/,"suffix":"judaica.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(judygarland\.museum)$/,"suffix":"judygarland.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(juedisches\.museum)$/,"suffix":"juedisches.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(juif\.museum)$/,"suffix":"juif.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karate\.museum)$/,"suffix":"karate.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karikatur\.museum)$/,"suffix":"karikatur.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kids\.museum)$/,"suffix":"kids.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(koebenhavn\.museum)$/,"suffix":"koebenhavn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(koeln\.museum)$/,"suffix":"koeln.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunst\.museum)$/,"suffix":"kunst.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunstsammlung\.museum)$/,"suffix":"kunstsammlung.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kunstunddesign\.museum)$/,"suffix":"kunstunddesign.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(labor\.museum)$/,"suffix":"labor.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(labour\.museum)$/,"suffix":"labour.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lajolla\.museum)$/,"suffix":"lajolla.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lancashire\.museum)$/,"suffix":"lancashire.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(landes\.museum)$/,"suffix":"landes.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lans\.museum)$/,"suffix":"lans.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(larsson\.museum)$/,"suffix":"larsson.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lewismiller\.museum)$/,"suffix":"lewismiller.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lincoln\.museum)$/,"suffix":"lincoln.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(linz\.museum)$/,"suffix":"linz.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(living\.museum)$/,"suffix":"living.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(livinghistory\.museum)$/,"suffix":"livinghistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(localhistory\.museum)$/,"suffix":"localhistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(london\.museum)$/,"suffix":"london.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(losangeles\.museum)$/,"suffix":"losangeles.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(louvre\.museum)$/,"suffix":"louvre.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(loyalist\.museum)$/,"suffix":"loyalist.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lucerne\.museum)$/,"suffix":"lucerne.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(luxembourg\.museum)$/,"suffix":"luxembourg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(luzern\.museum)$/,"suffix":"luzern.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mad\.museum)$/,"suffix":"mad.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(madrid\.museum)$/,"suffix":"madrid.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mallorca\.museum)$/,"suffix":"mallorca.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(manchester\.museum)$/,"suffix":"manchester.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mansion\.museum)$/,"suffix":"mansion.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mansions\.museum)$/,"suffix":"mansions.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(manx\.museum)$/,"suffix":"manx.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marburg\.museum)$/,"suffix":"marburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(maritime\.museum)$/,"suffix":"maritime.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(maritimo\.museum)$/,"suffix":"maritimo.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(maryland\.museum)$/,"suffix":"maryland.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marylhurst\.museum)$/,"suffix":"marylhurst.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(media\.museum)$/,"suffix":"media.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(medical\.museum)$/,"suffix":"medical.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(medizinhistorisches\.museum)$/,"suffix":"medizinhistorisches.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(meeres\.museum)$/,"suffix":"meeres.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(memorial\.museum)$/,"suffix":"memorial.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mesaverde\.museum)$/,"suffix":"mesaverde.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(michigan\.museum)$/,"suffix":"michigan.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(midatlantic\.museum)$/,"suffix":"midatlantic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(military\.museum)$/,"suffix":"military.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mill\.museum)$/,"suffix":"mill.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(miners\.museum)$/,"suffix":"miners.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mining\.museum)$/,"suffix":"mining.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(minnesota\.museum)$/,"suffix":"minnesota.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(missile\.museum)$/,"suffix":"missile.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(missoula\.museum)$/,"suffix":"missoula.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(modern\.museum)$/,"suffix":"modern.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(moma\.museum)$/,"suffix":"moma.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(money\.museum)$/,"suffix":"money.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monmouth\.museum)$/,"suffix":"monmouth.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(monticello\.museum)$/,"suffix":"monticello.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(montreal\.museum)$/,"suffix":"montreal.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(moscow\.museum)$/,"suffix":"moscow.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(motorcycle\.museum)$/,"suffix":"motorcycle.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(muenchen\.museum)$/,"suffix":"muenchen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(muenster\.museum)$/,"suffix":"muenster.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mulhouse\.museum)$/,"suffix":"mulhouse.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(muncie\.museum)$/,"suffix":"muncie.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museet\.museum)$/,"suffix":"museet.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museumcenter\.museum)$/,"suffix":"museumcenter.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museumvereniging\.museum)$/,"suffix":"museumvereniging.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(music\.museum)$/,"suffix":"music.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(national\.museum)$/,"suffix":"national.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nationalfirearms\.museum)$/,"suffix":"nationalfirearms.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nationalheritage\.museum)$/,"suffix":"nationalheritage.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nativeamerican\.museum)$/,"suffix":"nativeamerican.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naturalhistory\.museum)$/,"suffix":"naturalhistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naturalhistorymuseum\.museum)$/,"suffix":"naturalhistorymuseum.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naturalsciences\.museum)$/,"suffix":"naturalsciences.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nature\.museum)$/,"suffix":"nature.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naturhistorisches\.museum)$/,"suffix":"naturhistorisches.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(natuurwetenschappen\.museum)$/,"suffix":"natuurwetenschappen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naumburg\.museum)$/,"suffix":"naumburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naval\.museum)$/,"suffix":"naval.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nebraska\.museum)$/,"suffix":"nebraska.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(neues\.museum)$/,"suffix":"neues.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newhampshire\.museum)$/,"suffix":"newhampshire.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newjersey\.museum)$/,"suffix":"newjersey.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newmexico\.museum)$/,"suffix":"newmexico.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newport\.museum)$/,"suffix":"newport.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newspaper\.museum)$/,"suffix":"newspaper.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(newyork\.museum)$/,"suffix":"newyork.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(niepce\.museum)$/,"suffix":"niepce.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(norfolk\.museum)$/,"suffix":"norfolk.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(north\.museum)$/,"suffix":"north.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nrw\.museum)$/,"suffix":"nrw.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nuernberg\.museum)$/,"suffix":"nuernberg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nuremberg\.museum)$/,"suffix":"nuremberg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nyc\.museum)$/,"suffix":"nyc.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nyny\.museum)$/,"suffix":"nyny.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oceanographic\.museum)$/,"suffix":"oceanographic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oceanographique\.museum)$/,"suffix":"oceanographique.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(omaha\.museum)$/,"suffix":"omaha.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(online\.museum)$/,"suffix":"online.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ontario\.museum)$/,"suffix":"ontario.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(openair\.museum)$/,"suffix":"openair.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oregon\.museum)$/,"suffix":"oregon.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oregontrail\.museum)$/,"suffix":"oregontrail.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(otago\.museum)$/,"suffix":"otago.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oxford\.museum)$/,"suffix":"oxford.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pacific\.museum)$/,"suffix":"pacific.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(paderborn\.museum)$/,"suffix":"paderborn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(palace\.museum)$/,"suffix":"palace.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(paleo\.museum)$/,"suffix":"paleo.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(palmsprings\.museum)$/,"suffix":"palmsprings.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(panama\.museum)$/,"suffix":"panama.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(paris\.museum)$/,"suffix":"paris.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pasadena\.museum)$/,"suffix":"pasadena.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pharmacy\.museum)$/,"suffix":"pharmacy.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(philadelphia\.museum)$/,"suffix":"philadelphia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(philadelphiaarea\.museum)$/,"suffix":"philadelphiaarea.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(philately\.museum)$/,"suffix":"philately.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(phoenix\.museum)$/,"suffix":"phoenix.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(photography\.museum)$/,"suffix":"photography.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pilots\.museum)$/,"suffix":"pilots.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pittsburgh\.museum)$/,"suffix":"pittsburgh.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(planetarium\.museum)$/,"suffix":"planetarium.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plantation\.museum)$/,"suffix":"plantation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plants\.museum)$/,"suffix":"plants.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plaza\.museum)$/,"suffix":"plaza.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(portal\.museum)$/,"suffix":"portal.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(portland\.museum)$/,"suffix":"portland.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(portlligat\.museum)$/,"suffix":"portlligat.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(posts-and-telecommunications\.museum)$/,"suffix":"posts-and-telecommunications.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(preservation\.museum)$/,"suffix":"preservation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(presidio\.museum)$/,"suffix":"presidio.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(press\.museum)$/,"suffix":"press.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(project\.museum)$/,"suffix":"project.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(public\.museum)$/,"suffix":"public.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pubol\.museum)$/,"suffix":"pubol.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(quebec\.museum)$/,"suffix":"quebec.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(railroad\.museum)$/,"suffix":"railroad.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(railway\.museum)$/,"suffix":"railway.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(research\.museum)$/,"suffix":"research.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(resistance\.museum)$/,"suffix":"resistance.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(riodejaneiro\.museum)$/,"suffix":"riodejaneiro.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rochester\.museum)$/,"suffix":"rochester.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rockart\.museum)$/,"suffix":"rockart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(roma\.museum)$/,"suffix":"roma.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(russia\.museum)$/,"suffix":"russia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saintlouis\.museum)$/,"suffix":"saintlouis.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salem\.museum)$/,"suffix":"salem.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salvadordali\.museum)$/,"suffix":"salvadordali.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salzburg\.museum)$/,"suffix":"salzburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandiego\.museum)$/,"suffix":"sandiego.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanfrancisco\.museum)$/,"suffix":"sanfrancisco.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(santabarbara\.museum)$/,"suffix":"santabarbara.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(santacruz\.museum)$/,"suffix":"santacruz.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(santafe\.museum)$/,"suffix":"santafe.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saskatchewan\.museum)$/,"suffix":"saskatchewan.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(satx\.museum)$/,"suffix":"satx.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(savannahga\.museum)$/,"suffix":"savannahga.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(schlesisches\.museum)$/,"suffix":"schlesisches.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(schoenbrunn\.museum)$/,"suffix":"schoenbrunn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(schokoladen\.museum)$/,"suffix":"schokoladen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(school\.museum)$/,"suffix":"school.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(schweiz\.museum)$/,"suffix":"schweiz.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(science-fiction\.museum)$/,"suffix":"science-fiction.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(science\.museum)$/,"suffix":"science.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scienceandhistory\.museum)$/,"suffix":"scienceandhistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scienceandindustry\.museum)$/,"suffix":"scienceandindustry.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sciencecenter\.museum)$/,"suffix":"sciencecenter.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sciencecenters\.museum)$/,"suffix":"sciencecenters.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sciencehistory\.museum)$/,"suffix":"sciencehistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sciences\.museum)$/,"suffix":"sciences.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sciencesnaturelles\.museum)$/,"suffix":"sciencesnaturelles.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scotland\.museum)$/,"suffix":"scotland.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(seaport\.museum)$/,"suffix":"seaport.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(settlement\.museum)$/,"suffix":"settlement.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(settlers\.museum)$/,"suffix":"settlers.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shell\.museum)$/,"suffix":"shell.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sherbrooke\.museum)$/,"suffix":"sherbrooke.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sibenik\.museum)$/,"suffix":"sibenik.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(silk\.museum)$/,"suffix":"silk.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ski\.museum)$/,"suffix":"ski.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skole\.museum)$/,"suffix":"skole.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(society\.museum)$/,"suffix":"society.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sologne\.museum)$/,"suffix":"sologne.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(soundandvision\.museum)$/,"suffix":"soundandvision.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(southcarolina\.museum)$/,"suffix":"southcarolina.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(southwest\.museum)$/,"suffix":"southwest.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(space\.museum)$/,"suffix":"space.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(spy\.museum)$/,"suffix":"spy.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(square\.museum)$/,"suffix":"square.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stadt\.museum)$/,"suffix":"stadt.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stalbans\.museum)$/,"suffix":"stalbans.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(starnberg\.museum)$/,"suffix":"starnberg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(state\.museum)$/,"suffix":"state.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stateofdelaware\.museum)$/,"suffix":"stateofdelaware.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(station\.museum)$/,"suffix":"station.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(steam\.museum)$/,"suffix":"steam.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(steiermark\.museum)$/,"suffix":"steiermark.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stjohn\.museum)$/,"suffix":"stjohn.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stockholm\.museum)$/,"suffix":"stockholm.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stpetersburg\.museum)$/,"suffix":"stpetersburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stuttgart\.museum)$/,"suffix":"stuttgart.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(suisse\.museum)$/,"suffix":"suisse.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(surgeonshall\.museum)$/,"suffix":"surgeonshall.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(surrey\.museum)$/,"suffix":"surrey.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(svizzera\.museum)$/,"suffix":"svizzera.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sweden\.museum)$/,"suffix":"sweden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sydney\.museum)$/,"suffix":"sydney.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tank\.museum)$/,"suffix":"tank.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tcm\.museum)$/,"suffix":"tcm.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(technology\.museum)$/,"suffix":"technology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(telekommunikation\.museum)$/,"suffix":"telekommunikation.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(television\.museum)$/,"suffix":"television.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(texas\.museum)$/,"suffix":"texas.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(textile\.museum)$/,"suffix":"textile.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(theater\.museum)$/,"suffix":"theater.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(time\.museum)$/,"suffix":"time.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(timekeeping\.museum)$/,"suffix":"timekeeping.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(topology\.museum)$/,"suffix":"topology.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(torino\.museum)$/,"suffix":"torino.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(touch\.museum)$/,"suffix":"touch.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(town\.museum)$/,"suffix":"town.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(transport\.museum)$/,"suffix":"transport.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tree\.museum)$/,"suffix":"tree.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trolley\.museum)$/,"suffix":"trolley.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trust\.museum)$/,"suffix":"trust.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trustee\.museum)$/,"suffix":"trustee.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uhren\.museum)$/,"suffix":"uhren.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ulm\.museum)$/,"suffix":"ulm.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(undersea\.museum)$/,"suffix":"undersea.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(university\.museum)$/,"suffix":"university.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usa\.museum)$/,"suffix":"usa.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usantiques\.museum)$/,"suffix":"usantiques.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usarts\.museum)$/,"suffix":"usarts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uscountryestate\.museum)$/,"suffix":"uscountryestate.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usculture\.museum)$/,"suffix":"usculture.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usdecorativearts\.museum)$/,"suffix":"usdecorativearts.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(usgarden\.museum)$/,"suffix":"usgarden.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ushistory\.museum)$/,"suffix":"ushistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ushuaia\.museum)$/,"suffix":"ushuaia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uslivinghistory\.museum)$/,"suffix":"uslivinghistory.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(utah\.museum)$/,"suffix":"utah.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uvic\.museum)$/,"suffix":"uvic.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valley\.museum)$/,"suffix":"valley.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vantaa\.museum)$/,"suffix":"vantaa.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(versailles\.museum)$/,"suffix":"versailles.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(viking\.museum)$/,"suffix":"viking.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(village\.museum)$/,"suffix":"village.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(virginia\.museum)$/,"suffix":"virginia.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(virtual\.museum)$/,"suffix":"virtual.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(virtuel\.museum)$/,"suffix":"virtuel.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vlaanderen\.museum)$/,"suffix":"vlaanderen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(volkenkunde\.museum)$/,"suffix":"volkenkunde.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wales\.museum)$/,"suffix":"wales.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wallonie\.museum)$/,"suffix":"wallonie.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(war\.museum)$/,"suffix":"war.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(washingtondc\.museum)$/,"suffix":"washingtondc.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(watch-and-clock\.museum)$/,"suffix":"watch-and-clock.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(watchandclock\.museum)$/,"suffix":"watchandclock.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(western\.museum)$/,"suffix":"western.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(westfalen\.museum)$/,"suffix":"westfalen.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(whaling\.museum)$/,"suffix":"whaling.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wildlife\.museum)$/,"suffix":"wildlife.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(williamsburg\.museum)$/,"suffix":"williamsburg.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(windmill\.museum)$/,"suffix":"windmill.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(workshop\.museum)$/,"suffix":"workshop.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--9dbhblg6di\.museum)$/,"suffix":"xn--9dbhblg6di.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--comunicaes-v6a2o\.museum)$/,"suffix":"xn--comunicaes-v6a2o.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--correios-e-telecomunicaes-ghc29a\.museum)$/,"suffix":"xn--correios-e-telecomunicaes-ghc29a.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--h1aegh\.museum)$/,"suffix":"xn--h1aegh.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lns-qla\.museum)$/,"suffix":"xn--lns-qla.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(york\.museum)$/,"suffix":"york.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yorkshire\.museum)$/,"suffix":"yorkshire.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yosemite\.museum)$/,"suffix":"yosemite.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(youth\.museum)$/,"suffix":"youth.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zoological\.museum)$/,"suffix":"zoological.museum"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zoology\.museum)$/,"suffix":"zoology.museum"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum)$/,"suffix":"museum"}],"mutual":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mutual)$/,"suffix":"mutual"}],"mutuelle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mutuelle)$/,"suffix":"mutuelle"}],"mv":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aero\.mv)$/,"suffix":"aero.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.mv)$/,"suffix":"biz.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mv)$/,"suffix":"com.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.mv)$/,"suffix":"coop.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mv)$/,"suffix":"edu.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mv)$/,"suffix":"gov.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.mv)$/,"suffix":"info.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.mv)$/,"suffix":"int.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.mv)$/,"suffix":"mil.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum\.mv)$/,"suffix":"museum.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.mv)$/,"suffix":"name.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mv)$/,"suffix":"net.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mv)$/,"suffix":"org.mv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.mv)$/,"suffix":"pro.mv"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mv)$/,"suffix":"mv"}],"mw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.mw)$/,"suffix":"ac.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.mw)$/,"suffix":"biz.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.mw)$/,"suffix":"co.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mw)$/,"suffix":"com.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.mw)$/,"suffix":"coop.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mw)$/,"suffix":"edu.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.mw)$/,"suffix":"gov.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.mw)$/,"suffix":"int.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum\.mw)$/,"suffix":"museum.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mw)$/,"suffix":"net.mw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mw)$/,"suffix":"org.mw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mw)$/,"suffix":"mw"}],"mx":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.mx)$/,"suffix":"blogspot.mx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.mx)$/,"suffix":"com.mx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.mx)$/,"suffix":"edu.mx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.mx)$/,"suffix":"gob.mx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.mx)$/,"suffix":"net.mx"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.mx)$/,"suffix":"org.mx"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mx)$/,"suffix":"mx"}],"my":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.my)$/,"suffix":"blogspot.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.my)$/,"suffix":"com.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.my)$/,"suffix":"edu.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.my)$/,"suffix":"gov.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.my)$/,"suffix":"mil.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.my)$/,"suffix":"name.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.my)$/,"suffix":"net.my"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.my)$/,"suffix":"org.my"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(my)$/,"suffix":"my"}],"mz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mz)$/,"suffix":"teledata.mz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.mz)$/,"suffix":"mz"}],"mzansimagic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(mzansimagic)$/,"suffix":"mzansimagic"}],"na":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ca\.na)$/,"suffix":"ca.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.na)$/,"suffix":"cc.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.na)$/,"suffix":"co.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.na)$/,"suffix":"com.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dr\.na)$/,"suffix":"dr.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.na)$/,"suffix":"in.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.na)$/,"suffix":"info.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi\.na)$/,"suffix":"mobi.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mx\.na)$/,"suffix":"mx.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.na)$/,"suffix":"name.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.na)$/,"suffix":"or.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.na)$/,"suffix":"org.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.na)$/,"suffix":"pro.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(school\.na)$/,"suffix":"school.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.na)$/,"suffix":"tv.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(us\.na)$/,"suffix":"us.na"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ws\.na)$/,"suffix":"ws.na"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(na)$/,"suffix":"na"}],"nab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nab)$/,"suffix":"nab"}],"nadex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nadex)$/,"suffix":"nadex"}],"nagoya":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nagoya)$/,"suffix":"nagoya"}],"name":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(forgot\.her\.name)$/,"suffix":"forgot.her.name"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(forgot\.his\.name)$/,"suffix":"forgot.his.name"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(name)$/,"suffix":"name"}],"naspers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(naspers)$/,"suffix":"naspers"}],"nationwide":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nationwide)$/,"suffix":"nationwide"}],"natura":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(natura)$/,"suffix":"natura"}],"navy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(navy)$/,"suffix":"navy"}],"nba":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nba)$/,"suffix":"nba"}],"nc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.nc)$/,"suffix":"asso.nc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nc)$/,"suffix":"nc"}],"ne":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne)$/,"suffix":"ne"}],"nec":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nec)$/,"suffix":"nec"}],"net":[{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(a\.prod\.fastly\.net)$/,"suffix":"a.prod.fastly.net"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(a\.ssl\.fastly\.net)$/,"suffix":"a.ssl.fastly.net"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(b\.ssl\.fastly\.net)$/,"suffix":"b.ssl.fastly.net"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(global\.prod\.fastly\.net)$/,"suffix":"global.prod.fastly.net"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(global\.ssl\.fastly\.net)$/,"suffix":"global.ssl.fastly.net"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(r\.cdn77\.net)$/,"suffix":"r.cdn77.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(at-band-camp\.net)$/,"suffix":"at-band-camp.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(azure-mobile\.net)$/,"suffix":"azure-mobile.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(azurewebsites\.net)$/,"suffix":"azurewebsites.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogdns\.net)$/,"suffix":"blogdns.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(broke-it\.net)$/,"suffix":"broke-it.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(buyshouses\.net)$/,"suffix":"buyshouses.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cdn77-ssl\.net)$/,"suffix":"cdn77-ssl.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloudapp\.net)$/,"suffix":"cloudapp.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloudfront\.net)$/,"suffix":"cloudfront.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cloudfunctions\.net)$/,"suffix":"cloudfunctions.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsalias\.net)$/,"suffix":"dnsalias.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsdojo\.net)$/,"suffix":"dnsdojo.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(does-it\.net)$/,"suffix":"does-it.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dontexist\.net)$/,"suffix":"dontexist.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dsmynas\.net)$/,"suffix":"dsmynas.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dynalias\.net)$/,"suffix":"dynalias.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dynathome\.net)$/,"suffix":"dynathome.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dynv6\.net)$/,"suffix":"dynv6.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(endofinternet\.net)$/,"suffix":"endofinternet.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(familyds\.net)$/,"suffix":"familyds.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-az\.net)$/,"suffix":"from-az.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-co\.net)$/,"suffix":"from-co.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-la\.net)$/,"suffix":"from-la.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-ny\.net)$/,"suffix":"from-ny.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gb\.net)$/,"suffix":"gb.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gets-it\.net)$/,"suffix":"gets-it.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ham-radio-op\.net)$/,"suffix":"ham-radio-op.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeftp\.net)$/,"suffix":"homeftp.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeip\.net)$/,"suffix":"homeip.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homelinux\.net)$/,"suffix":"homelinux.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeunix\.net)$/,"suffix":"homeunix.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hu\.net)$/,"suffix":"hu.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in-the-band\.net)$/,"suffix":"in-the-band.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.net)$/,"suffix":"in.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-chef\.net)$/,"suffix":"is-a-chef.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-geek\.net)$/,"suffix":"is-a-geek.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa-geek\.net)$/,"suffix":"isa-geek.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jp\.net)$/,"suffix":"jp.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kicks-ass\.net)$/,"suffix":"kicks-ass.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(office-on-the\.net)$/,"suffix":"office-on-the.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(podzone\.net)$/,"suffix":"podzone.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rackmaze\.net)$/,"suffix":"rackmaze.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(scrapper-site\.net)$/,"suffix":"scrapper-site.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(se\.net)$/,"suffix":"se.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selfip\.net)$/,"suffix":"selfip.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sells-it\.net)$/,"suffix":"sells-it.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(servebbs\.net)$/,"suffix":"servebbs.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(serveftp\.net)$/,"suffix":"serveftp.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(thruhere\.net)$/,"suffix":"thruhere.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uk\.net)$/,"suffix":"uk.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(webhop\.net)$/,"suffix":"webhop.net"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(za\.net)$/,"suffix":"za.net"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(net)$/,"suffix":"net"}],"netbank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(netbank)$/,"suffix":"netbank"}],"netflix":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(netflix)$/,"suffix":"netflix"}],"network":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(network)$/,"suffix":"network"}],"neustar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(neustar)$/,"suffix":"neustar"}],"new":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(new)$/,"suffix":"new"}],"newholland":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(newholland)$/,"suffix":"newholland"}],"news":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(news)$/,"suffix":"news"}],"next":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(next)$/,"suffix":"next"}],"nextdirect":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nextdirect)$/,"suffix":"nextdirect"}],"nexus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nexus)$/,"suffix":"nexus"}],"nf":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arts\.nf)$/,"suffix":"arts.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.nf)$/,"suffix":"com.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.nf)$/,"suffix":"firm.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.nf)$/,"suffix":"info.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.nf)$/,"suffix":"net.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(other\.nf)$/,"suffix":"other.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(per\.nf)$/,"suffix":"per.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rec\.nf)$/,"suffix":"rec.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(store\.nf)$/,"suffix":"store.nf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.nf)$/,"suffix":"web.nf"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nf)$/,"suffix":"nf"}],"nfl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nfl)$/,"suffix":"nfl"}],"ng":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.ng)$/,"suffix":"blogspot.com.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ng)$/,"suffix":"com.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ng)$/,"suffix":"edu.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ng)$/,"suffix":"gov.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(i\.ng)$/,"suffix":"i.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ng)$/,"suffix":"mil.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi\.ng)$/,"suffix":"mobi.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.ng)$/,"suffix":"name.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ng)$/,"suffix":"net.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ng)$/,"suffix":"org.ng"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.ng)$/,"suffix":"sch.ng"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ng)$/,"suffix":"ng"}],"ngo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ngo)$/,"suffix":"ngo"}],"nhk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nhk)$/,"suffix":"nhk"}],"ni":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ni)$/,"suffix":"ac.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.ni)$/,"suffix":"biz.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ni)$/,"suffix":"co.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ni)$/,"suffix":"com.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ni)$/,"suffix":"edu.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.ni)$/,"suffix":"gob.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.ni)$/,"suffix":"in.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ni)$/,"suffix":"info.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.ni)$/,"suffix":"int.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ni)$/,"suffix":"mil.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ni)$/,"suffix":"net.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.ni)$/,"suffix":"nom.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ni)$/,"suffix":"org.ni"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.ni)$/,"suffix":"web.ni"}],"nico":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nico)$/,"suffix":"nico"}],"nike":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nike)$/,"suffix":"nike"}],"nikon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nikon)$/,"suffix":"nikon"}],"ninja":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ninja)$/,"suffix":"ninja"}],"nissan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nissan)$/,"suffix":"nissan"}],"nissay":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nissay)$/,"suffix":"nissay"}],"nl":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.nl)$/,"suffix":"blogspot.nl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bv\.nl)$/,"suffix":"bv.nl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.nl)$/,"suffix":"co.nl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nl)$/,"suffix":"nl"}],"no":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bo\.nordland\.no)$/,"suffix":"bo.nordland.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bo\.telemark\.no)$/,"suffix":"bo.telemark.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.aa\.no)$/,"suffix":"gs.aa.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.ah\.no)$/,"suffix":"gs.ah.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.bu\.no)$/,"suffix":"gs.bu.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.fm\.no)$/,"suffix":"gs.fm.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.hl\.no)$/,"suffix":"gs.hl.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.hm\.no)$/,"suffix":"gs.hm.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.jan-mayen\.no)$/,"suffix":"gs.jan-mayen.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.mr\.no)$/,"suffix":"gs.mr.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.nl\.no)$/,"suffix":"gs.nl.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.nt\.no)$/,"suffix":"gs.nt.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.of\.no)$/,"suffix":"gs.of.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.ol\.no)$/,"suffix":"gs.ol.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.oslo\.no)$/,"suffix":"gs.oslo.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.rl\.no)$/,"suffix":"gs.rl.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.sf\.no)$/,"suffix":"gs.sf.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.st\.no)$/,"suffix":"gs.st.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.svalbard\.no)$/,"suffix":"gs.svalbard.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.tm\.no)$/,"suffix":"gs.tm.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.tr\.no)$/,"suffix":"gs.tr.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.va\.no)$/,"suffix":"gs.va.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gs\.vf\.no)$/,"suffix":"gs.vf.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(heroy\.more-og-romsdal\.no)$/,"suffix":"heroy.more-og-romsdal.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(heroy\.nordland\.no)$/,"suffix":"heroy.nordland.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nes\.akershus\.no)$/,"suffix":"nes.akershus.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nes\.buskerud\.no)$/,"suffix":"nes.buskerud.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(os\.hedmark\.no)$/,"suffix":"os.hedmark.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(os\.hordaland\.no)$/,"suffix":"os.hordaland.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sande\.more-og-romsdal\.no)$/,"suffix":"sande.more-og-romsdal.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sande\.vestfold\.no)$/,"suffix":"sande.vestfold.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sande\.xn--mre-og-romsdal-qqb\.no)$/,"suffix":"sande.xn--mre-og-romsdal-qqb.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(valer\.hedmark\.no)$/,"suffix":"valer.hedmark.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(valer\.ostfold\.no)$/,"suffix":"valer.ostfold.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--b-5ga\.nordland\.no)$/,"suffix":"xn--b-5ga.nordland.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--b-5ga\.telemark\.no)$/,"suffix":"xn--b-5ga.telemark.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hery-ira\.nordland\.no)$/,"suffix":"xn--hery-ira.nordland.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hery-ira\.xn--mre-og-romsdal-qqb\.no)$/,"suffix":"xn--hery-ira.xn--mre-og-romsdal-qqb.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vler-qoa\.hedmark\.no)$/,"suffix":"xn--vler-qoa.hedmark.no"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vler-qoa\.xn--stfold-9xa\.no)$/,"suffix":"xn--vler-qoa.xn--stfold-9xa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aa\.no)$/,"suffix":"aa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aarborte\.no)$/,"suffix":"aarborte.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aejrie\.no)$/,"suffix":"aejrie.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(afjord\.no)$/,"suffix":"afjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agdenes\.no)$/,"suffix":"agdenes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ah\.no)$/,"suffix":"ah.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aknoluokta\.no)$/,"suffix":"aknoluokta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(akrehamn\.no)$/,"suffix":"akrehamn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(al\.no)$/,"suffix":"al.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alaheadju\.no)$/,"suffix":"alaheadju.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alesund\.no)$/,"suffix":"alesund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(algard\.no)$/,"suffix":"algard.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alstahaug\.no)$/,"suffix":"alstahaug.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alta\.no)$/,"suffix":"alta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alvdal\.no)$/,"suffix":"alvdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amli\.no)$/,"suffix":"amli.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amot\.no)$/,"suffix":"amot.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andasuolo\.no)$/,"suffix":"andasuolo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andebu\.no)$/,"suffix":"andebu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(andoy\.no)$/,"suffix":"andoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ardal\.no)$/,"suffix":"ardal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aremark\.no)$/,"suffix":"aremark.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arendal\.no)$/,"suffix":"arendal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arna\.no)$/,"suffix":"arna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aseral\.no)$/,"suffix":"aseral.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asker\.no)$/,"suffix":"asker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(askim\.no)$/,"suffix":"askim.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(askoy\.no)$/,"suffix":"askoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(askvoll\.no)$/,"suffix":"askvoll.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asnes\.no)$/,"suffix":"asnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(audnedaln\.no)$/,"suffix":"audnedaln.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aukra\.no)$/,"suffix":"aukra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aure\.no)$/,"suffix":"aure.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aurland\.no)$/,"suffix":"aurland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aurskog-holand\.no)$/,"suffix":"aurskog-holand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(austevoll\.no)$/,"suffix":"austevoll.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(austrheim\.no)$/,"suffix":"austrheim.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(averoy\.no)$/,"suffix":"averoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(badaddja\.no)$/,"suffix":"badaddja.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bahcavuotna\.no)$/,"suffix":"bahcavuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bahccavuotna\.no)$/,"suffix":"bahccavuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baidar\.no)$/,"suffix":"baidar.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bajddar\.no)$/,"suffix":"bajddar.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(balat\.no)$/,"suffix":"balat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(balestrand\.no)$/,"suffix":"balestrand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ballangen\.no)$/,"suffix":"ballangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(balsfjord\.no)$/,"suffix":"balsfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bamble\.no)$/,"suffix":"bamble.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bardu\.no)$/,"suffix":"bardu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(barum\.no)$/,"suffix":"barum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(batsfjord\.no)$/,"suffix":"batsfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bearalvahki\.no)$/,"suffix":"bearalvahki.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(beardu\.no)$/,"suffix":"beardu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(beiarn\.no)$/,"suffix":"beiarn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(berg\.no)$/,"suffix":"berg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bergen\.no)$/,"suffix":"bergen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(berlevag\.no)$/,"suffix":"berlevag.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bievat\.no)$/,"suffix":"bievat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bindal\.no)$/,"suffix":"bindal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(birkenes\.no)$/,"suffix":"birkenes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bjarkoy\.no)$/,"suffix":"bjarkoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bjerkreim\.no)$/,"suffix":"bjerkreim.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bjugn\.no)$/,"suffix":"bjugn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.no)$/,"suffix":"blogspot.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bodo\.no)$/,"suffix":"bodo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bokn\.no)$/,"suffix":"bokn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bomlo\.no)$/,"suffix":"bomlo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bremanger\.no)$/,"suffix":"bremanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bronnoy\.no)$/,"suffix":"bronnoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bronnoysund\.no)$/,"suffix":"bronnoysund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brumunddal\.no)$/,"suffix":"brumunddal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bryne\.no)$/,"suffix":"bryne.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bu\.no)$/,"suffix":"bu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(budejju\.no)$/,"suffix":"budejju.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bygland\.no)$/,"suffix":"bygland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bykle\.no)$/,"suffix":"bykle.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cahcesuolo\.no)$/,"suffix":"cahcesuolo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.no)$/,"suffix":"co.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(davvenjarga\.no)$/,"suffix":"davvenjarga.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(davvesiida\.no)$/,"suffix":"davvesiida.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(deatnu\.no)$/,"suffix":"deatnu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dep\.no)$/,"suffix":"dep.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dielddanuorri\.no)$/,"suffix":"dielddanuorri.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(divtasvuodna\.no)$/,"suffix":"divtasvuodna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(divttasvuotna\.no)$/,"suffix":"divttasvuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(donna\.no)$/,"suffix":"donna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dovre\.no)$/,"suffix":"dovre.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(drammen\.no)$/,"suffix":"drammen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(drangedal\.no)$/,"suffix":"drangedal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(drobak\.no)$/,"suffix":"drobak.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyroy\.no)$/,"suffix":"dyroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(egersund\.no)$/,"suffix":"egersund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eid\.no)$/,"suffix":"eid.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eidfjord\.no)$/,"suffix":"eidfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eidsberg\.no)$/,"suffix":"eidsberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eidskog\.no)$/,"suffix":"eidskog.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eidsvoll\.no)$/,"suffix":"eidsvoll.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eigersund\.no)$/,"suffix":"eigersund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elverum\.no)$/,"suffix":"elverum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(enebakk\.no)$/,"suffix":"enebakk.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(engerdal\.no)$/,"suffix":"engerdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(etne\.no)$/,"suffix":"etne.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(etnedal\.no)$/,"suffix":"etnedal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(evenassi\.no)$/,"suffix":"evenassi.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(evenes\.no)$/,"suffix":"evenes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(evje-og-hornnes\.no)$/,"suffix":"evje-og-hornnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(farsund\.no)$/,"suffix":"farsund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fauske\.no)$/,"suffix":"fauske.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fedje\.no)$/,"suffix":"fedje.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fet\.no)$/,"suffix":"fet.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fetsund\.no)$/,"suffix":"fetsund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fhs\.no)$/,"suffix":"fhs.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(finnoy\.no)$/,"suffix":"finnoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fitjar\.no)$/,"suffix":"fitjar.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fjaler\.no)$/,"suffix":"fjaler.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fjell\.no)$/,"suffix":"fjell.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fla\.no)$/,"suffix":"fla.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flakstad\.no)$/,"suffix":"flakstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flatanger\.no)$/,"suffix":"flatanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flekkefjord\.no)$/,"suffix":"flekkefjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flesberg\.no)$/,"suffix":"flesberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(flora\.no)$/,"suffix":"flora.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(floro\.no)$/,"suffix":"floro.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fm\.no)$/,"suffix":"fm.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(folkebibl\.no)$/,"suffix":"folkebibl.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(folldal\.no)$/,"suffix":"folldal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(forde\.no)$/,"suffix":"forde.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(forsand\.no)$/,"suffix":"forsand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fosnes\.no)$/,"suffix":"fosnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frana\.no)$/,"suffix":"frana.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fredrikstad\.no)$/,"suffix":"fredrikstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frei\.no)$/,"suffix":"frei.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frogn\.no)$/,"suffix":"frogn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(froland\.no)$/,"suffix":"froland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(frosta\.no)$/,"suffix":"frosta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(froya\.no)$/,"suffix":"froya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuoisku\.no)$/,"suffix":"fuoisku.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fuossko\.no)$/,"suffix":"fuossko.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fusa\.no)$/,"suffix":"fusa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fylkesbibl\.no)$/,"suffix":"fylkesbibl.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fyresdal\.no)$/,"suffix":"fyresdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gaivuotna\.no)$/,"suffix":"gaivuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(galsa\.no)$/,"suffix":"galsa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gamvik\.no)$/,"suffix":"gamvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gangaviika\.no)$/,"suffix":"gangaviika.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gaular\.no)$/,"suffix":"gaular.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gausdal\.no)$/,"suffix":"gausdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(giehtavuoatna\.no)$/,"suffix":"giehtavuoatna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gildeskal\.no)$/,"suffix":"gildeskal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(giske\.no)$/,"suffix":"giske.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gjemnes\.no)$/,"suffix":"gjemnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gjerdrum\.no)$/,"suffix":"gjerdrum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gjerstad\.no)$/,"suffix":"gjerstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gjesdal\.no)$/,"suffix":"gjesdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gjovik\.no)$/,"suffix":"gjovik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gloppen\.no)$/,"suffix":"gloppen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gol\.no)$/,"suffix":"gol.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gran\.no)$/,"suffix":"gran.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grane\.no)$/,"suffix":"grane.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(granvin\.no)$/,"suffix":"granvin.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gratangen\.no)$/,"suffix":"gratangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grimstad\.no)$/,"suffix":"grimstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grong\.no)$/,"suffix":"grong.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grue\.no)$/,"suffix":"grue.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gulen\.no)$/,"suffix":"gulen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(guovdageaidnu\.no)$/,"suffix":"guovdageaidnu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ha\.no)$/,"suffix":"ha.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(habmer\.no)$/,"suffix":"habmer.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hadsel\.no)$/,"suffix":"hadsel.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hagebostad\.no)$/,"suffix":"hagebostad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(halden\.no)$/,"suffix":"halden.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(halsa\.no)$/,"suffix":"halsa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamar\.no)$/,"suffix":"hamar.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hamaroy\.no)$/,"suffix":"hamaroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hammarfeasta\.no)$/,"suffix":"hammarfeasta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hammerfest\.no)$/,"suffix":"hammerfest.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hapmir\.no)$/,"suffix":"hapmir.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(haram\.no)$/,"suffix":"haram.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hareid\.no)$/,"suffix":"hareid.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(harstad\.no)$/,"suffix":"harstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hasvik\.no)$/,"suffix":"hasvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hattfjelldal\.no)$/,"suffix":"hattfjelldal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(haugesund\.no)$/,"suffix":"haugesund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hemne\.no)$/,"suffix":"hemne.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hemnes\.no)$/,"suffix":"hemnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hemsedal\.no)$/,"suffix":"hemsedal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(herad\.no)$/,"suffix":"herad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hitra\.no)$/,"suffix":"hitra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hjartdal\.no)$/,"suffix":"hjartdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hjelmeland\.no)$/,"suffix":"hjelmeland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hl\.no)$/,"suffix":"hl.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hm\.no)$/,"suffix":"hm.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hobol\.no)$/,"suffix":"hobol.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hof\.no)$/,"suffix":"hof.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hokksund\.no)$/,"suffix":"hokksund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hol\.no)$/,"suffix":"hol.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hole\.no)$/,"suffix":"hole.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(holmestrand\.no)$/,"suffix":"holmestrand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(holtalen\.no)$/,"suffix":"holtalen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(honefoss\.no)$/,"suffix":"honefoss.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hornindal\.no)$/,"suffix":"hornindal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(horten\.no)$/,"suffix":"horten.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hoyanger\.no)$/,"suffix":"hoyanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hoylandet\.no)$/,"suffix":"hoylandet.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hurdal\.no)$/,"suffix":"hurdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hurum\.no)$/,"suffix":"hurum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hvaler\.no)$/,"suffix":"hvaler.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hyllestad\.no)$/,"suffix":"hyllestad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ibestad\.no)$/,"suffix":"ibestad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(idrett\.no)$/,"suffix":"idrett.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(inderoy\.no)$/,"suffix":"inderoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iveland\.no)$/,"suffix":"iveland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ivgu\.no)$/,"suffix":"ivgu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jan-mayen\.no)$/,"suffix":"jan-mayen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jessheim\.no)$/,"suffix":"jessheim.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jevnaker\.no)$/,"suffix":"jevnaker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jolster\.no)$/,"suffix":"jolster.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jondal\.no)$/,"suffix":"jondal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jorpeland\.no)$/,"suffix":"jorpeland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kafjord\.no)$/,"suffix":"kafjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karasjohka\.no)$/,"suffix":"karasjohka.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karasjok\.no)$/,"suffix":"karasjok.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karlsoy\.no)$/,"suffix":"karlsoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karmoy\.no)$/,"suffix":"karmoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kautokeino\.no)$/,"suffix":"kautokeino.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kirkenes\.no)$/,"suffix":"kirkenes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(klabu\.no)$/,"suffix":"klabu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(klepp\.no)$/,"suffix":"klepp.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kommune\.no)$/,"suffix":"kommune.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kongsberg\.no)$/,"suffix":"kongsberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kongsvinger\.no)$/,"suffix":"kongsvinger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kopervik\.no)$/,"suffix":"kopervik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kraanghke\.no)$/,"suffix":"kraanghke.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kragero\.no)$/,"suffix":"kragero.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kristiansand\.no)$/,"suffix":"kristiansand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kristiansund\.no)$/,"suffix":"kristiansund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krodsherad\.no)$/,"suffix":"krodsherad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krokstadelva\.no)$/,"suffix":"krokstadelva.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvafjord\.no)$/,"suffix":"kvafjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvalsund\.no)$/,"suffix":"kvalsund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvam\.no)$/,"suffix":"kvam.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvanangen\.no)$/,"suffix":"kvanangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvinesdal\.no)$/,"suffix":"kvinesdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvinnherad\.no)$/,"suffix":"kvinnherad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kviteseid\.no)$/,"suffix":"kviteseid.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kvitsoy\.no)$/,"suffix":"kvitsoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(laakesvuemie\.no)$/,"suffix":"laakesvuemie.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lahppi\.no)$/,"suffix":"lahppi.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(langevag\.no)$/,"suffix":"langevag.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lardal\.no)$/,"suffix":"lardal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(larvik\.no)$/,"suffix":"larvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lavagis\.no)$/,"suffix":"lavagis.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lavangen\.no)$/,"suffix":"lavangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leangaviika\.no)$/,"suffix":"leangaviika.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lebesby\.no)$/,"suffix":"lebesby.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leikanger\.no)$/,"suffix":"leikanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leirfjord\.no)$/,"suffix":"leirfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leirvik\.no)$/,"suffix":"leirvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leka\.no)$/,"suffix":"leka.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(leksvik\.no)$/,"suffix":"leksvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lenvik\.no)$/,"suffix":"lenvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lerdal\.no)$/,"suffix":"lerdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lesja\.no)$/,"suffix":"lesja.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(levanger\.no)$/,"suffix":"levanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lier\.no)$/,"suffix":"lier.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lierne\.no)$/,"suffix":"lierne.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lillehammer\.no)$/,"suffix":"lillehammer.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lillesand\.no)$/,"suffix":"lillesand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lindas\.no)$/,"suffix":"lindas.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lindesnes\.no)$/,"suffix":"lindesnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(loabat\.no)$/,"suffix":"loabat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lodingen\.no)$/,"suffix":"lodingen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lom\.no)$/,"suffix":"lom.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(loppa\.no)$/,"suffix":"loppa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lorenskog\.no)$/,"suffix":"lorenskog.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(loten\.no)$/,"suffix":"loten.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lund\.no)$/,"suffix":"lund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lunner\.no)$/,"suffix":"lunner.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(luroy\.no)$/,"suffix":"luroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(luster\.no)$/,"suffix":"luster.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lyngdal\.no)$/,"suffix":"lyngdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lyngen\.no)$/,"suffix":"lyngen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(malatvuopmi\.no)$/,"suffix":"malatvuopmi.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(malselv\.no)$/,"suffix":"malselv.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(malvik\.no)$/,"suffix":"malvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mandal\.no)$/,"suffix":"mandal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marker\.no)$/,"suffix":"marker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marnardal\.no)$/,"suffix":"marnardal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(masfjorden\.no)$/,"suffix":"masfjorden.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(masoy\.no)$/,"suffix":"masoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(matta-varjjat\.no)$/,"suffix":"matta-varjjat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(meland\.no)$/,"suffix":"meland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(meldal\.no)$/,"suffix":"meldal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(melhus\.no)$/,"suffix":"melhus.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(meloy\.no)$/,"suffix":"meloy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(meraker\.no)$/,"suffix":"meraker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(midsund\.no)$/,"suffix":"midsund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(midtre-gauldal\.no)$/,"suffix":"midtre-gauldal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.no)$/,"suffix":"mil.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mjondalen\.no)$/,"suffix":"mjondalen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mo-i-rana\.no)$/,"suffix":"mo-i-rana.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(moareke\.no)$/,"suffix":"moareke.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(modalen\.no)$/,"suffix":"modalen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(modum\.no)$/,"suffix":"modum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(molde\.no)$/,"suffix":"molde.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mosjoen\.no)$/,"suffix":"mosjoen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(moskenes\.no)$/,"suffix":"moskenes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(moss\.no)$/,"suffix":"moss.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mosvik\.no)$/,"suffix":"mosvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mr\.no)$/,"suffix":"mr.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(muosat\.no)$/,"suffix":"muosat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum\.no)$/,"suffix":"museum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naamesjevuemie\.no)$/,"suffix":"naamesjevuemie.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(namdalseid\.no)$/,"suffix":"namdalseid.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(namsos\.no)$/,"suffix":"namsos.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(namsskogan\.no)$/,"suffix":"namsskogan.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nannestad\.no)$/,"suffix":"nannestad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naroy\.no)$/,"suffix":"naroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(narviika\.no)$/,"suffix":"narviika.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(narvik\.no)$/,"suffix":"narvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naustdal\.no)$/,"suffix":"naustdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(navuotna\.no)$/,"suffix":"navuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nedre-eiker\.no)$/,"suffix":"nedre-eiker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nesna\.no)$/,"suffix":"nesna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nesodden\.no)$/,"suffix":"nesodden.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nesoddtangen\.no)$/,"suffix":"nesoddtangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nesseby\.no)$/,"suffix":"nesseby.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nesset\.no)$/,"suffix":"nesset.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nissedal\.no)$/,"suffix":"nissedal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nittedal\.no)$/,"suffix":"nittedal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nl\.no)$/,"suffix":"nl.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nord-aurdal\.no)$/,"suffix":"nord-aurdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nord-fron\.no)$/,"suffix":"nord-fron.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nord-odal\.no)$/,"suffix":"nord-odal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(norddal\.no)$/,"suffix":"norddal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nordkapp\.no)$/,"suffix":"nordkapp.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nordre-land\.no)$/,"suffix":"nordre-land.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nordreisa\.no)$/,"suffix":"nordreisa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nore-og-uvdal\.no)$/,"suffix":"nore-og-uvdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(notodden\.no)$/,"suffix":"notodden.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(notteroy\.no)$/,"suffix":"notteroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nt\.no)$/,"suffix":"nt.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(odda\.no)$/,"suffix":"odda.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(of\.no)$/,"suffix":"of.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oksnes\.no)$/,"suffix":"oksnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ol\.no)$/,"suffix":"ol.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(omasvuotna\.no)$/,"suffix":"omasvuotna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oppdal\.no)$/,"suffix":"oppdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oppegard\.no)$/,"suffix":"oppegard.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orkanger\.no)$/,"suffix":"orkanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orkdal\.no)$/,"suffix":"orkdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orland\.no)$/,"suffix":"orland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orskog\.no)$/,"suffix":"orskog.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orsta\.no)$/,"suffix":"orsta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(osen\.no)$/,"suffix":"osen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oslo\.no)$/,"suffix":"oslo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(osoyro\.no)$/,"suffix":"osoyro.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(osteroy\.no)$/,"suffix":"osteroy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ostre-toten\.no)$/,"suffix":"ostre-toten.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(overhalla\.no)$/,"suffix":"overhalla.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ovre-eiker\.no)$/,"suffix":"ovre-eiker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oyer\.no)$/,"suffix":"oyer.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oygarden\.no)$/,"suffix":"oygarden.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oystre-slidre\.no)$/,"suffix":"oystre-slidre.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(porsanger\.no)$/,"suffix":"porsanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(porsangu\.no)$/,"suffix":"porsangu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(porsgrunn\.no)$/,"suffix":"porsgrunn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(priv\.no)$/,"suffix":"priv.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rade\.no)$/,"suffix":"rade.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(radoy\.no)$/,"suffix":"radoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rahkkeravju\.no)$/,"suffix":"rahkkeravju.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(raholt\.no)$/,"suffix":"raholt.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(raisa\.no)$/,"suffix":"raisa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rakkestad\.no)$/,"suffix":"rakkestad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ralingen\.no)$/,"suffix":"ralingen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rana\.no)$/,"suffix":"rana.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(randaberg\.no)$/,"suffix":"randaberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rauma\.no)$/,"suffix":"rauma.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rendalen\.no)$/,"suffix":"rendalen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rennebu\.no)$/,"suffix":"rennebu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rennesoy\.no)$/,"suffix":"rennesoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rindal\.no)$/,"suffix":"rindal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ringebu\.no)$/,"suffix":"ringebu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ringerike\.no)$/,"suffix":"ringerike.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ringsaker\.no)$/,"suffix":"ringsaker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(risor\.no)$/,"suffix":"risor.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rissa\.no)$/,"suffix":"rissa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rl\.no)$/,"suffix":"rl.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(roan\.no)$/,"suffix":"roan.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rodoy\.no)$/,"suffix":"rodoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rollag\.no)$/,"suffix":"rollag.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(romsa\.no)$/,"suffix":"romsa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(romskog\.no)$/,"suffix":"romskog.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(roros\.no)$/,"suffix":"roros.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rost\.no)$/,"suffix":"rost.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(royken\.no)$/,"suffix":"royken.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(royrvik\.no)$/,"suffix":"royrvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ruovat\.no)$/,"suffix":"ruovat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rygge\.no)$/,"suffix":"rygge.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salangen\.no)$/,"suffix":"salangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(salat\.no)$/,"suffix":"salat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saltdal\.no)$/,"suffix":"saltdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(samnanger\.no)$/,"suffix":"samnanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandefjord\.no)$/,"suffix":"sandefjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandnes\.no)$/,"suffix":"sandnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandnessjoen\.no)$/,"suffix":"sandnessjoen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandoy\.no)$/,"suffix":"sandoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sarpsborg\.no)$/,"suffix":"sarpsborg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sauda\.no)$/,"suffix":"sauda.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sauherad\.no)$/,"suffix":"sauherad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sel\.no)$/,"suffix":"sel.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selbu\.no)$/,"suffix":"selbu.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selje\.no)$/,"suffix":"selje.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(seljord\.no)$/,"suffix":"seljord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sf\.no)$/,"suffix":"sf.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(siellak\.no)$/,"suffix":"siellak.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sigdal\.no)$/,"suffix":"sigdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(siljan\.no)$/,"suffix":"siljan.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sirdal\.no)$/,"suffix":"sirdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skanit\.no)$/,"suffix":"skanit.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skanland\.no)$/,"suffix":"skanland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skaun\.no)$/,"suffix":"skaun.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skedsmo\.no)$/,"suffix":"skedsmo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skedsmokorset\.no)$/,"suffix":"skedsmokorset.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ski\.no)$/,"suffix":"ski.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skien\.no)$/,"suffix":"skien.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skierva\.no)$/,"suffix":"skierva.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skiptvet\.no)$/,"suffix":"skiptvet.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skjak\.no)$/,"suffix":"skjak.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skjervoy\.no)$/,"suffix":"skjervoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skodje\.no)$/,"suffix":"skodje.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(slattum\.no)$/,"suffix":"slattum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(smola\.no)$/,"suffix":"smola.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(snaase\.no)$/,"suffix":"snaase.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(snasa\.no)$/,"suffix":"snasa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(snillfjord\.no)$/,"suffix":"snillfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(snoasa\.no)$/,"suffix":"snoasa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sogndal\.no)$/,"suffix":"sogndal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sogne\.no)$/,"suffix":"sogne.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sokndal\.no)$/,"suffix":"sokndal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sola\.no)$/,"suffix":"sola.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(solund\.no)$/,"suffix":"solund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(somna\.no)$/,"suffix":"somna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sondre-land\.no)$/,"suffix":"sondre-land.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(songdalen\.no)$/,"suffix":"songdalen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sor-aurdal\.no)$/,"suffix":"sor-aurdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sor-fron\.no)$/,"suffix":"sor-fron.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sor-odal\.no)$/,"suffix":"sor-odal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sor-varanger\.no)$/,"suffix":"sor-varanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sorfold\.no)$/,"suffix":"sorfold.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sorreisa\.no)$/,"suffix":"sorreisa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sortland\.no)$/,"suffix":"sortland.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sorum\.no)$/,"suffix":"sorum.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(spjelkavik\.no)$/,"suffix":"spjelkavik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(spydeberg\.no)$/,"suffix":"spydeberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(st\.no)$/,"suffix":"st.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stange\.no)$/,"suffix":"stange.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stat\.no)$/,"suffix":"stat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stathelle\.no)$/,"suffix":"stathelle.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stavanger\.no)$/,"suffix":"stavanger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stavern\.no)$/,"suffix":"stavern.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(steigen\.no)$/,"suffix":"steigen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(steinkjer\.no)$/,"suffix":"steinkjer.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stjordal\.no)$/,"suffix":"stjordal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stjordalshalsen\.no)$/,"suffix":"stjordalshalsen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stokke\.no)$/,"suffix":"stokke.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stor-elvdal\.no)$/,"suffix":"stor-elvdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stord\.no)$/,"suffix":"stord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stordal\.no)$/,"suffix":"stordal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(storfjord\.no)$/,"suffix":"storfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(strand\.no)$/,"suffix":"strand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stranda\.no)$/,"suffix":"stranda.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stryn\.no)$/,"suffix":"stryn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sula\.no)$/,"suffix":"sula.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(suldal\.no)$/,"suffix":"suldal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sund\.no)$/,"suffix":"sund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sunndal\.no)$/,"suffix":"sunndal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(surnadal\.no)$/,"suffix":"surnadal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(svalbard\.no)$/,"suffix":"svalbard.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sveio\.no)$/,"suffix":"sveio.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(svelvik\.no)$/,"suffix":"svelvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sykkylven\.no)$/,"suffix":"sykkylven.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tana\.no)$/,"suffix":"tana.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tananger\.no)$/,"suffix":"tananger.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(time\.no)$/,"suffix":"time.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tingvoll\.no)$/,"suffix":"tingvoll.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tinn\.no)$/,"suffix":"tinn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tjeldsund\.no)$/,"suffix":"tjeldsund.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tjome\.no)$/,"suffix":"tjome.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.no)$/,"suffix":"tm.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokke\.no)$/,"suffix":"tokke.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tolga\.no)$/,"suffix":"tolga.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tonsberg\.no)$/,"suffix":"tonsberg.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(torsken\.no)$/,"suffix":"torsken.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tr\.no)$/,"suffix":"tr.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trana\.no)$/,"suffix":"trana.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tranby\.no)$/,"suffix":"tranby.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tranoy\.no)$/,"suffix":"tranoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(troandin\.no)$/,"suffix":"troandin.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trogstad\.no)$/,"suffix":"trogstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tromsa\.no)$/,"suffix":"tromsa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tromso\.no)$/,"suffix":"tromso.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trondheim\.no)$/,"suffix":"trondheim.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(trysil\.no)$/,"suffix":"trysil.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tvedestrand\.no)$/,"suffix":"tvedestrand.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tydal\.no)$/,"suffix":"tydal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tynset\.no)$/,"suffix":"tynset.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tysfjord\.no)$/,"suffix":"tysfjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tysnes\.no)$/,"suffix":"tysnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tysvar\.no)$/,"suffix":"tysvar.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ullensaker\.no)$/,"suffix":"ullensaker.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ullensvang\.no)$/,"suffix":"ullensvang.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ulvik\.no)$/,"suffix":"ulvik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(unjarga\.no)$/,"suffix":"unjarga.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(utsira\.no)$/,"suffix":"utsira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(va\.no)$/,"suffix":"va.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vaapste\.no)$/,"suffix":"vaapste.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vadso\.no)$/,"suffix":"vadso.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vaga\.no)$/,"suffix":"vaga.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vagan\.no)$/,"suffix":"vagan.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vagsoy\.no)$/,"suffix":"vagsoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vaksdal\.no)$/,"suffix":"vaksdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(valle\.no)$/,"suffix":"valle.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vang\.no)$/,"suffix":"vang.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vanylven\.no)$/,"suffix":"vanylven.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vardo\.no)$/,"suffix":"vardo.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(varggat\.no)$/,"suffix":"varggat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(varoy\.no)$/,"suffix":"varoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vefsn\.no)$/,"suffix":"vefsn.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vega\.no)$/,"suffix":"vega.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vegarshei\.no)$/,"suffix":"vegarshei.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vennesla\.no)$/,"suffix":"vennesla.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(verdal\.no)$/,"suffix":"verdal.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(verran\.no)$/,"suffix":"verran.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vestby\.no)$/,"suffix":"vestby.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vestnes\.no)$/,"suffix":"vestnes.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vestre-slidre\.no)$/,"suffix":"vestre-slidre.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vestre-toten\.no)$/,"suffix":"vestre-toten.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vestvagoy\.no)$/,"suffix":"vestvagoy.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vevelstad\.no)$/,"suffix":"vevelstad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vf\.no)$/,"suffix":"vf.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vgs\.no)$/,"suffix":"vgs.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vik\.no)$/,"suffix":"vik.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vikna\.no)$/,"suffix":"vikna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vindafjord\.no)$/,"suffix":"vindafjord.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(voagat\.no)$/,"suffix":"voagat.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(volda\.no)$/,"suffix":"volda.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(voss\.no)$/,"suffix":"voss.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vossevangen\.no)$/,"suffix":"vossevangen.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--andy-ira\.no)$/,"suffix":"xn--andy-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--asky-ira\.no)$/,"suffix":"xn--asky-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--aurskog-hland-jnb\.no)$/,"suffix":"xn--aurskog-hland-jnb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--avery-yua\.no)$/,"suffix":"xn--avery-yua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bdddj-mrabd\.no)$/,"suffix":"xn--bdddj-mrabd.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bearalvhki-y4a\.no)$/,"suffix":"xn--bearalvhki-y4a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--berlevg-jxa\.no)$/,"suffix":"xn--berlevg-jxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bhcavuotna-s4a\.no)$/,"suffix":"xn--bhcavuotna-s4a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bhccavuotna-k7a\.no)$/,"suffix":"xn--bhccavuotna-k7a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bidr-5nac\.no)$/,"suffix":"xn--bidr-5nac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bievt-0qa\.no)$/,"suffix":"xn--bievt-0qa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bjarky-fya\.no)$/,"suffix":"xn--bjarky-fya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bjddar-pta\.no)$/,"suffix":"xn--bjddar-pta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--blt-elab\.no)$/,"suffix":"xn--blt-elab.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bmlo-gra\.no)$/,"suffix":"xn--bmlo-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bod-2na\.no)$/,"suffix":"xn--bod-2na.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--brnny-wuac\.no)$/,"suffix":"xn--brnny-wuac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--brnnysund-m8ac\.no)$/,"suffix":"xn--brnnysund-m8ac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--brum-voa\.no)$/,"suffix":"xn--brum-voa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--btsfjord-9za\.no)$/,"suffix":"xn--btsfjord-9za.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--davvenjrga-y4a\.no)$/,"suffix":"xn--davvenjrga-y4a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--dnna-gra\.no)$/,"suffix":"xn--dnna-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--drbak-wua\.no)$/,"suffix":"xn--drbak-wua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--dyry-ira\.no)$/,"suffix":"xn--dyry-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--eveni-0qa01ga\.no)$/,"suffix":"xn--eveni-0qa01ga.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--finny-yua\.no)$/,"suffix":"xn--finny-yua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fjord-lra\.no)$/,"suffix":"xn--fjord-lra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fl-zia\.no)$/,"suffix":"xn--fl-zia.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--flor-jra\.no)$/,"suffix":"xn--flor-jra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--frde-gra\.no)$/,"suffix":"xn--frde-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--frna-woa\.no)$/,"suffix":"xn--frna-woa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--frya-hra\.no)$/,"suffix":"xn--frya-hra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ggaviika-8ya47h\.no)$/,"suffix":"xn--ggaviika-8ya47h.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gildeskl-g0a\.no)$/,"suffix":"xn--gildeskl-g0a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--givuotna-8ya\.no)$/,"suffix":"xn--givuotna-8ya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gjvik-wua\.no)$/,"suffix":"xn--gjvik-wua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gls-elac\.no)$/,"suffix":"xn--gls-elac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--h-2fa\.no)$/,"suffix":"xn--h-2fa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hbmer-xqa\.no)$/,"suffix":"xn--hbmer-xqa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hcesuolo-7ya35b\.no)$/,"suffix":"xn--hcesuolo-7ya35b.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hgebostad-g3a\.no)$/,"suffix":"xn--hgebostad-g3a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hmmrfeasta-s4ac\.no)$/,"suffix":"xn--hmmrfeasta-s4ac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hnefoss-q1a\.no)$/,"suffix":"xn--hnefoss-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hobl-ira\.no)$/,"suffix":"xn--hobl-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--holtlen-hxa\.no)$/,"suffix":"xn--holtlen-hxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hpmir-xqa\.no)$/,"suffix":"xn--hpmir-xqa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hyanger-q1a\.no)$/,"suffix":"xn--hyanger-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hylandet-54a\.no)$/,"suffix":"xn--hylandet-54a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--indery-fya\.no)$/,"suffix":"xn--indery-fya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--jlster-bya\.no)$/,"suffix":"xn--jlster-bya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--jrpeland-54a\.no)$/,"suffix":"xn--jrpeland-54a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--karmy-yua\.no)$/,"suffix":"xn--karmy-yua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kfjord-iua\.no)$/,"suffix":"xn--kfjord-iua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--klbu-woa\.no)$/,"suffix":"xn--klbu-woa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--koluokta-7ya57h\.no)$/,"suffix":"xn--koluokta-7ya57h.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--krager-gya\.no)$/,"suffix":"xn--krager-gya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kranghke-b0a\.no)$/,"suffix":"xn--kranghke-b0a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--krdsherad-m8a\.no)$/,"suffix":"xn--krdsherad-m8a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--krehamn-dxa\.no)$/,"suffix":"xn--krehamn-dxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--krjohka-hwab49j\.no)$/,"suffix":"xn--krjohka-hwab49j.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ksnes-uua\.no)$/,"suffix":"xn--ksnes-uua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kvfjord-nxa\.no)$/,"suffix":"xn--kvfjord-nxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kvitsy-fya\.no)$/,"suffix":"xn--kvitsy-fya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kvnangen-k0a\.no)$/,"suffix":"xn--kvnangen-k0a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--l-1fa\.no)$/,"suffix":"xn--l-1fa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--laheadju-7ya\.no)$/,"suffix":"xn--laheadju-7ya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--langevg-jxa\.no)$/,"suffix":"xn--langevg-jxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ldingen-q1a\.no)$/,"suffix":"xn--ldingen-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--leagaviika-52b\.no)$/,"suffix":"xn--leagaviika-52b.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lesund-hua\.no)$/,"suffix":"xn--lesund-hua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lgrd-poac\.no)$/,"suffix":"xn--lgrd-poac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lhppi-xqa\.no)$/,"suffix":"xn--lhppi-xqa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--linds-pra\.no)$/,"suffix":"xn--linds-pra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--loabt-0qa\.no)$/,"suffix":"xn--loabt-0qa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lrdal-sra\.no)$/,"suffix":"xn--lrdal-sra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lrenskog-54a\.no)$/,"suffix":"xn--lrenskog-54a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lt-liac\.no)$/,"suffix":"xn--lt-liac.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lten-gra\.no)$/,"suffix":"xn--lten-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lury-ira\.no)$/,"suffix":"xn--lury-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mely-ira\.no)$/,"suffix":"xn--mely-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--merker-kua\.no)$/,"suffix":"xn--merker-kua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mjndalen-64a\.no)$/,"suffix":"xn--mjndalen-64a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mlatvuopmi-s4a\.no)$/,"suffix":"xn--mlatvuopmi-s4a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mli-tla\.no)$/,"suffix":"xn--mli-tla.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mlselv-iua\.no)$/,"suffix":"xn--mlselv-iua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--moreke-jua\.no)$/,"suffix":"xn--moreke-jua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mosjen-eya\.no)$/,"suffix":"xn--mosjen-eya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mot-tla\.no)$/,"suffix":"xn--mot-tla.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--msy-ula0h\.no)$/,"suffix":"xn--msy-ula0h.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mtta-vrjjat-k7af\.no)$/,"suffix":"xn--mtta-vrjjat-k7af.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--muost-0qa\.no)$/,"suffix":"xn--muost-0qa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nmesjevuemie-tcba\.no)$/,"suffix":"xn--nmesjevuemie-tcba.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nry-yla5g\.no)$/,"suffix":"xn--nry-yla5g.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nttery-byae\.no)$/,"suffix":"xn--nttery-byae.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nvuotna-hwa\.no)$/,"suffix":"xn--nvuotna-hwa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--oppegrd-ixa\.no)$/,"suffix":"xn--oppegrd-ixa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ostery-fya\.no)$/,"suffix":"xn--ostery-fya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--osyro-wua\.no)$/,"suffix":"xn--osyro-wua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--porsgu-sta26f\.no)$/,"suffix":"xn--porsgu-sta26f.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rady-ira\.no)$/,"suffix":"xn--rady-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rdal-poa\.no)$/,"suffix":"xn--rdal-poa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rde-ula\.no)$/,"suffix":"xn--rde-ula.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rdy-0nab\.no)$/,"suffix":"xn--rdy-0nab.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rennesy-v1a\.no)$/,"suffix":"xn--rennesy-v1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rhkkervju-01af\.no)$/,"suffix":"xn--rhkkervju-01af.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rholt-mra\.no)$/,"suffix":"xn--rholt-mra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--risa-5na\.no)$/,"suffix":"xn--risa-5na.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--risr-ira\.no)$/,"suffix":"xn--risr-ira.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rland-uua\.no)$/,"suffix":"xn--rland-uua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rlingen-mxa\.no)$/,"suffix":"xn--rlingen-mxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rmskog-bya\.no)$/,"suffix":"xn--rmskog-bya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rros-gra\.no)$/,"suffix":"xn--rros-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rskog-uua\.no)$/,"suffix":"xn--rskog-uua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rst-0na\.no)$/,"suffix":"xn--rst-0na.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rsta-fra\.no)$/,"suffix":"xn--rsta-fra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ryken-vua\.no)$/,"suffix":"xn--ryken-vua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ryrvik-bya\.no)$/,"suffix":"xn--ryrvik-bya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--s-1fa\.no)$/,"suffix":"xn--s-1fa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sandnessjen-ogb\.no)$/,"suffix":"xn--sandnessjen-ogb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sandy-yua\.no)$/,"suffix":"xn--sandy-yua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--seral-lra\.no)$/,"suffix":"xn--seral-lra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sgne-gra\.no)$/,"suffix":"xn--sgne-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--skierv-uta\.no)$/,"suffix":"xn--skierv-uta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--skjervy-v1a\.no)$/,"suffix":"xn--skjervy-v1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--skjk-soa\.no)$/,"suffix":"xn--skjk-soa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sknit-yqa\.no)$/,"suffix":"xn--sknit-yqa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sknland-fxa\.no)$/,"suffix":"xn--sknland-fxa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--slat-5na\.no)$/,"suffix":"xn--slat-5na.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--slt-elab\.no)$/,"suffix":"xn--slt-elab.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--smla-hra\.no)$/,"suffix":"xn--smla-hra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--smna-gra\.no)$/,"suffix":"xn--smna-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--snase-nra\.no)$/,"suffix":"xn--snase-nra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sndre-land-0cb\.no)$/,"suffix":"xn--sndre-land-0cb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--snes-poa\.no)$/,"suffix":"xn--snes-poa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--snsa-roa\.no)$/,"suffix":"xn--snsa-roa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sr-aurdal-l8a\.no)$/,"suffix":"xn--sr-aurdal-l8a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sr-fron-q1a\.no)$/,"suffix":"xn--sr-fron-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sr-odal-q1a\.no)$/,"suffix":"xn--sr-odal-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--sr-varanger-ggb\.no)$/,"suffix":"xn--sr-varanger-ggb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--srfold-bya\.no)$/,"suffix":"xn--srfold-bya.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--srreisa-q1a\.no)$/,"suffix":"xn--srreisa-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--srum-gra\.no)$/,"suffix":"xn--srum-gra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--stjrdal-s1a\.no)$/,"suffix":"xn--stjrdal-s1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--stjrdalshalsen-sqb\.no)$/,"suffix":"xn--stjrdalshalsen-sqb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--stre-toten-zcb\.no)$/,"suffix":"xn--stre-toten-zcb.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tjme-hra\.no)$/,"suffix":"xn--tjme-hra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tnsberg-q1a\.no)$/,"suffix":"xn--tnsberg-q1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--trany-yua\.no)$/,"suffix":"xn--trany-yua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--trgstad-r1a\.no)$/,"suffix":"xn--trgstad-r1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--trna-woa\.no)$/,"suffix":"xn--trna-woa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--troms-zua\.no)$/,"suffix":"xn--troms-zua.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tysvr-vra\.no)$/,"suffix":"xn--tysvr-vra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--unjrga-rta\.no)$/,"suffix":"xn--unjrga-rta.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vads-jra\.no)$/,"suffix":"xn--vads-jra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vard-jra\.no)$/,"suffix":"xn--vard-jra.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vegrshei-c0a\.no)$/,"suffix":"xn--vegrshei-c0a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vestvgy-ixa6o\.no)$/,"suffix":"xn--vestvgy-ixa6o.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vg-yiab\.no)$/,"suffix":"xn--vg-yiab.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vgan-qoa\.no)$/,"suffix":"xn--vgan-qoa.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vgsy-qoa0j\.no)$/,"suffix":"xn--vgsy-qoa0j.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vre-eiker-k8a\.no)$/,"suffix":"xn--vre-eiker-k8a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vrggt-xqad\.no)$/,"suffix":"xn--vrggt-xqad.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vry-yla5g\.no)$/,"suffix":"xn--vry-yla5g.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--yer-zna\.no)$/,"suffix":"xn--yer-zna.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ygarden-p1a\.no)$/,"suffix":"xn--ygarden-p1a.no"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ystre-slidre-ujb\.no)$/,"suffix":"xn--ystre-slidre-ujb.no"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(no)$/,"suffix":"no"}],"nokia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nokia)$/,"suffix":"nokia"}],"northwesternmutual":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(northwesternmutual)$/,"suffix":"northwesternmutual"}],"norton":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(norton)$/,"suffix":"norton"}],"now":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(now)$/,"suffix":"now"}],"nowruz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nowruz)$/,"suffix":"nowruz"}],"nowtv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nowtv)$/,"suffix":"nowtv"}],"np":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.np)$/,"suffix":"np"}],"nr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.nr)$/,"suffix":"biz.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.nr)$/,"suffix":"com.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.nr)$/,"suffix":"edu.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.nr)$/,"suffix":"gov.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.nr)$/,"suffix":"info.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.nr)$/,"suffix":"net.nr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.nr)$/,"suffix":"org.nr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nr)$/,"suffix":"nr"}],"nra":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nra)$/,"suffix":"nra"}],"nrw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nrw)$/,"suffix":"nrw"}],"ntt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ntt)$/,"suffix":"ntt"}],"nu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(merseine\.nu)$/,"suffix":"merseine.nu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mine\.nu)$/,"suffix":"mine.nu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shacknet\.nu)$/,"suffix":"shacknet.nu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nu)$/,"suffix":"nu"}],"nyc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nyc)$/,"suffix":"nyc"}],"nz":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.nz)$/,"suffix":"blogspot.co.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.nz)$/,"suffix":"ac.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.nz)$/,"suffix":"co.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cri\.nz)$/,"suffix":"cri.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(geek\.nz)$/,"suffix":"geek.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gen\.nz)$/,"suffix":"gen.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(govt\.nz)$/,"suffix":"govt.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(health\.nz)$/,"suffix":"health.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(iwi\.nz)$/,"suffix":"iwi.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiwi\.nz)$/,"suffix":"kiwi.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(maori\.nz)$/,"suffix":"maori.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.nz)$/,"suffix":"mil.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.nz)$/,"suffix":"net.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.nz)$/,"suffix":"org.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(parliament\.nz)$/,"suffix":"parliament.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(school\.nz)$/,"suffix":"school.nz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mori-qsa\.nz)$/,"suffix":"xn--mori-qsa.nz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(nz)$/,"suffix":"nz"}],"obi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(obi)$/,"suffix":"obi"}],"observer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(observer)$/,"suffix":"observer"}],"off":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(off)$/,"suffix":"off"}],"office":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(office)$/,"suffix":"office"}],"okinawa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(okinawa)$/,"suffix":"okinawa"}],"olayan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(olayan)$/,"suffix":"olayan"}],"olayangroup":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(olayangroup)$/,"suffix":"olayangroup"}],"oldnavy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(oldnavy)$/,"suffix":"oldnavy"}],"ollo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ollo)$/,"suffix":"ollo"}],"om":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.om)$/,"suffix":"co.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.om)$/,"suffix":"com.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.om)$/,"suffix":"edu.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.om)$/,"suffix":"gov.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.om)$/,"suffix":"med.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum\.om)$/,"suffix":"museum.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.om)$/,"suffix":"net.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.om)$/,"suffix":"org.om"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.om)$/,"suffix":"pro.om"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(om)$/,"suffix":"om"}],"omega":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(omega)$/,"suffix":"omega"}],"one":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(one)$/,"suffix":"one"}],"ong":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ong)$/,"suffix":"ong"}],"onl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(onl)$/,"suffix":"onl"}],"online":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(online)$/,"suffix":"online"}],"onyourside":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(onyourside)$/,"suffix":"onyourside"}],"ooo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ooo)$/,"suffix":"ooo"}],"open":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(open)$/,"suffix":"open"}],"oracle":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(oracle)$/,"suffix":"oracle"}],"orange":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(orange)$/,"suffix":"orange"}],"org":[{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(ssl\.origin\.cdn77-secure\.org)$/,"suffix":"ssl.origin.cdn77-secure.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(al\.eu\.org)$/,"suffix":"al.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.eu\.org)$/,"suffix":"asso.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(at\.eu\.org)$/,"suffix":"at.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(au\.eu\.org)$/,"suffix":"au.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(be\.eu\.org)$/,"suffix":"be.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(bg\.eu\.org)$/,"suffix":"bg.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(c\.cdn77\.org)$/,"suffix":"c.cdn77.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ca\.eu\.org)$/,"suffix":"ca.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cd\.eu\.org)$/,"suffix":"cd.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ch\.eu\.org)$/,"suffix":"ch.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn\.eu\.org)$/,"suffix":"cn.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cy\.eu\.org)$/,"suffix":"cy.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cz\.eu\.org)$/,"suffix":"cz.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(de\.eu\.org)$/,"suffix":"de.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(dk\.eu\.org)$/,"suffix":"dk.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.eu\.org)$/,"suffix":"edu.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ee\.eu\.org)$/,"suffix":"ee.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(es\.eu\.org)$/,"suffix":"es.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fi\.eu\.org)$/,"suffix":"fi.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(fr\.eu\.org)$/,"suffix":"fr.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.dyndns\.org)$/,"suffix":"go.dyndns.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gr\.eu\.org)$/,"suffix":"gr.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(home\.dyndns\.org)$/,"suffix":"home.dyndns.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hr\.eu\.org)$/,"suffix":"hr.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(hu\.eu\.org)$/,"suffix":"hu.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ie\.eu\.org)$/,"suffix":"ie.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(il\.eu\.org)$/,"suffix":"il.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.eu\.org)$/,"suffix":"in.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.eu\.org)$/,"suffix":"int.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(is\.eu\.org)$/,"suffix":"is.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(it\.eu\.org)$/,"suffix":"it.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(jp\.eu\.org)$/,"suffix":"jp.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kr\.eu\.org)$/,"suffix":"kr.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lt\.eu\.org)$/,"suffix":"lt.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lu\.eu\.org)$/,"suffix":"lu.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lv\.eu\.org)$/,"suffix":"lv.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mc\.eu\.org)$/,"suffix":"mc.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(me\.eu\.org)$/,"suffix":"me.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mk\.eu\.org)$/,"suffix":"mk.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mt\.eu\.org)$/,"suffix":"mt.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(my\.eu\.org)$/,"suffix":"my.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.eu\.org)$/,"suffix":"net.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ng\.eu\.org)$/,"suffix":"ng.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nl\.eu\.org)$/,"suffix":"nl.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(no\.eu\.org)$/,"suffix":"no.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(nz\.eu\.org)$/,"suffix":"nz.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(paris\.eu\.org)$/,"suffix":"paris.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pl\.eu\.org)$/,"suffix":"pl.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pt\.eu\.org)$/,"suffix":"pt.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(q-a\.eu\.org)$/,"suffix":"q-a.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ro\.eu\.org)$/,"suffix":"ro.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rsc\.cdn77\.org)$/,"suffix":"rsc.cdn77.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ru\.eu\.org)$/,"suffix":"ru.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(se\.eu\.org)$/,"suffix":"se.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(si\.eu\.org)$/,"suffix":"si.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sk\.eu\.org)$/,"suffix":"sk.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(tr\.eu\.org)$/,"suffix":"tr.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uk\.eu\.org)$/,"suffix":"uk.eu.org"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(us\.eu\.org)$/,"suffix":"us.eu.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ae\.org)$/,"suffix":"ae.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogdns\.org)$/,"suffix":"blogdns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogsite\.org)$/,"suffix":"blogsite.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bmoattachments\.org)$/,"suffix":"bmoattachments.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(boldlygoingnowhere\.org)$/,"suffix":"boldlygoingnowhere.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsalias\.org)$/,"suffix":"dnsalias.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnsdojo\.org)$/,"suffix":"dnsdojo.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(doesntexist\.org)$/,"suffix":"doesntexist.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dontexist\.org)$/,"suffix":"dontexist.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(doomdns\.org)$/,"suffix":"doomdns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dsmynas\.org)$/,"suffix":"dsmynas.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(duckdns\.org)$/,"suffix":"duckdns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dvrdns\.org)$/,"suffix":"dvrdns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dynalias\.org)$/,"suffix":"dynalias.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns\.org)$/,"suffix":"dyndns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(endofinternet\.org)$/,"suffix":"endofinternet.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(endoftheinternet\.org)$/,"suffix":"endoftheinternet.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eu\.org)$/,"suffix":"eu.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(familyds\.org)$/,"suffix":"familyds.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(from-me\.org)$/,"suffix":"from-me.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(game-host\.org)$/,"suffix":"game-host.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gotdns\.org)$/,"suffix":"gotdns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hk\.org)$/,"suffix":"hk.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hobby-site\.org)$/,"suffix":"hobby-site.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homedns\.org)$/,"suffix":"homedns.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeftp\.org)$/,"suffix":"homeftp.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homelinux\.org)$/,"suffix":"homelinux.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(homeunix\.org)$/,"suffix":"homeunix.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-bruinsfan\.org)$/,"suffix":"is-a-bruinsfan.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-candidate\.org)$/,"suffix":"is-a-candidate.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-celticsfan\.org)$/,"suffix":"is-a-celticsfan.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-chef\.org)$/,"suffix":"is-a-chef.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-geek\.org)$/,"suffix":"is-a-geek.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-knight\.org)$/,"suffix":"is-a-knight.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-linux-user\.org)$/,"suffix":"is-a-linux-user.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-patsfan\.org)$/,"suffix":"is-a-patsfan.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-a-soxfan\.org)$/,"suffix":"is-a-soxfan.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-found\.org)$/,"suffix":"is-found.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-lost\.org)$/,"suffix":"is-lost.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-saved\.org)$/,"suffix":"is-saved.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-very-bad\.org)$/,"suffix":"is-very-bad.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-very-evil\.org)$/,"suffix":"is-very-evil.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-very-good\.org)$/,"suffix":"is-very-good.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-very-nice\.org)$/,"suffix":"is-very-nice.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-very-sweet\.org)$/,"suffix":"is-very-sweet.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa-geek\.org)$/,"suffix":"isa-geek.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kicks-ass\.org)$/,"suffix":"kicks-ass.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(misconfused\.org)$/,"suffix":"misconfused.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(podzone\.org)$/,"suffix":"podzone.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(readmyblog\.org)$/,"suffix":"readmyblog.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(selfip\.org)$/,"suffix":"selfip.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sellsyourhome\.org)$/,"suffix":"sellsyourhome.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(servebbs\.org)$/,"suffix":"servebbs.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(serveftp\.org)$/,"suffix":"serveftp.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(servegame\.org)$/,"suffix":"servegame.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stuff-4-sale\.org)$/,"suffix":"stuff-4-sale.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(us\.org)$/,"suffix":"us.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(webhop\.org)$/,"suffix":"webhop.org"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(za\.org)$/,"suffix":"za.org"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(org)$/,"suffix":"org"}],"organic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(organic)$/,"suffix":"organic"}],"orientexpress":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(orientexpress)$/,"suffix":"orientexpress"}],"origins":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(origins)$/,"suffix":"origins"}],"osaka":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(osaka)$/,"suffix":"osaka"}],"otsuka":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(otsuka)$/,"suffix":"otsuka"}],"ott":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ott)$/,"suffix":"ott"}],"ovh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ovh)$/,"suffix":"ovh"}],"pa":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(abo\.pa)$/,"suffix":"abo.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.pa)$/,"suffix":"ac.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pa)$/,"suffix":"com.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pa)$/,"suffix":"edu.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.pa)$/,"suffix":"gob.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ing\.pa)$/,"suffix":"ing.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.pa)$/,"suffix":"med.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pa)$/,"suffix":"net.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.pa)$/,"suffix":"nom.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pa)$/,"suffix":"org.pa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sld\.pa)$/,"suffix":"sld.pa"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pa)$/,"suffix":"pa"}],"page":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(page)$/,"suffix":"page"}],"pamperedchef":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pamperedchef)$/,"suffix":"pamperedchef"}],"panasonic":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(panasonic)$/,"suffix":"panasonic"}],"panerai":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(panerai)$/,"suffix":"panerai"}],"paris":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(paris)$/,"suffix":"paris"}],"pars":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pars)$/,"suffix":"pars"}],"partners":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(partners)$/,"suffix":"partners"}],"parts":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(parts)$/,"suffix":"parts"}],"party":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(party)$/,"suffix":"party"}],"passagens":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(passagens)$/,"suffix":"passagens"}],"pay":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pay)$/,"suffix":"pay"}],"payu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(payu)$/,"suffix":"payu"}],"pccw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pccw)$/,"suffix":"pccw"}],"pe":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.pe)$/,"suffix":"blogspot.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pe)$/,"suffix":"com.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pe)$/,"suffix":"edu.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.pe)$/,"suffix":"gob.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.pe)$/,"suffix":"mil.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pe)$/,"suffix":"net.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.pe)$/,"suffix":"nom.pe"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pe)$/,"suffix":"org.pe"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pe)$/,"suffix":"pe"}],"pet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pet)$/,"suffix":"pet"}],"pf":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pf)$/,"suffix":"com.pf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pf)$/,"suffix":"edu.pf"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pf)$/,"suffix":"org.pf"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pf)$/,"suffix":"pf"}],"pfizer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pfizer)$/,"suffix":"pfizer"}],"pg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.pg)$/,"suffix":"pg"}],"ph":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ph)$/,"suffix":"com.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ph)$/,"suffix":"edu.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ph)$/,"suffix":"gov.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(i\.ph)$/,"suffix":"i.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ph)$/,"suffix":"mil.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ph)$/,"suffix":"net.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ngo\.ph)$/,"suffix":"ngo.ph"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ph)$/,"suffix":"org.ph"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ph)$/,"suffix":"ph"}],"pharmacy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pharmacy)$/,"suffix":"pharmacy"}],"philips":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(philips)$/,"suffix":"philips"}],"photo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(photo)$/,"suffix":"photo"}],"photography":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(photography)$/,"suffix":"photography"}],"photos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(photos)$/,"suffix":"photos"}],"physio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(physio)$/,"suffix":"physio"}],"piaget":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(piaget)$/,"suffix":"piaget"}],"pics":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pics)$/,"suffix":"pics"}],"pictet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pictet)$/,"suffix":"pictet"}],"pictures":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pictures)$/,"suffix":"pictures"}],"pid":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pid)$/,"suffix":"pid"}],"pin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pin)$/,"suffix":"pin"}],"ping":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ping)$/,"suffix":"ping"}],"pink":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pink)$/,"suffix":"pink"}],"pioneer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pioneer)$/,"suffix":"pioneer"}],"pizza":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pizza)$/,"suffix":"pizza"}],"pk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.pk)$/,"suffix":"biz.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pk)$/,"suffix":"com.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pk)$/,"suffix":"edu.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fam\.pk)$/,"suffix":"fam.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.pk)$/,"suffix":"gob.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gok\.pk)$/,"suffix":"gok.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gon\.pk)$/,"suffix":"gon.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gop\.pk)$/,"suffix":"gop.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gos\.pk)$/,"suffix":"gos.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.pk)$/,"suffix":"gov.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.pk)$/,"suffix":"info.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pk)$/,"suffix":"net.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pk)$/,"suffix":"org.pk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.pk)$/,"suffix":"web.pk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pk)$/,"suffix":"pk"}],"pl":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ap\.gov\.pl)$/,"suffix":"ap.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(griw\.gov\.pl)$/,"suffix":"griw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ic\.gov\.pl)$/,"suffix":"ic.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(is\.gov\.pl)$/,"suffix":"is.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kmpsp\.gov\.pl)$/,"suffix":"kmpsp.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(konsulat\.gov\.pl)$/,"suffix":"konsulat.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kppsp\.gov\.pl)$/,"suffix":"kppsp.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kwp\.gov\.pl)$/,"suffix":"kwp.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(kwpsp\.gov\.pl)$/,"suffix":"kwpsp.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mup\.gov\.pl)$/,"suffix":"mup.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(mw\.gov\.pl)$/,"suffix":"mw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oirm\.gov\.pl)$/,"suffix":"oirm.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(oum\.gov\.pl)$/,"suffix":"oum.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pa\.gov\.pl)$/,"suffix":"pa.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pinb\.gov\.pl)$/,"suffix":"pinb.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(piw\.gov\.pl)$/,"suffix":"piw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(po\.gov\.pl)$/,"suffix":"po.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(psp\.gov\.pl)$/,"suffix":"psp.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(psse\.gov\.pl)$/,"suffix":"psse.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(pup\.gov\.pl)$/,"suffix":"pup.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(rzgw\.gov\.pl)$/,"suffix":"rzgw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa\.gov\.pl)$/,"suffix":"sa.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sdn\.gov\.pl)$/,"suffix":"sdn.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sko\.gov\.pl)$/,"suffix":"sko.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(so\.gov\.pl)$/,"suffix":"so.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(sr\.gov\.pl)$/,"suffix":"sr.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(starostwo\.gov\.pl)$/,"suffix":"starostwo.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ug\.gov\.pl)$/,"suffix":"ug.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(ugim\.gov\.pl)$/,"suffix":"ugim.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(um\.gov\.pl)$/,"suffix":"um.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(umig\.gov\.pl)$/,"suffix":"umig.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(upow\.gov\.pl)$/,"suffix":"upow.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uppo\.gov\.pl)$/,"suffix":"uppo.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(us\.gov\.pl)$/,"suffix":"us.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uw\.gov\.pl)$/,"suffix":"uw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(uzs\.gov\.pl)$/,"suffix":"uzs.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wif\.gov\.pl)$/,"suffix":"wif.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wiih\.gov\.pl)$/,"suffix":"wiih.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(winb\.gov\.pl)$/,"suffix":"winb.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wios\.gov\.pl)$/,"suffix":"wios.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(witd\.gov\.pl)$/,"suffix":"witd.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wiw\.gov\.pl)$/,"suffix":"wiw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wsa\.gov\.pl)$/,"suffix":"wsa.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wskr\.gov\.pl)$/,"suffix":"wskr.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wuoz\.gov\.pl)$/,"suffix":"wuoz.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(wzmiuw\.gov\.pl)$/,"suffix":"wzmiuw.gov.pl"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(zp\.gov\.pl)$/,"suffix":"zp.gov.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agro\.pl)$/,"suffix":"agro.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aid\.pl)$/,"suffix":"aid.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.pl)$/,"suffix":"art.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(atm\.pl)$/,"suffix":"atm.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(augustow\.pl)$/,"suffix":"augustow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(auto\.pl)$/,"suffix":"auto.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(babia-gora\.pl)$/,"suffix":"babia-gora.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bedzin\.pl)$/,"suffix":"bedzin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(beskidy\.pl)$/,"suffix":"beskidy.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bialowieza\.pl)$/,"suffix":"bialowieza.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bialystok\.pl)$/,"suffix":"bialystok.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bielawa\.pl)$/,"suffix":"bielawa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bieszczady\.pl)$/,"suffix":"bieszczady.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.pl)$/,"suffix":"biz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(boleslawiec\.pl)$/,"suffix":"boleslawiec.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bydgoszcz\.pl)$/,"suffix":"bydgoszcz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bytom\.pl)$/,"suffix":"bytom.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cieszyn\.pl)$/,"suffix":"cieszyn.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.pl)$/,"suffix":"co.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pl)$/,"suffix":"com.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(czeladz\.pl)$/,"suffix":"czeladz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(czest\.pl)$/,"suffix":"czest.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dlugoleka\.pl)$/,"suffix":"dlugoleka.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pl)$/,"suffix":"edu.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elblag\.pl)$/,"suffix":"elblag.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(elk\.pl)$/,"suffix":"elk.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gda\.pl)$/,"suffix":"gda.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gdansk\.pl)$/,"suffix":"gdansk.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gdynia\.pl)$/,"suffix":"gdynia.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gliwice\.pl)$/,"suffix":"gliwice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(glogow\.pl)$/,"suffix":"glogow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gmina\.pl)$/,"suffix":"gmina.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gniezno\.pl)$/,"suffix":"gniezno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gorlice\.pl)$/,"suffix":"gorlice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.pl)$/,"suffix":"gov.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grajewo\.pl)$/,"suffix":"grajewo.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gsm\.pl)$/,"suffix":"gsm.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ilawa\.pl)$/,"suffix":"ilawa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.pl)$/,"suffix":"info.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jaworzno\.pl)$/,"suffix":"jaworzno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jelenia-gora\.pl)$/,"suffix":"jelenia-gora.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jgora\.pl)$/,"suffix":"jgora.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kalisz\.pl)$/,"suffix":"kalisz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karpacz\.pl)$/,"suffix":"karpacz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kartuzy\.pl)$/,"suffix":"kartuzy.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaszuby\.pl)$/,"suffix":"kaszuby.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(katowice\.pl)$/,"suffix":"katowice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kazimierz-dolny\.pl)$/,"suffix":"kazimierz-dolny.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kepno\.pl)$/,"suffix":"kepno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ketrzyn\.pl)$/,"suffix":"ketrzyn.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(klodzko\.pl)$/,"suffix":"klodzko.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kobierzyce\.pl)$/,"suffix":"kobierzyce.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kolobrzeg\.pl)$/,"suffix":"kolobrzeg.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(konin\.pl)$/,"suffix":"konin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(konskowola\.pl)$/,"suffix":"konskowola.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krakow\.pl)$/,"suffix":"krakow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kutno\.pl)$/,"suffix":"kutno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lapy\.pl)$/,"suffix":"lapy.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lebork\.pl)$/,"suffix":"lebork.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(legnica\.pl)$/,"suffix":"legnica.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lezajsk\.pl)$/,"suffix":"lezajsk.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(limanowa\.pl)$/,"suffix":"limanowa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lomza\.pl)$/,"suffix":"lomza.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lowicz\.pl)$/,"suffix":"lowicz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lubin\.pl)$/,"suffix":"lubin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lukow\.pl)$/,"suffix":"lukow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mail\.pl)$/,"suffix":"mail.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(malbork\.pl)$/,"suffix":"malbork.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(malopolska\.pl)$/,"suffix":"malopolska.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mazowsze\.pl)$/,"suffix":"mazowsze.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mazury\.pl)$/,"suffix":"mazury.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.pl)$/,"suffix":"med.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(media\.pl)$/,"suffix":"media.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(miasta\.pl)$/,"suffix":"miasta.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mielec\.pl)$/,"suffix":"mielec.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mielno\.pl)$/,"suffix":"mielno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.pl)$/,"suffix":"mil.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mragowo\.pl)$/,"suffix":"mragowo.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naklo\.pl)$/,"suffix":"naklo.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pl)$/,"suffix":"net.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nieruchomosci\.pl)$/,"suffix":"nieruchomosci.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.pl)$/,"suffix":"nom.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nowaruda\.pl)$/,"suffix":"nowaruda.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nysa\.pl)$/,"suffix":"nysa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olawa\.pl)$/,"suffix":"olawa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olecko\.pl)$/,"suffix":"olecko.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olkusz\.pl)$/,"suffix":"olkusz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(olsztyn\.pl)$/,"suffix":"olsztyn.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(opoczno\.pl)$/,"suffix":"opoczno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(opole\.pl)$/,"suffix":"opole.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pl)$/,"suffix":"org.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ostroda\.pl)$/,"suffix":"ostroda.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ostroleka\.pl)$/,"suffix":"ostroleka.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ostrowiec\.pl)$/,"suffix":"ostrowiec.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ostrowwlkp\.pl)$/,"suffix":"ostrowwlkp.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pc\.pl)$/,"suffix":"pc.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pila\.pl)$/,"suffix":"pila.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pisz\.pl)$/,"suffix":"pisz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(podhale\.pl)$/,"suffix":"podhale.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(podlasie\.pl)$/,"suffix":"podlasie.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(polkowice\.pl)$/,"suffix":"polkowice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pomorskie\.pl)$/,"suffix":"pomorskie.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pomorze\.pl)$/,"suffix":"pomorze.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(powiat\.pl)$/,"suffix":"powiat.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(poznan\.pl)$/,"suffix":"poznan.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(priv\.pl)$/,"suffix":"priv.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prochowice\.pl)$/,"suffix":"prochowice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pruszkow\.pl)$/,"suffix":"pruszkow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(przeworsk\.pl)$/,"suffix":"przeworsk.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pulawy\.pl)$/,"suffix":"pulawy.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(radom\.pl)$/,"suffix":"radom.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rawa-maz\.pl)$/,"suffix":"rawa-maz.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(realestate\.pl)$/,"suffix":"realestate.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rel\.pl)$/,"suffix":"rel.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rybnik\.pl)$/,"suffix":"rybnik.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rzeszow\.pl)$/,"suffix":"rzeszow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanok\.pl)$/,"suffix":"sanok.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sejny\.pl)$/,"suffix":"sejny.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sex\.pl)$/,"suffix":"sex.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(shop\.pl)$/,"suffix":"shop.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sklep\.pl)$/,"suffix":"sklep.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(skoczow\.pl)$/,"suffix":"skoczow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(slask\.pl)$/,"suffix":"slask.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(slupsk\.pl)$/,"suffix":"slupsk.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sopot\.pl)$/,"suffix":"sopot.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sos\.pl)$/,"suffix":"sos.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sosnowiec\.pl)$/,"suffix":"sosnowiec.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stalowa-wola\.pl)$/,"suffix":"stalowa-wola.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(starachowice\.pl)$/,"suffix":"starachowice.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stargard\.pl)$/,"suffix":"stargard.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(suwalki\.pl)$/,"suffix":"suwalki.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(swidnica\.pl)$/,"suffix":"swidnica.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(swiebodzin\.pl)$/,"suffix":"swiebodzin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(swinoujscie\.pl)$/,"suffix":"swinoujscie.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(szczecin\.pl)$/,"suffix":"szczecin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(szczytno\.pl)$/,"suffix":"szczytno.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(szkola\.pl)$/,"suffix":"szkola.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(targi\.pl)$/,"suffix":"targi.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tarnobrzeg\.pl)$/,"suffix":"tarnobrzeg.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tgory\.pl)$/,"suffix":"tgory.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.pl)$/,"suffix":"tm.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tourism\.pl)$/,"suffix":"tourism.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(travel\.pl)$/,"suffix":"travel.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(turek\.pl)$/,"suffix":"turek.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(turystyka\.pl)$/,"suffix":"turystyka.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tychy\.pl)$/,"suffix":"tychy.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ustka\.pl)$/,"suffix":"ustka.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(walbrzych\.pl)$/,"suffix":"walbrzych.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(warmia\.pl)$/,"suffix":"warmia.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(warszawa\.pl)$/,"suffix":"warszawa.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(waw\.pl)$/,"suffix":"waw.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wegrow\.pl)$/,"suffix":"wegrow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wielun\.pl)$/,"suffix":"wielun.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wlocl\.pl)$/,"suffix":"wlocl.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wloclawek\.pl)$/,"suffix":"wloclawek.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wodzislaw\.pl)$/,"suffix":"wodzislaw.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wolomin\.pl)$/,"suffix":"wolomin.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wroc\.pl)$/,"suffix":"wroc.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wroclaw\.pl)$/,"suffix":"wroclaw.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zachpomor\.pl)$/,"suffix":"zachpomor.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zagan\.pl)$/,"suffix":"zagan.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zakopane\.pl)$/,"suffix":"zakopane.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zarow\.pl)$/,"suffix":"zarow.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zgora\.pl)$/,"suffix":"zgora.pl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zgorzelec\.pl)$/,"suffix":"zgorzelec.pl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pl)$/,"suffix":"pl"}],"place":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(place)$/,"suffix":"place"}],"play":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(play)$/,"suffix":"play"}],"playstation":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(playstation)$/,"suffix":"playstation"}],"plumbing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(plumbing)$/,"suffix":"plumbing"}],"plus":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(plus)$/,"suffix":"plus"}],"pm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pm)$/,"suffix":"pm"}],"pn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.pn)$/,"suffix":"co.pn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pn)$/,"suffix":"edu.pn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.pn)$/,"suffix":"gov.pn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pn)$/,"suffix":"net.pn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pn)$/,"suffix":"org.pn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pn)$/,"suffix":"pn"}],"pnc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pnc)$/,"suffix":"pnc"}],"pohl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pohl)$/,"suffix":"pohl"}],"poker":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(poker)$/,"suffix":"poker"}],"politie":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(politie)$/,"suffix":"politie"}],"porn":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(porn)$/,"suffix":"porn"}],"post":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(post)$/,"suffix":"post"}],"pr":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.pr)$/,"suffix":"ac.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.pr)$/,"suffix":"biz.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pr)$/,"suffix":"com.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pr)$/,"suffix":"edu.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(est\.pr)$/,"suffix":"est.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.pr)$/,"suffix":"gov.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.pr)$/,"suffix":"info.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isla\.pr)$/,"suffix":"isla.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.pr)$/,"suffix":"name.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pr)$/,"suffix":"net.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pr)$/,"suffix":"org.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.pr)$/,"suffix":"pro.pr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(prof\.pr)$/,"suffix":"prof.pr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pr)$/,"suffix":"pr"}],"pramerica":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pramerica)$/,"suffix":"pramerica"}],"praxi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(praxi)$/,"suffix":"praxi"}],"press":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(press)$/,"suffix":"press"}],"prime":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(prime)$/,"suffix":"prime"}],"pro":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aaa\.pro)$/,"suffix":"aaa.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aca\.pro)$/,"suffix":"aca.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(acct\.pro)$/,"suffix":"acct.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(avocat\.pro)$/,"suffix":"avocat.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bar\.pro)$/,"suffix":"bar.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cpa\.pro)$/,"suffix":"cpa.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(eng\.pro)$/,"suffix":"eng.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jur\.pro)$/,"suffix":"jur.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(law\.pro)$/,"suffix":"law.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.pro)$/,"suffix":"med.pro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(recht\.pro)$/,"suffix":"recht.pro"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro)$/,"suffix":"pro"}],"prod":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(prod)$/,"suffix":"prod"}],"productions":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(productions)$/,"suffix":"productions"}],"prof":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(prof)$/,"suffix":"prof"}],"progressive":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(progressive)$/,"suffix":"progressive"}],"promo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(promo)$/,"suffix":"promo"}],"properties":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(properties)$/,"suffix":"properties"}],"property":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(property)$/,"suffix":"property"}],"protection":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(protection)$/,"suffix":"protection"}],"pru":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pru)$/,"suffix":"pru"}],"prudential":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(prudential)$/,"suffix":"prudential"}],"ps":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ps)$/,"suffix":"com.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ps)$/,"suffix":"edu.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ps)$/,"suffix":"gov.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ps)$/,"suffix":"net.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ps)$/,"suffix":"org.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plo\.ps)$/,"suffix":"plo.ps"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sec\.ps)$/,"suffix":"sec.ps"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ps)$/,"suffix":"ps"}],"pt":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.pt)$/,"suffix":"blogspot.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.pt)$/,"suffix":"com.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.pt)$/,"suffix":"edu.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.pt)$/,"suffix":"gov.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.pt)$/,"suffix":"int.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.pt)$/,"suffix":"net.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nome\.pt)$/,"suffix":"nome.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.pt)$/,"suffix":"org.pt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(publ\.pt)$/,"suffix":"publ.pt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pt)$/,"suffix":"pt"}],"pub":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pub)$/,"suffix":"pub"}],"pw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(belau\.pw)$/,"suffix":"belau.pw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.pw)$/,"suffix":"co.pw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ed\.pw)$/,"suffix":"ed.pw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.pw)$/,"suffix":"go.pw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.pw)$/,"suffix":"ne.pw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.pw)$/,"suffix":"or.pw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pw)$/,"suffix":"pw"}],"pwc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(pwc)$/,"suffix":"pwc"}],"py":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.py)$/,"suffix":"com.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.py)$/,"suffix":"coop.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.py)$/,"suffix":"edu.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.py)$/,"suffix":"gov.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.py)$/,"suffix":"mil.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.py)$/,"suffix":"net.py"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.py)$/,"suffix":"org.py"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(py)$/,"suffix":"py"}],"qa":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.qa)$/,"suffix":"blogspot.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.qa)$/,"suffix":"com.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.qa)$/,"suffix":"edu.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.qa)$/,"suffix":"gov.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.qa)$/,"suffix":"mil.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.qa)$/,"suffix":"name.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.qa)$/,"suffix":"net.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.qa)$/,"suffix":"org.qa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.qa)$/,"suffix":"sch.qa"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(qa)$/,"suffix":"qa"}],"qpon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(qpon)$/,"suffix":"qpon"}],"quebec":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(quebec)$/,"suffix":"quebec"}],"quest":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(quest)$/,"suffix":"quest"}],"qvc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(qvc)$/,"suffix":"qvc"}],"racing":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(racing)$/,"suffix":"racing"}],"raid":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(raid)$/,"suffix":"raid"}],"re":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(asso\.re)$/,"suffix":"asso.re"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.re)$/,"suffix":"blogspot.re"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.re)$/,"suffix":"com.re"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.re)$/,"suffix":"nom.re"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(re)$/,"suffix":"re"}],"read":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(read)$/,"suffix":"read"}],"realestate":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(realestate)$/,"suffix":"realestate"}],"realtor":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(realtor)$/,"suffix":"realtor"}],"realty":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(realty)$/,"suffix":"realty"}],"recipes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(recipes)$/,"suffix":"recipes"}],"red":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(red)$/,"suffix":"red"}],"redstone":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(redstone)$/,"suffix":"redstone"}],"redumbrella":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(redumbrella)$/,"suffix":"redumbrella"}],"rehab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rehab)$/,"suffix":"rehab"}],"reise":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(reise)$/,"suffix":"reise"}],"reisen":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(reisen)$/,"suffix":"reisen"}],"reit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(reit)$/,"suffix":"reit"}],"reliance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(reliance)$/,"suffix":"reliance"}],"ren":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ren)$/,"suffix":"ren"}],"rent":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rent)$/,"suffix":"rent"}],"rentals":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rentals)$/,"suffix":"rentals"}],"repair":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(repair)$/,"suffix":"repair"}],"report":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(report)$/,"suffix":"report"}],"republican":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(republican)$/,"suffix":"republican"}],"rest":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rest)$/,"suffix":"rest"}],"restaurant":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(restaurant)$/,"suffix":"restaurant"}],"review":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(review)$/,"suffix":"review"}],"reviews":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(reviews)$/,"suffix":"reviews"}],"rexroth":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rexroth)$/,"suffix":"rexroth"}],"rich":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rich)$/,"suffix":"rich"}],"richardli":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(richardli)$/,"suffix":"richardli"}],"ricoh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ricoh)$/,"suffix":"ricoh"}],"rightathome":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rightathome)$/,"suffix":"rightathome"}],"ril":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ril)$/,"suffix":"ril"}],"rio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rio)$/,"suffix":"rio"}],"rip":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rip)$/,"suffix":"rip"}],"rmit":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rmit)$/,"suffix":"rmit"}],"ro":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arts\.ro)$/,"suffix":"arts.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ro)$/,"suffix":"blogspot.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ro)$/,"suffix":"com.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.ro)$/,"suffix":"firm.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ro)$/,"suffix":"info.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.ro)$/,"suffix":"nom.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nt\.ro)$/,"suffix":"nt.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ro)$/,"suffix":"org.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rec\.ro)$/,"suffix":"rec.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(store\.ro)$/,"suffix":"store.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.ro)$/,"suffix":"tm.ro"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(www\.ro)$/,"suffix":"www.ro"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ro)$/,"suffix":"ro"}],"rocher":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rocher)$/,"suffix":"rocher"}],"rocks":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rocks)$/,"suffix":"rocks"}],"rodeo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rodeo)$/,"suffix":"rodeo"}],"rogers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rogers)$/,"suffix":"rogers"}],"room":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(room)$/,"suffix":"room"}],"rs":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.rs)$/,"suffix":"ac.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.rs)$/,"suffix":"blogspot.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.rs)$/,"suffix":"co.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.rs)$/,"suffix":"edu.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.rs)$/,"suffix":"gov.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.rs)$/,"suffix":"in.rs"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.rs)$/,"suffix":"org.rs"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rs)$/,"suffix":"rs"}],"rsvp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rsvp)$/,"suffix":"rsvp"}],"ru":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ru)$/,"suffix":"ac.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(adygeya\.ru)$/,"suffix":"adygeya.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(altai\.ru)$/,"suffix":"altai.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amur\.ru)$/,"suffix":"amur.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(amursk\.ru)$/,"suffix":"amursk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arkhangelsk\.ru)$/,"suffix":"arkhangelsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(astrakhan\.ru)$/,"suffix":"astrakhan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(baikal\.ru)$/,"suffix":"baikal.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bashkiria\.ru)$/,"suffix":"bashkiria.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(belgorod\.ru)$/,"suffix":"belgorod.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bir\.ru)$/,"suffix":"bir.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ru)$/,"suffix":"blogspot.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bryansk\.ru)$/,"suffix":"bryansk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(buryatia\.ru)$/,"suffix":"buryatia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cbg\.ru)$/,"suffix":"cbg.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chel\.ru)$/,"suffix":"chel.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chelyabinsk\.ru)$/,"suffix":"chelyabinsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chita\.ru)$/,"suffix":"chita.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chukotka\.ru)$/,"suffix":"chukotka.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chuvashia\.ru)$/,"suffix":"chuvashia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cmw\.ru)$/,"suffix":"cmw.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ru)$/,"suffix":"com.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dagestan\.ru)$/,"suffix":"dagestan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dudinka\.ru)$/,"suffix":"dudinka.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(e-burg\.ru)$/,"suffix":"e-burg.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ru)$/,"suffix":"edu.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fareast\.ru)$/,"suffix":"fareast.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ru)$/,"suffix":"gov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grozny\.ru)$/,"suffix":"grozny.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.ru)$/,"suffix":"int.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(irkutsk\.ru)$/,"suffix":"irkutsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ivanovo\.ru)$/,"suffix":"ivanovo.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(izhevsk\.ru)$/,"suffix":"izhevsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jamal\.ru)$/,"suffix":"jamal.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jar\.ru)$/,"suffix":"jar.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(joshkar-ola\.ru)$/,"suffix":"joshkar-ola.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k-uralsk\.ru)$/,"suffix":"k-uralsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kalmykia\.ru)$/,"suffix":"kalmykia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaluga\.ru)$/,"suffix":"kaluga.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kamchatka\.ru)$/,"suffix":"kamchatka.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karelia\.ru)$/,"suffix":"karelia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kazan\.ru)$/,"suffix":"kazan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kchr\.ru)$/,"suffix":"kchr.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kemerovo\.ru)$/,"suffix":"kemerovo.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khabarovsk\.ru)$/,"suffix":"khabarovsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khakassia\.ru)$/,"suffix":"khakassia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khv\.ru)$/,"suffix":"khv.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kirov\.ru)$/,"suffix":"kirov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kms\.ru)$/,"suffix":"kms.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(koenig\.ru)$/,"suffix":"koenig.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(komi\.ru)$/,"suffix":"komi.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kostroma\.ru)$/,"suffix":"kostroma.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krasnoyarsk\.ru)$/,"suffix":"krasnoyarsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuban\.ru)$/,"suffix":"kuban.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurgan\.ru)$/,"suffix":"kurgan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kursk\.ru)$/,"suffix":"kursk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kustanai\.ru)$/,"suffix":"kustanai.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kuzbass\.ru)$/,"suffix":"kuzbass.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lipetsk\.ru)$/,"suffix":"lipetsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(magadan\.ru)$/,"suffix":"magadan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mari-el\.ru)$/,"suffix":"mari-el.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mari\.ru)$/,"suffix":"mari.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(marine\.ru)$/,"suffix":"marine.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ru)$/,"suffix":"mil.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mordovia\.ru)$/,"suffix":"mordovia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(msk\.ru)$/,"suffix":"msk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(murmansk\.ru)$/,"suffix":"murmansk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mytis\.ru)$/,"suffix":"mytis.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nakhodka\.ru)$/,"suffix":"nakhodka.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nalchik\.ru)$/,"suffix":"nalchik.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ru)$/,"suffix":"net.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nkz\.ru)$/,"suffix":"nkz.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nnov\.ru)$/,"suffix":"nnov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(norilsk\.ru)$/,"suffix":"norilsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nov\.ru)$/,"suffix":"nov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(novosibirsk\.ru)$/,"suffix":"novosibirsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nsk\.ru)$/,"suffix":"nsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(omsk\.ru)$/,"suffix":"omsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(orenburg\.ru)$/,"suffix":"orenburg.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ru)$/,"suffix":"org.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oryol\.ru)$/,"suffix":"oryol.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oskol\.ru)$/,"suffix":"oskol.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(palana\.ru)$/,"suffix":"palana.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(penza\.ru)$/,"suffix":"penza.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(perm\.ru)$/,"suffix":"perm.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pp\.ru)$/,"suffix":"pp.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ptz\.ru)$/,"suffix":"ptz.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pyatigorsk\.ru)$/,"suffix":"pyatigorsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rnd\.ru)$/,"suffix":"rnd.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rubtsovsk\.ru)$/,"suffix":"rubtsovsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ryazan\.ru)$/,"suffix":"ryazan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakhalin\.ru)$/,"suffix":"sakhalin.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(samara\.ru)$/,"suffix":"samara.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saratov\.ru)$/,"suffix":"saratov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(simbirsk\.ru)$/,"suffix":"simbirsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(smolensk\.ru)$/,"suffix":"smolensk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(snz\.ru)$/,"suffix":"snz.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(spb\.ru)$/,"suffix":"spb.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stavropol\.ru)$/,"suffix":"stavropol.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stv\.ru)$/,"suffix":"stv.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(surgut\.ru)$/,"suffix":"surgut.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(syzran\.ru)$/,"suffix":"syzran.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tambov\.ru)$/,"suffix":"tambov.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatarstan\.ru)$/,"suffix":"tatarstan.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(test\.ru)$/,"suffix":"test.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tom\.ru)$/,"suffix":"tom.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tomsk\.ru)$/,"suffix":"tomsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsaritsyn\.ru)$/,"suffix":"tsaritsyn.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tsk\.ru)$/,"suffix":"tsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tula\.ru)$/,"suffix":"tula.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tuva\.ru)$/,"suffix":"tuva.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tver\.ru)$/,"suffix":"tver.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tyumen\.ru)$/,"suffix":"tyumen.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(udm\.ru)$/,"suffix":"udm.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(udmurtia\.ru)$/,"suffix":"udmurtia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ulan-ude\.ru)$/,"suffix":"ulan-ude.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vdonsk\.ru)$/,"suffix":"vdonsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vladikavkaz\.ru)$/,"suffix":"vladikavkaz.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vladimir\.ru)$/,"suffix":"vladimir.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vladivostok\.ru)$/,"suffix":"vladivostok.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(volgograd\.ru)$/,"suffix":"volgograd.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vologda\.ru)$/,"suffix":"vologda.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(voronezh\.ru)$/,"suffix":"voronezh.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vrn\.ru)$/,"suffix":"vrn.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vyatka\.ru)$/,"suffix":"vyatka.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yakutia\.ru)$/,"suffix":"yakutia.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamal\.ru)$/,"suffix":"yamal.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yaroslavl\.ru)$/,"suffix":"yaroslavl.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yekaterinburg\.ru)$/,"suffix":"yekaterinburg.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yuzhno-sakhalinsk\.ru)$/,"suffix":"yuzhno-sakhalinsk.ru"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zgrad\.ru)$/,"suffix":"zgrad.ru"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ru)$/,"suffix":"ru"}],"ruhr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ruhr)$/,"suffix":"ruhr"}],"run":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(run)$/,"suffix":"run"}],"rw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.rw)$/,"suffix":"ac.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.rw)$/,"suffix":"co.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.rw)$/,"suffix":"com.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.rw)$/,"suffix":"edu.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.rw)$/,"suffix":"gouv.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.rw)$/,"suffix":"gov.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.rw)$/,"suffix":"int.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.rw)$/,"suffix":"mil.rw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.rw)$/,"suffix":"net.rw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rw)$/,"suffix":"rw"}],"rwe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(rwe)$/,"suffix":"rwe"}],"ryukyu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ryukyu)$/,"suffix":"ryukyu"}],"sa":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sa)$/,"suffix":"com.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sa)$/,"suffix":"edu.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sa)$/,"suffix":"gov.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.sa)$/,"suffix":"med.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sa)$/,"suffix":"net.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sa)$/,"suffix":"org.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pub\.sa)$/,"suffix":"pub.sa"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sch\.sa)$/,"suffix":"sch.sa"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sa)$/,"suffix":"sa"}],"saarland":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(saarland)$/,"suffix":"saarland"}],"safe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(safe)$/,"suffix":"safe"}],"safety":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(safety)$/,"suffix":"safety"}],"sakura":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sakura)$/,"suffix":"sakura"}],"sale":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sale)$/,"suffix":"sale"}],"salon":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(salon)$/,"suffix":"salon"}],"samsclub":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(samsclub)$/,"suffix":"samsclub"}],"samsung":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(samsung)$/,"suffix":"samsung"}],"sandvik":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandvik)$/,"suffix":"sandvik"}],"sandvikcoromant":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sandvikcoromant)$/,"suffix":"sandvikcoromant"}],"sanofi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sanofi)$/,"suffix":"sanofi"}],"sap":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sap)$/,"suffix":"sap"}],"sapo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sapo)$/,"suffix":"sapo"}],"sarl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sarl)$/,"suffix":"sarl"}],"sas":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sas)$/,"suffix":"sas"}],"save":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(save)$/,"suffix":"save"}],"saxo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(saxo)$/,"suffix":"saxo"}],"sb":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sb)$/,"suffix":"com.sb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sb)$/,"suffix":"edu.sb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sb)$/,"suffix":"gov.sb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sb)$/,"suffix":"net.sb"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sb)$/,"suffix":"org.sb"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sb)$/,"suffix":"sb"}],"sbi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sbi)$/,"suffix":"sbi"}],"sbs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sbs)$/,"suffix":"sbs"}],"sc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sc)$/,"suffix":"com.sc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sc)$/,"suffix":"edu.sc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sc)$/,"suffix":"gov.sc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sc)$/,"suffix":"net.sc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sc)$/,"suffix":"org.sc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc)$/,"suffix":"sc"}],"sca":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sca)$/,"suffix":"sca"}],"scb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(scb)$/,"suffix":"scb"}],"schaeffler":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(schaeffler)$/,"suffix":"schaeffler"}],"schmidt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(schmidt)$/,"suffix":"schmidt"}],"scholarships":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(scholarships)$/,"suffix":"scholarships"}],"school":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(school)$/,"suffix":"school"}],"schule":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(schule)$/,"suffix":"schule"}],"schwarz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(schwarz)$/,"suffix":"schwarz"}],"science":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(science)$/,"suffix":"science"}],"scjohnson":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(scjohnson)$/,"suffix":"scjohnson"}],"scor":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(scor)$/,"suffix":"scor"}],"scot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(scot)$/,"suffix":"scot"}],"sd":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sd)$/,"suffix":"com.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sd)$/,"suffix":"edu.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sd)$/,"suffix":"gov.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.sd)$/,"suffix":"info.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(med\.sd)$/,"suffix":"med.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sd)$/,"suffix":"net.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sd)$/,"suffix":"org.sd"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.sd)$/,"suffix":"tv.sd"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sd)$/,"suffix":"sd"}],"se":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(a\.se)$/,"suffix":"a.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.se)$/,"suffix":"ac.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(b\.se)$/,"suffix":"b.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bd\.se)$/,"suffix":"bd.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.se)$/,"suffix":"blogspot.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(brand\.se)$/,"suffix":"brand.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(c\.se)$/,"suffix":"c.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.se)$/,"suffix":"com.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(d\.se)$/,"suffix":"d.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(e\.se)$/,"suffix":"e.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(f\.se)$/,"suffix":"f.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fh\.se)$/,"suffix":"fh.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fhsk\.se)$/,"suffix":"fhsk.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fhv\.se)$/,"suffix":"fhv.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(g\.se)$/,"suffix":"g.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(h\.se)$/,"suffix":"h.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(i\.se)$/,"suffix":"i.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k\.se)$/,"suffix":"k.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(komforb\.se)$/,"suffix":"komforb.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kommunalforbund\.se)$/,"suffix":"kommunalforbund.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(komvux\.se)$/,"suffix":"komvux.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(l\.se)$/,"suffix":"l.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lanbib\.se)$/,"suffix":"lanbib.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(m\.se)$/,"suffix":"m.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(n\.se)$/,"suffix":"n.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(naturbruksgymn\.se)$/,"suffix":"naturbruksgymn.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(o\.se)$/,"suffix":"o.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.se)$/,"suffix":"org.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(p\.se)$/,"suffix":"p.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(parti\.se)$/,"suffix":"parti.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pp\.se)$/,"suffix":"pp.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(press\.se)$/,"suffix":"press.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(r\.se)$/,"suffix":"r.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(s\.se)$/,"suffix":"s.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(t\.se)$/,"suffix":"t.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.se)$/,"suffix":"tm.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(u\.se)$/,"suffix":"u.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(w\.se)$/,"suffix":"w.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(x\.se)$/,"suffix":"x.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(y\.se)$/,"suffix":"y.se"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(z\.se)$/,"suffix":"z.se"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(se)$/,"suffix":"se"}],"seat":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(seat)$/,"suffix":"seat"}],"secure":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(secure)$/,"suffix":"secure"}],"security":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(security)$/,"suffix":"security"}],"seek":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(seek)$/,"suffix":"seek"}],"select":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(select)$/,"suffix":"select"}],"sener":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sener)$/,"suffix":"sener"}],"services":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(services)$/,"suffix":"services"}],"ses":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ses)$/,"suffix":"ses"}],"seven":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(seven)$/,"suffix":"seven"}],"sew":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sew)$/,"suffix":"sew"}],"sex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sex)$/,"suffix":"sex"}],"sexy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sexy)$/,"suffix":"sexy"}],"sfr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sfr)$/,"suffix":"sfr"}],"sg":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.sg)$/,"suffix":"blogspot.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sg)$/,"suffix":"com.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sg)$/,"suffix":"edu.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sg)$/,"suffix":"gov.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sg)$/,"suffix":"net.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sg)$/,"suffix":"org.sg"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(per\.sg)$/,"suffix":"per.sg"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sg)$/,"suffix":"sg"}],"sh":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sh)$/,"suffix":"com.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sh)$/,"suffix":"gov.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hashbang\.sh)$/,"suffix":"hashbang.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.sh)$/,"suffix":"mil.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sh)$/,"suffix":"net.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sh)$/,"suffix":"org.sh"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.platform\.sh)$/,"suffix":"platform.sh"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sh)$/,"suffix":"sh"}],"shangrila":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shangrila)$/,"suffix":"shangrila"}],"sharp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sharp)$/,"suffix":"sharp"}],"shaw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shaw)$/,"suffix":"shaw"}],"shell":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shell)$/,"suffix":"shell"}],"shia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shia)$/,"suffix":"shia"}],"shiksha":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shiksha)$/,"suffix":"shiksha"}],"shoes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shoes)$/,"suffix":"shoes"}],"shouji":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shouji)$/,"suffix":"shouji"}],"show":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(show)$/,"suffix":"show"}],"showtime":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(showtime)$/,"suffix":"showtime"}],"shriram":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(shriram)$/,"suffix":"shriram"}],"si":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.si)$/,"suffix":"blogspot.si"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(si)$/,"suffix":"si"}],"silk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(silk)$/,"suffix":"silk"}],"sina":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sina)$/,"suffix":"sina"}],"singles":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(singles)$/,"suffix":"singles"}],"site":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(site)$/,"suffix":"site"}],"sj":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sj)$/,"suffix":"sj"}],"sk":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.sk)$/,"suffix":"blogspot.sk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sk)$/,"suffix":"sk"}],"ski":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ski)$/,"suffix":"ski"}],"skin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(skin)$/,"suffix":"skin"}],"sky":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sky)$/,"suffix":"sky"}],"skype":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(skype)$/,"suffix":"skype"}],"sl":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sl)$/,"suffix":"com.sl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sl)$/,"suffix":"edu.sl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sl)$/,"suffix":"gov.sl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sl)$/,"suffix":"net.sl"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sl)$/,"suffix":"org.sl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sl)$/,"suffix":"sl"}],"sling":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sling)$/,"suffix":"sling"}],"sm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sm)$/,"suffix":"sm"}],"smart":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(smart)$/,"suffix":"smart"}],"smile":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(smile)$/,"suffix":"smile"}],"sn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(art\.sn)$/,"suffix":"art.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.sn)$/,"suffix":"blogspot.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sn)$/,"suffix":"com.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sn)$/,"suffix":"edu.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gouv\.sn)$/,"suffix":"gouv.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sn)$/,"suffix":"org.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(perso\.sn)$/,"suffix":"perso.sn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(univ\.sn)$/,"suffix":"univ.sn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sn)$/,"suffix":"sn"}],"sncf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sncf)$/,"suffix":"sncf"}],"so":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.so)$/,"suffix":"com.so"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.so)$/,"suffix":"net.so"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.so)$/,"suffix":"org.so"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(so)$/,"suffix":"so"}],"soccer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(soccer)$/,"suffix":"soccer"}],"social":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(social)$/,"suffix":"social"}],"softbank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(softbank)$/,"suffix":"softbank"}],"software":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(software)$/,"suffix":"software"}],"sohu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sohu)$/,"suffix":"sohu"}],"solar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(solar)$/,"suffix":"solar"}],"solutions":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(solutions)$/,"suffix":"solutions"}],"song":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(song)$/,"suffix":"song"}],"sony":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sony)$/,"suffix":"sony"}],"soy":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(soy)$/,"suffix":"soy"}],"space":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(space)$/,"suffix":"space"}],"spiegel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(spiegel)$/,"suffix":"spiegel"}],"spot":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(spot)$/,"suffix":"spot"}],"spreadbetting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(spreadbetting)$/,"suffix":"spreadbetting"}],"sr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sr)$/,"suffix":"sr"}],"srl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(srl)$/,"suffix":"srl"}],"srt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(srt)$/,"suffix":"srt"}],"st":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.st)$/,"suffix":"co.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.st)$/,"suffix":"com.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(consulado\.st)$/,"suffix":"consulado.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.st)$/,"suffix":"edu.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(embaixada\.st)$/,"suffix":"embaixada.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.st)$/,"suffix":"gov.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.st)$/,"suffix":"mil.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.st)$/,"suffix":"net.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.st)$/,"suffix":"org.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(principe\.st)$/,"suffix":"principe.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(saotome\.st)$/,"suffix":"saotome.st"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(store\.st)$/,"suffix":"store.st"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(st)$/,"suffix":"st"}],"stada":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(stada)$/,"suffix":"stada"}],"staples":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(staples)$/,"suffix":"staples"}],"star":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(star)$/,"suffix":"star"}],"starhub":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(starhub)$/,"suffix":"starhub"}],"statebank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(statebank)$/,"suffix":"statebank"}],"statefarm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(statefarm)$/,"suffix":"statefarm"}],"statoil":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(statoil)$/,"suffix":"statoil"}],"stc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(stc)$/,"suffix":"stc"}],"stcgroup":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(stcgroup)$/,"suffix":"stcgroup"}],"stockholm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(stockholm)$/,"suffix":"stockholm"}],"storage":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(storage)$/,"suffix":"storage"}],"store":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(store)$/,"suffix":"store"}],"studio":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(studio)$/,"suffix":"studio"}],"study":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(study)$/,"suffix":"study"}],"style":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(style)$/,"suffix":"style"}],"su":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(adygeya\.su)$/,"suffix":"adygeya.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arkhangelsk\.su)$/,"suffix":"arkhangelsk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(balashov\.su)$/,"suffix":"balashov.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bashkiria\.su)$/,"suffix":"bashkiria.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bryansk\.su)$/,"suffix":"bryansk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dagestan\.su)$/,"suffix":"dagestan.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grozny\.su)$/,"suffix":"grozny.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ivanovo\.su)$/,"suffix":"ivanovo.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kalmykia\.su)$/,"suffix":"kalmykia.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kaluga\.su)$/,"suffix":"kaluga.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(karelia\.su)$/,"suffix":"karelia.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khakassia\.su)$/,"suffix":"khakassia.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krasnodar\.su)$/,"suffix":"krasnodar.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kurgan\.su)$/,"suffix":"kurgan.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lenug\.su)$/,"suffix":"lenug.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mordovia\.su)$/,"suffix":"mordovia.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(msk\.su)$/,"suffix":"msk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(murmansk\.su)$/,"suffix":"murmansk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nalchik\.su)$/,"suffix":"nalchik.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nov\.su)$/,"suffix":"nov.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(obninsk\.su)$/,"suffix":"obninsk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(penza\.su)$/,"suffix":"penza.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pokrovsk\.su)$/,"suffix":"pokrovsk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sochi\.su)$/,"suffix":"sochi.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(spb\.su)$/,"suffix":"spb.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(togliatti\.su)$/,"suffix":"togliatti.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(troitsk\.su)$/,"suffix":"troitsk.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tula\.su)$/,"suffix":"tula.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tuva\.su)$/,"suffix":"tuva.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vladikavkaz\.su)$/,"suffix":"vladikavkaz.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vladimir\.su)$/,"suffix":"vladimir.su"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vologda\.su)$/,"suffix":"vologda.su"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(su)$/,"suffix":"su"}],"sucks":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sucks)$/,"suffix":"sucks"}],"supersport":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(supersport)$/,"suffix":"supersport"}],"supplies":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(supplies)$/,"suffix":"supplies"}],"supply":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(supply)$/,"suffix":"supply"}],"support":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(support)$/,"suffix":"support"}],"surf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(surf)$/,"suffix":"surf"}],"surgery":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(surgery)$/,"suffix":"surgery"}],"suzuki":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(suzuki)$/,"suffix":"suzuki"}],"sv":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sv)$/,"suffix":"com.sv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sv)$/,"suffix":"edu.sv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.sv)$/,"suffix":"gob.sv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sv)$/,"suffix":"org.sv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(red\.sv)$/,"suffix":"red.sv"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sv)$/,"suffix":"sv"}],"swatch":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(swatch)$/,"suffix":"swatch"}],"swiftcover":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(swiftcover)$/,"suffix":"swiftcover"}],"swiss":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(swiss)$/,"suffix":"swiss"}],"sx":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sx)$/,"suffix":"gov.sx"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sx)$/,"suffix":"sx"}],"sy":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.sy)$/,"suffix":"com.sy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.sy)$/,"suffix":"edu.sy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.sy)$/,"suffix":"gov.sy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.sy)$/,"suffix":"mil.sy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.sy)$/,"suffix":"net.sy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sy)$/,"suffix":"org.sy"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sy)$/,"suffix":"sy"}],"sydney":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sydney)$/,"suffix":"sydney"}],"symantec":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(symantec)$/,"suffix":"symantec"}],"systems":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(systems)$/,"suffix":"systems"}],"sz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.sz)$/,"suffix":"ac.sz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.sz)$/,"suffix":"co.sz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.sz)$/,"suffix":"org.sz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(sz)$/,"suffix":"sz"}],"tab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tab)$/,"suffix":"tab"}],"taipei":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(taipei)$/,"suffix":"taipei"}],"talk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(talk)$/,"suffix":"talk"}],"taobao":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(taobao)$/,"suffix":"taobao"}],"target":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(target)$/,"suffix":"target"}],"tatamotors":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatamotors)$/,"suffix":"tatamotors"}],"tatar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tatar)$/,"suffix":"tatar"}],"tattoo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tattoo)$/,"suffix":"tattoo"}],"tax":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tax)$/,"suffix":"tax"}],"taxi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(taxi)$/,"suffix":"taxi"}],"tc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tc)$/,"suffix":"tc"}],"tci":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tci)$/,"suffix":"tci"}],"td":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.td)$/,"suffix":"blogspot.td"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(td)$/,"suffix":"td"}],"tdk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tdk)$/,"suffix":"tdk"}],"team":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(team)$/,"suffix":"team"}],"tech":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tech)$/,"suffix":"tech"}],"technology":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(technology)$/,"suffix":"technology"}],"tel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tel)$/,"suffix":"tel"}],"telecity":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(telecity)$/,"suffix":"telecity"}],"telefonica":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(telefonica)$/,"suffix":"telefonica"}],"temasek":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(temasek)$/,"suffix":"temasek"}],"tennis":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tennis)$/,"suffix":"tennis"}],"teva":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(teva)$/,"suffix":"teva"}],"tf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tf)$/,"suffix":"tf"}],"tg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tg)$/,"suffix":"tg"}],"th":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.th)$/,"suffix":"ac.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.th)$/,"suffix":"co.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.th)$/,"suffix":"go.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.th)$/,"suffix":"in.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mi\.th)$/,"suffix":"mi.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.th)$/,"suffix":"net.th"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.th)$/,"suffix":"or.th"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(th)$/,"suffix":"th"}],"thd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(thd)$/,"suffix":"thd"}],"theater":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(theater)$/,"suffix":"theater"}],"theatre":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(theatre)$/,"suffix":"theatre"}],"theguardian":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(theguardian)$/,"suffix":"theguardian"}],"tiaa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tiaa)$/,"suffix":"tiaa"}],"tickets":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tickets)$/,"suffix":"tickets"}],"tienda":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tienda)$/,"suffix":"tienda"}],"tiffany":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tiffany)$/,"suffix":"tiffany"}],"tips":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tips)$/,"suffix":"tips"}],"tires":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tires)$/,"suffix":"tires"}],"tirol":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tirol)$/,"suffix":"tirol"}],"tj":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.tj)$/,"suffix":"ac.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.tj)$/,"suffix":"biz.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.tj)$/,"suffix":"co.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tj)$/,"suffix":"com.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.tj)$/,"suffix":"edu.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.tj)$/,"suffix":"go.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tj)$/,"suffix":"gov.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.tj)$/,"suffix":"int.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.tj)$/,"suffix":"mil.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.tj)$/,"suffix":"name.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tj)$/,"suffix":"net.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nic\.tj)$/,"suffix":"nic.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tj)$/,"suffix":"org.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(test\.tj)$/,"suffix":"test.tj"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.tj)$/,"suffix":"web.tj"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tj)$/,"suffix":"tj"}],"tjmaxx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tjmaxx)$/,"suffix":"tjmaxx"}],"tjx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tjx)$/,"suffix":"tjx"}],"tk":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tk)$/,"suffix":"tk"}],"tkmaxx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tkmaxx)$/,"suffix":"tkmaxx"}],"tl":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tl)$/,"suffix":"gov.tl"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tl)$/,"suffix":"tl"}],"tm":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.tm)$/,"suffix":"co.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tm)$/,"suffix":"com.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.tm)$/,"suffix":"edu.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tm)$/,"suffix":"gov.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.tm)$/,"suffix":"mil.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tm)$/,"suffix":"net.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.tm)$/,"suffix":"nom.tm"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tm)$/,"suffix":"org.tm"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm)$/,"suffix":"tm"}],"tmall":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tmall)$/,"suffix":"tmall"}],"tn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agrinet\.tn)$/,"suffix":"agrinet.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tn)$/,"suffix":"com.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(defense\.tn)$/,"suffix":"defense.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edunet\.tn)$/,"suffix":"edunet.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ens\.tn)$/,"suffix":"ens.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fin\.tn)$/,"suffix":"fin.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tn)$/,"suffix":"gov.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ind\.tn)$/,"suffix":"ind.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.tn)$/,"suffix":"info.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(intl\.tn)$/,"suffix":"intl.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mincom\.tn)$/,"suffix":"mincom.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nat\.tn)$/,"suffix":"nat.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tn)$/,"suffix":"net.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tn)$/,"suffix":"org.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(perso\.tn)$/,"suffix":"perso.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rnrt\.tn)$/,"suffix":"rnrt.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rns\.tn)$/,"suffix":"rns.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rnu\.tn)$/,"suffix":"rnu.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tourism\.tn)$/,"suffix":"tourism.tn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(turen\.tn)$/,"suffix":"turen.tn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tn)$/,"suffix":"tn"}],"to":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.to)$/,"suffix":"com.to"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.to)$/,"suffix":"edu.to"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.to)$/,"suffix":"gov.to"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.to)$/,"suffix":"mil.to"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.to)$/,"suffix":"net.to"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.to)$/,"suffix":"org.to"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(to)$/,"suffix":"to"}],"today":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(today)$/,"suffix":"today"}],"tokyo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tokyo)$/,"suffix":"tokyo"}],"tools":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tools)$/,"suffix":"tools"}],"top":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(top)$/,"suffix":"top"}],"toray":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(toray)$/,"suffix":"toray"}],"toshiba":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(toshiba)$/,"suffix":"toshiba"}],"total":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(total)$/,"suffix":"total"}],"tours":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tours)$/,"suffix":"tours"}],"town":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(town)$/,"suffix":"town"}],"toyota":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(toyota)$/,"suffix":"toyota"}],"toys":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(toys)$/,"suffix":"toys"}],"tr":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.tr)$/,"suffix":"blogspot.com.tr"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.nc\.tr)$/,"suffix":"gov.nc.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(av\.tr)$/,"suffix":"av.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bbs\.tr)$/,"suffix":"bbs.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(bel\.tr)$/,"suffix":"bel.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.tr)$/,"suffix":"biz.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tr)$/,"suffix":"com.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dr\.tr)$/,"suffix":"dr.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.tr)$/,"suffix":"edu.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gen\.tr)$/,"suffix":"gen.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tr)$/,"suffix":"gov.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.tr)$/,"suffix":"info.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.tr)$/,"suffix":"k12.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kep\.tr)$/,"suffix":"kep.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.tr)$/,"suffix":"mil.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.tr)$/,"suffix":"name.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nc\.tr)$/,"suffix":"nc.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tr)$/,"suffix":"net.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tr)$/,"suffix":"org.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pol\.tr)$/,"suffix":"pol.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tel\.tr)$/,"suffix":"tel.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.tr)$/,"suffix":"tv.tr"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.tr)$/,"suffix":"web.tr"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tr)$/,"suffix":"tr"}],"trade":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(trade)$/,"suffix":"trade"}],"trading":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(trading)$/,"suffix":"trading"}],"training":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(training)$/,"suffix":"training"}],"travel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(travel)$/,"suffix":"travel"}],"travelchannel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(travelchannel)$/,"suffix":"travelchannel"}],"travelers":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(travelers)$/,"suffix":"travelers"}],"travelersinsurance":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(travelersinsurance)$/,"suffix":"travelersinsurance"}],"trust":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(trust)$/,"suffix":"trust"}],"trv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(trv)$/,"suffix":"trv"}],"tt":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(aero\.tt)$/,"suffix":"aero.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.tt)$/,"suffix":"biz.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.tt)$/,"suffix":"co.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tt)$/,"suffix":"com.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(coop\.tt)$/,"suffix":"coop.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.tt)$/,"suffix":"edu.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tt)$/,"suffix":"gov.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.tt)$/,"suffix":"info.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.tt)$/,"suffix":"int.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(jobs\.tt)$/,"suffix":"jobs.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi\.tt)$/,"suffix":"mobi.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(museum\.tt)$/,"suffix":"museum.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.tt)$/,"suffix":"name.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tt)$/,"suffix":"net.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tt)$/,"suffix":"org.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.tt)$/,"suffix":"pro.tt"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(travel\.tt)$/,"suffix":"travel.tt"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tt)$/,"suffix":"tt"}],"tube":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tube)$/,"suffix":"tube"}],"tui":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tui)$/,"suffix":"tui"}],"tunes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tunes)$/,"suffix":"tunes"}],"tushu":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tushu)$/,"suffix":"tushu"}],"tv":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(better-than\.tv)$/,"suffix":"better-than.tv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns\.tv)$/,"suffix":"dyndns.tv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(on-the-web\.tv)$/,"suffix":"on-the-web.tv"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(worse-than\.tv)$/,"suffix":"worse-than.tv"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv)$/,"suffix":"tv"}],"tvs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tvs)$/,"suffix":"tvs"}],"tw":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.tw)$/,"suffix":"blogspot.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(club\.tw)$/,"suffix":"club.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.tw)$/,"suffix":"com.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ebiz\.tw)$/,"suffix":"ebiz.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.tw)$/,"suffix":"edu.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(game\.tw)$/,"suffix":"game.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.tw)$/,"suffix":"gov.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(idv\.tw)$/,"suffix":"idv.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.tw)$/,"suffix":"mil.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.tw)$/,"suffix":"net.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.tw)$/,"suffix":"org.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--czrw28b\.tw)$/,"suffix":"xn--czrw28b.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--uc0atv\.tw)$/,"suffix":"xn--uc0atv.tw"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--zf0ao64a\.tw)$/,"suffix":"xn--zf0ao64a.tw"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tw)$/,"suffix":"tw"}],"tz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.tz)$/,"suffix":"ac.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.tz)$/,"suffix":"co.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.tz)$/,"suffix":"go.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hotel\.tz)$/,"suffix":"hotel.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.tz)$/,"suffix":"info.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(me\.tz)$/,"suffix":"me.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.tz)$/,"suffix":"mil.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mobi\.tz)$/,"suffix":"mobi.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.tz)$/,"suffix":"ne.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.tz)$/,"suffix":"or.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc\.tz)$/,"suffix":"sc.tz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tv\.tz)$/,"suffix":"tv.tz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(tz)$/,"suffix":"tz"}],"ua":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.ua)$/,"suffix":"biz.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cherkassy\.ua)$/,"suffix":"cherkassy.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cherkasy\.ua)$/,"suffix":"cherkasy.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chernigov\.ua)$/,"suffix":"chernigov.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chernihiv\.ua)$/,"suffix":"chernihiv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chernivtsi\.ua)$/,"suffix":"chernivtsi.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(chernovtsy\.ua)$/,"suffix":"chernovtsy.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ck\.ua)$/,"suffix":"ck.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cn\.ua)$/,"suffix":"cn.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ua)$/,"suffix":"co.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ua)$/,"suffix":"com.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cr\.ua)$/,"suffix":"cr.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(crimea\.ua)$/,"suffix":"crimea.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(cv\.ua)$/,"suffix":"cv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dn\.ua)$/,"suffix":"dn.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnepropetrovsk\.ua)$/,"suffix":"dnepropetrovsk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dnipropetrovsk\.ua)$/,"suffix":"dnipropetrovsk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dominic\.ua)$/,"suffix":"dominic.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(donetsk\.ua)$/,"suffix":"donetsk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dp\.ua)$/,"suffix":"dp.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ua)$/,"suffix":"edu.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ua)$/,"suffix":"gov.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(if\.ua)$/,"suffix":"if.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.ua)$/,"suffix":"in.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ivano-frankivsk\.ua)$/,"suffix":"ivano-frankivsk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kh\.ua)$/,"suffix":"kh.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kharkiv\.ua)$/,"suffix":"kharkiv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kharkov\.ua)$/,"suffix":"kharkov.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kherson\.ua)$/,"suffix":"kherson.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khmelnitskiy\.ua)$/,"suffix":"khmelnitskiy.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(khmelnytskyi\.ua)$/,"suffix":"khmelnytskyi.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kiev\.ua)$/,"suffix":"kiev.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kirovograd\.ua)$/,"suffix":"kirovograd.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(km\.ua)$/,"suffix":"km.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kr\.ua)$/,"suffix":"kr.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(krym\.ua)$/,"suffix":"krym.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ks\.ua)$/,"suffix":"ks.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kv\.ua)$/,"suffix":"kv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kyiv\.ua)$/,"suffix":"kyiv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lg\.ua)$/,"suffix":"lg.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lt\.ua)$/,"suffix":"lt.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lugansk\.ua)$/,"suffix":"lugansk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lutsk\.ua)$/,"suffix":"lutsk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lv\.ua)$/,"suffix":"lv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(lviv\.ua)$/,"suffix":"lviv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mk\.ua)$/,"suffix":"mk.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mykolaiv\.ua)$/,"suffix":"mykolaiv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ua)$/,"suffix":"net.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nikolaev\.ua)$/,"suffix":"nikolaev.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(od\.ua)$/,"suffix":"od.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(odesa\.ua)$/,"suffix":"odesa.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(odessa\.ua)$/,"suffix":"odessa.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ua)$/,"suffix":"org.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pl\.ua)$/,"suffix":"pl.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(poltava\.ua)$/,"suffix":"poltava.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pp\.ua)$/,"suffix":"pp.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rivne\.ua)$/,"suffix":"rivne.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rovno\.ua)$/,"suffix":"rovno.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rv\.ua)$/,"suffix":"rv.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sb\.ua)$/,"suffix":"sb.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sebastopol\.ua)$/,"suffix":"sebastopol.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sevastopol\.ua)$/,"suffix":"sevastopol.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sm\.ua)$/,"suffix":"sm.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sumy\.ua)$/,"suffix":"sumy.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(te\.ua)$/,"suffix":"te.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ternopil\.ua)$/,"suffix":"ternopil.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uz\.ua)$/,"suffix":"uz.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(uzhgorod\.ua)$/,"suffix":"uzhgorod.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vinnica\.ua)$/,"suffix":"vinnica.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vinnytsia\.ua)$/,"suffix":"vinnytsia.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vn\.ua)$/,"suffix":"vn.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(volyn\.ua)$/,"suffix":"volyn.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(yalta\.ua)$/,"suffix":"yalta.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zaporizhzhe\.ua)$/,"suffix":"zaporizhzhe.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zaporizhzhia\.ua)$/,"suffix":"zaporizhzhia.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zhitomir\.ua)$/,"suffix":"zhitomir.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zhytomyr\.ua)$/,"suffix":"zhytomyr.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zp\.ua)$/,"suffix":"zp.ua"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(zt\.ua)$/,"suffix":"zt.ua"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ua)$/,"suffix":"ua"}],"ubank":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ubank)$/,"suffix":"ubank"}],"ubs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ubs)$/,"suffix":"ubs"}],"uconnect":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uconnect)$/,"suffix":"uconnect"}],"ug":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.ug)$/,"suffix":"ac.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.ug)$/,"suffix":"blogspot.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ug)$/,"suffix":"co.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ug)$/,"suffix":"com.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(go\.ug)$/,"suffix":"go.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.ug)$/,"suffix":"ne.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.ug)$/,"suffix":"or.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ug)$/,"suffix":"org.ug"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc\.ug)$/,"suffix":"sc.ug"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ug)$/,"suffix":"ug"}],"uk":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.uk)$/,"suffix":"blogspot.co.uk"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(service\.gov\.uk)$/,"suffix":"service.gov.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.uk)$/,"suffix":"ac.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.uk)$/,"suffix":"co.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.uk)$/,"suffix":"gov.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ltd\.uk)$/,"suffix":"ltd.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(me\.uk)$/,"suffix":"me.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.uk)$/,"suffix":"net.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nhs\.uk)$/,"suffix":"nhs.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.uk)$/,"suffix":"org.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(plc\.uk)$/,"suffix":"plc.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(police\.uk)$/,"suffix":"police.uk"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.sch\.uk)$/,"suffix":"sch.uk"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uk)$/,"suffix":"uk"}],"unicom":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(unicom)$/,"suffix":"unicom"}],"university":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(university)$/,"suffix":"university"}],"uno":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uno)$/,"suffix":"uno"}],"uol":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uol)$/,"suffix":"uol"}],"ups":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ups)$/,"suffix":"ups"}],"us":[{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(chtr\.k12\.ma\.us)$/,"suffix":"chtr.k12.ma.us"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(paroch\.k12\.ma\.us)$/,"suffix":"paroch.k12.ma.us"},{"level":5,"pattern":/^(?:(.+)\.)?([^.]+)\.(pvt\.k12\.ma\.us)$/,"suffix":"pvt.k12.ma.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ak\.us)$/,"suffix":"cc.ak.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.al\.us)$/,"suffix":"cc.al.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ar\.us)$/,"suffix":"cc.ar.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.as\.us)$/,"suffix":"cc.as.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.az\.us)$/,"suffix":"cc.az.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ca\.us)$/,"suffix":"cc.ca.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.co\.us)$/,"suffix":"cc.co.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ct\.us)$/,"suffix":"cc.ct.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.dc\.us)$/,"suffix":"cc.dc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.de\.us)$/,"suffix":"cc.de.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.fl\.us)$/,"suffix":"cc.fl.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ga\.us)$/,"suffix":"cc.ga.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.gu\.us)$/,"suffix":"cc.gu.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.hi\.us)$/,"suffix":"cc.hi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ia\.us)$/,"suffix":"cc.ia.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.id\.us)$/,"suffix":"cc.id.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.il\.us)$/,"suffix":"cc.il.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.in\.us)$/,"suffix":"cc.in.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ks\.us)$/,"suffix":"cc.ks.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ky\.us)$/,"suffix":"cc.ky.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.la\.us)$/,"suffix":"cc.la.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ma\.us)$/,"suffix":"cc.ma.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.md\.us)$/,"suffix":"cc.md.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.me\.us)$/,"suffix":"cc.me.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.mi\.us)$/,"suffix":"cc.mi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.mn\.us)$/,"suffix":"cc.mn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.mo\.us)$/,"suffix":"cc.mo.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ms\.us)$/,"suffix":"cc.ms.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.mt\.us)$/,"suffix":"cc.mt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nc\.us)$/,"suffix":"cc.nc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nd\.us)$/,"suffix":"cc.nd.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ne\.us)$/,"suffix":"cc.ne.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nh\.us)$/,"suffix":"cc.nh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nj\.us)$/,"suffix":"cc.nj.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nm\.us)$/,"suffix":"cc.nm.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.nv\.us)$/,"suffix":"cc.nv.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ny\.us)$/,"suffix":"cc.ny.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.oh\.us)$/,"suffix":"cc.oh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ok\.us)$/,"suffix":"cc.ok.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.or\.us)$/,"suffix":"cc.or.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.pa\.us)$/,"suffix":"cc.pa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.pr\.us)$/,"suffix":"cc.pr.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ri\.us)$/,"suffix":"cc.ri.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.sc\.us)$/,"suffix":"cc.sc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.sd\.us)$/,"suffix":"cc.sd.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.tn\.us)$/,"suffix":"cc.tn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.tx\.us)$/,"suffix":"cc.tx.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.ut\.us)$/,"suffix":"cc.ut.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.va\.us)$/,"suffix":"cc.va.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.vi\.us)$/,"suffix":"cc.vi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.vt\.us)$/,"suffix":"cc.vt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.wa\.us)$/,"suffix":"cc.wa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.wi\.us)$/,"suffix":"cc.wi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.wv\.us)$/,"suffix":"cc.wv.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(cc\.wy\.us)$/,"suffix":"cc.wy.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ak\.us)$/,"suffix":"k12.ak.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.al\.us)$/,"suffix":"k12.al.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ar\.us)$/,"suffix":"k12.ar.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.as\.us)$/,"suffix":"k12.as.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.az\.us)$/,"suffix":"k12.az.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ca\.us)$/,"suffix":"k12.ca.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.co\.us)$/,"suffix":"k12.co.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ct\.us)$/,"suffix":"k12.ct.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.dc\.us)$/,"suffix":"k12.dc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.de\.us)$/,"suffix":"k12.de.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.fl\.us)$/,"suffix":"k12.fl.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ga\.us)$/,"suffix":"k12.ga.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.gu\.us)$/,"suffix":"k12.gu.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ia\.us)$/,"suffix":"k12.ia.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.id\.us)$/,"suffix":"k12.id.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.il\.us)$/,"suffix":"k12.il.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.in\.us)$/,"suffix":"k12.in.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ks\.us)$/,"suffix":"k12.ks.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ky\.us)$/,"suffix":"k12.ky.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.la\.us)$/,"suffix":"k12.la.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ma\.us)$/,"suffix":"k12.ma.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.md\.us)$/,"suffix":"k12.md.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.me\.us)$/,"suffix":"k12.me.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.mi\.us)$/,"suffix":"k12.mi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.mn\.us)$/,"suffix":"k12.mn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.mo\.us)$/,"suffix":"k12.mo.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ms\.us)$/,"suffix":"k12.ms.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.mt\.us)$/,"suffix":"k12.mt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.nc\.us)$/,"suffix":"k12.nc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ne\.us)$/,"suffix":"k12.ne.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.nh\.us)$/,"suffix":"k12.nh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.nj\.us)$/,"suffix":"k12.nj.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.nm\.us)$/,"suffix":"k12.nm.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.nv\.us)$/,"suffix":"k12.nv.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ny\.us)$/,"suffix":"k12.ny.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.oh\.us)$/,"suffix":"k12.oh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ok\.us)$/,"suffix":"k12.ok.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.or\.us)$/,"suffix":"k12.or.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.pa\.us)$/,"suffix":"k12.pa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.pr\.us)$/,"suffix":"k12.pr.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ri\.us)$/,"suffix":"k12.ri.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.sc\.us)$/,"suffix":"k12.sc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.tn\.us)$/,"suffix":"k12.tn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.tx\.us)$/,"suffix":"k12.tx.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.ut\.us)$/,"suffix":"k12.ut.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.va\.us)$/,"suffix":"k12.va.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.vi\.us)$/,"suffix":"k12.vi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.vt\.us)$/,"suffix":"k12.vt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.wa\.us)$/,"suffix":"k12.wa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.wi\.us)$/,"suffix":"k12.wi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.wy\.us)$/,"suffix":"k12.wy.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ak\.us)$/,"suffix":"lib.ak.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.al\.us)$/,"suffix":"lib.al.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ar\.us)$/,"suffix":"lib.ar.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.as\.us)$/,"suffix":"lib.as.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.az\.us)$/,"suffix":"lib.az.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ca\.us)$/,"suffix":"lib.ca.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.co\.us)$/,"suffix":"lib.co.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ct\.us)$/,"suffix":"lib.ct.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.dc\.us)$/,"suffix":"lib.dc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.de\.us)$/,"suffix":"lib.de.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.fl\.us)$/,"suffix":"lib.fl.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ga\.us)$/,"suffix":"lib.ga.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.gu\.us)$/,"suffix":"lib.gu.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.hi\.us)$/,"suffix":"lib.hi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ia\.us)$/,"suffix":"lib.ia.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.id\.us)$/,"suffix":"lib.id.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.il\.us)$/,"suffix":"lib.il.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.in\.us)$/,"suffix":"lib.in.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ks\.us)$/,"suffix":"lib.ks.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ky\.us)$/,"suffix":"lib.ky.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.la\.us)$/,"suffix":"lib.la.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ma\.us)$/,"suffix":"lib.ma.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.md\.us)$/,"suffix":"lib.md.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.me\.us)$/,"suffix":"lib.me.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.mi\.us)$/,"suffix":"lib.mi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.mn\.us)$/,"suffix":"lib.mn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.mo\.us)$/,"suffix":"lib.mo.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ms\.us)$/,"suffix":"lib.ms.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.mt\.us)$/,"suffix":"lib.mt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nc\.us)$/,"suffix":"lib.nc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nd\.us)$/,"suffix":"lib.nd.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ne\.us)$/,"suffix":"lib.ne.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nh\.us)$/,"suffix":"lib.nh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nj\.us)$/,"suffix":"lib.nj.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nm\.us)$/,"suffix":"lib.nm.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.nv\.us)$/,"suffix":"lib.nv.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ny\.us)$/,"suffix":"lib.ny.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.oh\.us)$/,"suffix":"lib.oh.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ok\.us)$/,"suffix":"lib.ok.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.or\.us)$/,"suffix":"lib.or.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.pa\.us)$/,"suffix":"lib.pa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.pr\.us)$/,"suffix":"lib.pr.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ri\.us)$/,"suffix":"lib.ri.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.sc\.us)$/,"suffix":"lib.sc.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.sd\.us)$/,"suffix":"lib.sd.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.tn\.us)$/,"suffix":"lib.tn.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.tx\.us)$/,"suffix":"lib.tx.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.ut\.us)$/,"suffix":"lib.ut.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.va\.us)$/,"suffix":"lib.va.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.vi\.us)$/,"suffix":"lib.vi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.vt\.us)$/,"suffix":"lib.vt.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.wa\.us)$/,"suffix":"lib.wa.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.wi\.us)$/,"suffix":"lib.wi.us"},{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(lib\.wy\.us)$/,"suffix":"lib.wy.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ak\.us)$/,"suffix":"ak.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(al\.us)$/,"suffix":"al.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ar\.us)$/,"suffix":"ar.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(as\.us)$/,"suffix":"as.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(az\.us)$/,"suffix":"az.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ca\.us)$/,"suffix":"ca.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.us)$/,"suffix":"co.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ct\.us)$/,"suffix":"ct.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dc\.us)$/,"suffix":"dc.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(de\.us)$/,"suffix":"de.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dni\.us)$/,"suffix":"dni.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fed\.us)$/,"suffix":"fed.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(fl\.us)$/,"suffix":"fl.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ga\.us)$/,"suffix":"ga.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gu\.us)$/,"suffix":"gu.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(hi\.us)$/,"suffix":"hi.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ia\.us)$/,"suffix":"ia.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(id\.us)$/,"suffix":"id.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(il\.us)$/,"suffix":"il.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(in\.us)$/,"suffix":"in.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(is-by\.us)$/,"suffix":"is-by.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(isa\.us)$/,"suffix":"isa.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(kids\.us)$/,"suffix":"kids.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ks\.us)$/,"suffix":"ks.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ky\.us)$/,"suffix":"ky.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(la\.us)$/,"suffix":"la.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(land-4-sale\.us)$/,"suffix":"land-4-sale.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ma\.us)$/,"suffix":"ma.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(md\.us)$/,"suffix":"md.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(me\.us)$/,"suffix":"me.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mi\.us)$/,"suffix":"mi.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mn\.us)$/,"suffix":"mn.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mo\.us)$/,"suffix":"mo.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ms\.us)$/,"suffix":"ms.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mt\.us)$/,"suffix":"mt.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nc\.us)$/,"suffix":"nc.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nd\.us)$/,"suffix":"nd.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ne\.us)$/,"suffix":"ne.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nh\.us)$/,"suffix":"nh.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nj\.us)$/,"suffix":"nj.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nm\.us)$/,"suffix":"nm.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nsn\.us)$/,"suffix":"nsn.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nv\.us)$/,"suffix":"nv.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ny\.us)$/,"suffix":"ny.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(oh\.us)$/,"suffix":"oh.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ok\.us)$/,"suffix":"ok.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(or\.us)$/,"suffix":"or.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pa\.us)$/,"suffix":"pa.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pr\.us)$/,"suffix":"pr.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ri\.us)$/,"suffix":"ri.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sc\.us)$/,"suffix":"sc.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(sd\.us)$/,"suffix":"sd.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(stuff-4-sale\.us)$/,"suffix":"stuff-4-sale.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tn\.us)$/,"suffix":"tn.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tx\.us)$/,"suffix":"tx.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ut\.us)$/,"suffix":"ut.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(va\.us)$/,"suffix":"va.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vi\.us)$/,"suffix":"vi.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(vt\.us)$/,"suffix":"vt.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wa\.us)$/,"suffix":"wa.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wi\.us)$/,"suffix":"wi.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wv\.us)$/,"suffix":"wv.us"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(wy\.us)$/,"suffix":"wy.us"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(us)$/,"suffix":"us"}],"uy":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.com\.uy)$/,"suffix":"blogspot.com.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.uy)$/,"suffix":"com.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.uy)$/,"suffix":"edu.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gub\.uy)$/,"suffix":"gub.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.uy)$/,"suffix":"mil.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.uy)$/,"suffix":"net.uy"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.uy)$/,"suffix":"org.uy"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uy)$/,"suffix":"uy"}],"uz":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.uz)$/,"suffix":"co.uz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.uz)$/,"suffix":"com.uz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.uz)$/,"suffix":"net.uz"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.uz)$/,"suffix":"org.uz"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(uz)$/,"suffix":"uz"}],"va":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(va)$/,"suffix":"va"}],"vacations":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vacations)$/,"suffix":"vacations"}],"vana":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vana)$/,"suffix":"vana"}],"vanguard":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vanguard)$/,"suffix":"vanguard"}],"vc":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.vc)$/,"suffix":"com.vc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.vc)$/,"suffix":"edu.vc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.vc)$/,"suffix":"gov.vc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.vc)$/,"suffix":"mil.vc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.vc)$/,"suffix":"net.vc"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.vc)$/,"suffix":"org.vc"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vc)$/,"suffix":"vc"}],"ve":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(arts\.ve)$/,"suffix":"arts.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.ve)$/,"suffix":"co.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ve)$/,"suffix":"com.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(e12\.ve)$/,"suffix":"e12.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ve)$/,"suffix":"edu.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(firm\.ve)$/,"suffix":"firm.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gob\.ve)$/,"suffix":"gob.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ve)$/,"suffix":"gov.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.ve)$/,"suffix":"info.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.ve)$/,"suffix":"int.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.ve)$/,"suffix":"mil.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ve)$/,"suffix":"net.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ve)$/,"suffix":"org.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(rec\.ve)$/,"suffix":"rec.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(store\.ve)$/,"suffix":"store.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tec\.ve)$/,"suffix":"tec.ve"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.ve)$/,"suffix":"web.ve"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ve)$/,"suffix":"ve"}],"vegas":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vegas)$/,"suffix":"vegas"}],"ventures":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ventures)$/,"suffix":"ventures"}],"verisign":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(verisign)$/,"suffix":"verisign"}],"versicherung":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(versicherung)$/,"suffix":"versicherung"}],"vet":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vet)$/,"suffix":"vet"}],"vg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vg)$/,"suffix":"vg"}],"vi":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.vi)$/,"suffix":"co.vi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.vi)$/,"suffix":"com.vi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(k12\.vi)$/,"suffix":"k12.vi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.vi)$/,"suffix":"net.vi"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.vi)$/,"suffix":"org.vi"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vi)$/,"suffix":"vi"}],"viajes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(viajes)$/,"suffix":"viajes"}],"video":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(video)$/,"suffix":"video"}],"vig":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vig)$/,"suffix":"vig"}],"viking":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(viking)$/,"suffix":"viking"}],"villas":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(villas)$/,"suffix":"villas"}],"vin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vin)$/,"suffix":"vin"}],"vip":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vip)$/,"suffix":"vip"}],"virgin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(virgin)$/,"suffix":"virgin"}],"visa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(visa)$/,"suffix":"visa"}],"vision":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vision)$/,"suffix":"vision"}],"vista":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vista)$/,"suffix":"vista"}],"vistaprint":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vistaprint)$/,"suffix":"vistaprint"}],"viva":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(viva)$/,"suffix":"viva"}],"vivo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vivo)$/,"suffix":"vivo"}],"vlaanderen":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vlaanderen)$/,"suffix":"vlaanderen"}],"vn":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.vn)$/,"suffix":"ac.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(biz\.vn)$/,"suffix":"biz.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.vn)$/,"suffix":"blogspot.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.vn)$/,"suffix":"com.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.vn)$/,"suffix":"edu.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.vn)$/,"suffix":"gov.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(health\.vn)$/,"suffix":"health.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(info\.vn)$/,"suffix":"info.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(int\.vn)$/,"suffix":"int.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(name\.vn)$/,"suffix":"name.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.vn)$/,"suffix":"net.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.vn)$/,"suffix":"org.vn"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(pro\.vn)$/,"suffix":"pro.vn"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vn)$/,"suffix":"vn"}],"vodka":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vodka)$/,"suffix":"vodka"}],"volkswagen":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(volkswagen)$/,"suffix":"volkswagen"}],"volvo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(volvo)$/,"suffix":"volvo"}],"vote":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vote)$/,"suffix":"vote"}],"voting":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(voting)$/,"suffix":"voting"}],"voto":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(voto)$/,"suffix":"voto"}],"voyage":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(voyage)$/,"suffix":"voyage"}],"vu":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.vu)$/,"suffix":"com.vu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.vu)$/,"suffix":"edu.vu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.vu)$/,"suffix":"net.vu"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.vu)$/,"suffix":"org.vu"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vu)$/,"suffix":"vu"}],"vuelos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(vuelos)$/,"suffix":"vuelos"}],"wales":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wales)$/,"suffix":"wales"}],"walmart":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(walmart)$/,"suffix":"walmart"}],"walter":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(walter)$/,"suffix":"walter"}],"wang":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wang)$/,"suffix":"wang"}],"wanggou":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wanggou)$/,"suffix":"wanggou"}],"warman":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(warman)$/,"suffix":"warman"}],"watch":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(watch)$/,"suffix":"watch"}],"watches":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(watches)$/,"suffix":"watches"}],"weather":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(weather)$/,"suffix":"weather"}],"weatherchannel":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(weatherchannel)$/,"suffix":"weatherchannel"}],"webcam":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(webcam)$/,"suffix":"webcam"}],"weber":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(weber)$/,"suffix":"weber"}],"website":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(website)$/,"suffix":"website"}],"wed":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wed)$/,"suffix":"wed"}],"wedding":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wedding)$/,"suffix":"wedding"}],"weibo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(weibo)$/,"suffix":"weibo"}],"weir":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(weir)$/,"suffix":"weir"}],"wf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wf)$/,"suffix":"wf"}],"whoswho":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(whoswho)$/,"suffix":"whoswho"}],"wien":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wien)$/,"suffix":"wien"}],"wiki":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wiki)$/,"suffix":"wiki"}],"williamhill":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(williamhill)$/,"suffix":"williamhill"}],"win":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(win)$/,"suffix":"win"}],"windows":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(windows)$/,"suffix":"windows"}],"wine":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wine)$/,"suffix":"wine"}],"winners":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(winners)$/,"suffix":"winners"}],"wme":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wme)$/,"suffix":"wme"}],"wolterskluwer":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wolterskluwer)$/,"suffix":"wolterskluwer"}],"woodside":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(woodside)$/,"suffix":"woodside"}],"work":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(work)$/,"suffix":"work"}],"works":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(works)$/,"suffix":"works"}],"world":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(world)$/,"suffix":"world"}],"wow":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wow)$/,"suffix":"wow"}],"ws":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(com\.ws)$/,"suffix":"com.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(dyndns\.ws)$/,"suffix":"dyndns.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.ws)$/,"suffix":"edu.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.ws)$/,"suffix":"gov.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mypets\.ws)$/,"suffix":"mypets.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.ws)$/,"suffix":"net.ws"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.ws)$/,"suffix":"org.ws"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(ws)$/,"suffix":"ws"}],"wtc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wtc)$/,"suffix":"wtc"}],"wtf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(wtf)$/,"suffix":"wtf"}],"xbox":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xbox)$/,"suffix":"xbox"}],"xerox":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xerox)$/,"suffix":"xerox"}],"xfinity":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xfinity)$/,"suffix":"xfinity"}],"xihuan":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xihuan)$/,"suffix":"xihuan"}],"xin":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xin)$/,"suffix":"xin"}],"xn--11b4c3d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--11b4c3d)$/,"suffix":"xn--11b4c3d"}],"xn--1ck2e1b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--1ck2e1b)$/,"suffix":"xn--1ck2e1b"}],"xn--1qqw23a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--1qqw23a)$/,"suffix":"xn--1qqw23a"}],"xn--30rr7y":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--30rr7y)$/,"suffix":"xn--30rr7y"}],"xn--3bst00m":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--3bst00m)$/,"suffix":"xn--3bst00m"}],"xn--3ds443g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--3ds443g)$/,"suffix":"xn--3ds443g"}],"xn--3e0b707e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--3e0b707e)$/,"suffix":"xn--3e0b707e"}],"xn--3oq18vl8pn36a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--3oq18vl8pn36a)$/,"suffix":"xn--3oq18vl8pn36a"}],"xn--3pxu8k":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--3pxu8k)$/,"suffix":"xn--3pxu8k"}],"xn--42c2d9a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--42c2d9a)$/,"suffix":"xn--42c2d9a"}],"xn--45brj9c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--45brj9c)$/,"suffix":"xn--45brj9c"}],"xn--45q11c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--45q11c)$/,"suffix":"xn--45q11c"}],"xn--4gbrim":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--4gbrim)$/,"suffix":"xn--4gbrim"}],"xn--4gq48lf9j":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--4gq48lf9j)$/,"suffix":"xn--4gq48lf9j"}],"xn--54b7fta0cc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--54b7fta0cc)$/,"suffix":"xn--54b7fta0cc"}],"xn--55qw42g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--55qw42g)$/,"suffix":"xn--55qw42g"}],"xn--55qx5d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--55qx5d)$/,"suffix":"xn--55qx5d"}],"xn--5su34j936bgsg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--5su34j936bgsg)$/,"suffix":"xn--5su34j936bgsg"}],"xn--5tzm5g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--5tzm5g)$/,"suffix":"xn--5tzm5g"}],"xn--6frz82g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--6frz82g)$/,"suffix":"xn--6frz82g"}],"xn--6qq986b3xl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--6qq986b3xl)$/,"suffix":"xn--6qq986b3xl"}],"xn--80adxhks":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80adxhks)$/,"suffix":"xn--80adxhks"}],"xn--80ao21a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80ao21a)$/,"suffix":"xn--80ao21a"}],"xn--80aqecdr1a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80aqecdr1a)$/,"suffix":"xn--80aqecdr1a"}],"xn--80asehdb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80asehdb)$/,"suffix":"xn--80asehdb"}],"xn--80aswg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80aswg)$/,"suffix":"xn--80aswg"}],"xn--8y0a063a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--8y0a063a)$/,"suffix":"xn--8y0a063a"}],"xn--90a3ac":[{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--80au\.xn--90a3ac)$/,"suffix":"xn--80au.xn--90a3ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--90azh\.xn--90a3ac)$/,"suffix":"xn--90azh.xn--90a3ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--c1avg\.xn--90a3ac)$/,"suffix":"xn--c1avg.xn--90a3ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--d1at\.xn--90a3ac)$/,"suffix":"xn--d1at.xn--90a3ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--o1ac\.xn--90a3ac)$/,"suffix":"xn--o1ac.xn--90a3ac"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--o1ach\.xn--90a3ac)$/,"suffix":"xn--o1ach.xn--90a3ac"},{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--90a3ac)$/,"suffix":"xn--90a3ac"}],"xn--90ais":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--90ais)$/,"suffix":"xn--90ais"}],"xn--9dbq2a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--9dbq2a)$/,"suffix":"xn--9dbq2a"}],"xn--9et52u":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--9et52u)$/,"suffix":"xn--9et52u"}],"xn--9krt00a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--9krt00a)$/,"suffix":"xn--9krt00a"}],"xn--b4w605ferd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--b4w605ferd)$/,"suffix":"xn--b4w605ferd"}],"xn--bck1b9a5dre4c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--bck1b9a5dre4c)$/,"suffix":"xn--bck1b9a5dre4c"}],"xn--c1avg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--c1avg)$/,"suffix":"xn--c1avg"}],"xn--c2br7g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--c2br7g)$/,"suffix":"xn--c2br7g"}],"xn--cck2b3b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--cck2b3b)$/,"suffix":"xn--cck2b3b"}],"xn--cg4bki":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--cg4bki)$/,"suffix":"xn--cg4bki"}],"xn--clchc0ea0b2g2a9gcd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--clchc0ea0b2g2a9gcd)$/,"suffix":"xn--clchc0ea0b2g2a9gcd"}],"xn--czr694b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--czr694b)$/,"suffix":"xn--czr694b"}],"xn--czrs0t":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--czrs0t)$/,"suffix":"xn--czrs0t"}],"xn--czru2d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--czru2d)$/,"suffix":"xn--czru2d"}],"xn--d1acj3b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--d1acj3b)$/,"suffix":"xn--d1acj3b"}],"xn--d1alf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--d1alf)$/,"suffix":"xn--d1alf"}],"xn--eckvdtc9d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--eckvdtc9d)$/,"suffix":"xn--eckvdtc9d"}],"xn--efvy88h":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--efvy88h)$/,"suffix":"xn--efvy88h"}],"xn--estv75g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--estv75g)$/,"suffix":"xn--estv75g"}],"xn--fct429k":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fct429k)$/,"suffix":"xn--fct429k"}],"xn--fhbei":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fhbei)$/,"suffix":"xn--fhbei"}],"xn--fiq228c5hs":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fiq228c5hs)$/,"suffix":"xn--fiq228c5hs"}],"xn--fiq64b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fiq64b)$/,"suffix":"xn--fiq64b"}],"xn--fiqs8s":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fiqs8s)$/,"suffix":"xn--fiqs8s"}],"xn--fiqz9s":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fiqz9s)$/,"suffix":"xn--fiqz9s"}],"xn--fjq720a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fjq720a)$/,"suffix":"xn--fjq720a"}],"xn--flw351e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--flw351e)$/,"suffix":"xn--flw351e"}],"xn--fpcrj9c3d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fpcrj9c3d)$/,"suffix":"xn--fpcrj9c3d"}],"xn--fzc2c9e2c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fzc2c9e2c)$/,"suffix":"xn--fzc2c9e2c"}],"xn--fzys8d69uvgm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--fzys8d69uvgm)$/,"suffix":"xn--fzys8d69uvgm"}],"xn--g2xx48c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--g2xx48c)$/,"suffix":"xn--g2xx48c"}],"xn--gckr3f0f":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gckr3f0f)$/,"suffix":"xn--gckr3f0f"}],"xn--gecrj9c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gecrj9c)$/,"suffix":"xn--gecrj9c"}],"xn--gk3at1e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--gk3at1e)$/,"suffix":"xn--gk3at1e"}],"xn--h2brj9c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--h2brj9c)$/,"suffix":"xn--h2brj9c"}],"xn--hxt814e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--hxt814e)$/,"suffix":"xn--hxt814e"}],"xn--i1b6b1a6a2e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--i1b6b1a6a2e)$/,"suffix":"xn--i1b6b1a6a2e"}],"xn--imr513n":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--imr513n)$/,"suffix":"xn--imr513n"}],"xn--io0a7i":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--io0a7i)$/,"suffix":"xn--io0a7i"}],"xn--j1aef":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--j1aef)$/,"suffix":"xn--j1aef"}],"xn--j1amh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--j1amh)$/,"suffix":"xn--j1amh"}],"xn--j6w193g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--j6w193g)$/,"suffix":"xn--j6w193g"}],"xn--jlq61u9w7b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--jlq61u9w7b)$/,"suffix":"xn--jlq61u9w7b"}],"xn--jvr189m":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--jvr189m)$/,"suffix":"xn--jvr189m"}],"xn--kcrx77d1x4a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kcrx77d1x4a)$/,"suffix":"xn--kcrx77d1x4a"}],"xn--kprw13d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kprw13d)$/,"suffix":"xn--kprw13d"}],"xn--kpry57d":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kpry57d)$/,"suffix":"xn--kpry57d"}],"xn--kpu716f":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kpu716f)$/,"suffix":"xn--kpu716f"}],"xn--kput3i":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--kput3i)$/,"suffix":"xn--kput3i"}],"xn--l1acc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--l1acc)$/,"suffix":"xn--l1acc"}],"xn--lgbbat1ad8j":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--lgbbat1ad8j)$/,"suffix":"xn--lgbbat1ad8j"}],"xn--mgb2ddes":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgb2ddes)$/,"suffix":"xn--mgb2ddes"}],"xn--mgb9awbf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgb9awbf)$/,"suffix":"xn--mgb9awbf"}],"xn--mgba3a3ejt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba3a3ejt)$/,"suffix":"xn--mgba3a3ejt"}],"xn--mgba3a4f16a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba3a4f16a)$/,"suffix":"xn--mgba3a4f16a"}],"xn--mgba3a4fra":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba3a4fra)$/,"suffix":"xn--mgba3a4fra"}],"xn--mgba7c0bbn0a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgba7c0bbn0a)$/,"suffix":"xn--mgba7c0bbn0a"}],"xn--mgbaakc7dvf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbaakc7dvf)$/,"suffix":"xn--mgbaakc7dvf"}],"xn--mgbaam7a8h":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbaam7a8h)$/,"suffix":"xn--mgbaam7a8h"}],"xn--mgbab2bd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbab2bd)$/,"suffix":"xn--mgbab2bd"}],"xn--mgbai9a5eva00b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbai9a5eva00b)$/,"suffix":"xn--mgbai9a5eva00b"}],"xn--mgbai9azgqp6j":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbai9azgqp6j)$/,"suffix":"xn--mgbai9azgqp6j"}],"xn--mgbayh7gpa":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbayh7gpa)$/,"suffix":"xn--mgbayh7gpa"}],"xn--mgbb9fbpob":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbb9fbpob)$/,"suffix":"xn--mgbb9fbpob"}],"xn--mgbbh1a71e":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbbh1a71e)$/,"suffix":"xn--mgbbh1a71e"}],"xn--mgbc0a9azcg":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbc0a9azcg)$/,"suffix":"xn--mgbc0a9azcg"}],"xn--mgbca7dzdo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbca7dzdo)$/,"suffix":"xn--mgbca7dzdo"}],"xn--mgberp4a5d4a87g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgberp4a5d4a87g)$/,"suffix":"xn--mgberp4a5d4a87g"}],"xn--mgberp4a5d4ar":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgberp4a5d4ar)$/,"suffix":"xn--mgberp4a5d4ar"}],"xn--mgbi4ecexp":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbi4ecexp)$/,"suffix":"xn--mgbi4ecexp"}],"xn--mgbpl2fh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbpl2fh)$/,"suffix":"xn--mgbpl2fh"}],"xn--mgbqly7c0a67fbc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbqly7c0a67fbc)$/,"suffix":"xn--mgbqly7c0a67fbc"}],"xn--mgbqly7cvafr":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbqly7cvafr)$/,"suffix":"xn--mgbqly7cvafr"}],"xn--mgbt3dhd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbt3dhd)$/,"suffix":"xn--mgbt3dhd"}],"xn--mgbtf8fl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbtf8fl)$/,"suffix":"xn--mgbtf8fl"}],"xn--mgbtx2b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbtx2b)$/,"suffix":"xn--mgbtx2b"}],"xn--mgbx4cd0ab":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mgbx4cd0ab)$/,"suffix":"xn--mgbx4cd0ab"}],"xn--mix082f":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mix082f)$/,"suffix":"xn--mix082f"}],"xn--mix891f":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mix891f)$/,"suffix":"xn--mix891f"}],"xn--mk1bu44c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mk1bu44c)$/,"suffix":"xn--mk1bu44c"}],"xn--mxtq1m":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--mxtq1m)$/,"suffix":"xn--mxtq1m"}],"xn--ngbc5azd":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ngbc5azd)$/,"suffix":"xn--ngbc5azd"}],"xn--ngbe9e0a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ngbe9e0a)$/,"suffix":"xn--ngbe9e0a"}],"xn--ngbrx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ngbrx)$/,"suffix":"xn--ngbrx"}],"xn--nnx388a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nnx388a)$/,"suffix":"xn--nnx388a"}],"xn--node":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--node)$/,"suffix":"xn--node"}],"xn--nqv7f":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nqv7f)$/,"suffix":"xn--nqv7f"}],"xn--nqv7fs00ema":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nqv7fs00ema)$/,"suffix":"xn--nqv7fs00ema"}],"xn--nyqy26a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--nyqy26a)$/,"suffix":"xn--nyqy26a"}],"xn--o3cw4h":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--o3cw4h)$/,"suffix":"xn--o3cw4h"}],"xn--ogbpf8fl":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ogbpf8fl)$/,"suffix":"xn--ogbpf8fl"}],"xn--p1acf":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--p1acf)$/,"suffix":"xn--p1acf"}],"xn--p1ai":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--p1ai)$/,"suffix":"xn--p1ai"}],"xn--pbt977c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--pbt977c)$/,"suffix":"xn--pbt977c"}],"xn--pgbs0dh":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--pgbs0dh)$/,"suffix":"xn--pgbs0dh"}],"xn--pssy2u":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--pssy2u)$/,"suffix":"xn--pssy2u"}],"xn--q9jyb4c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--q9jyb4c)$/,"suffix":"xn--q9jyb4c"}],"xn--qcka1pmc":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--qcka1pmc)$/,"suffix":"xn--qcka1pmc"}],"xn--qxam":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--qxam)$/,"suffix":"xn--qxam"}],"xn--rhqv96g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rhqv96g)$/,"suffix":"xn--rhqv96g"}],"xn--rovu88b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--rovu88b)$/,"suffix":"xn--rovu88b"}],"xn--s9brj9c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--s9brj9c)$/,"suffix":"xn--s9brj9c"}],"xn--ses554g":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ses554g)$/,"suffix":"xn--ses554g"}],"xn--t60b56a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--t60b56a)$/,"suffix":"xn--t60b56a"}],"xn--tckwe":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tckwe)$/,"suffix":"xn--tckwe"}],"xn--tiq49xqyj":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--tiq49xqyj)$/,"suffix":"xn--tiq49xqyj"}],"xn--unup4y":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--unup4y)$/,"suffix":"xn--unup4y"}],"xn--vermgensberater-ctb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vermgensberater-ctb)$/,"suffix":"xn--vermgensberater-ctb"}],"xn--vermgensberatung-pwb":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vermgensberatung-pwb)$/,"suffix":"xn--vermgensberatung-pwb"}],"xn--vhquv":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vhquv)$/,"suffix":"xn--vhquv"}],"xn--vuq861b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--vuq861b)$/,"suffix":"xn--vuq861b"}],"xn--w4r85el8fhu5dnra":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--w4r85el8fhu5dnra)$/,"suffix":"xn--w4r85el8fhu5dnra"}],"xn--w4rs40l":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--w4rs40l)$/,"suffix":"xn--w4rs40l"}],"xn--wgbh1c":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--wgbh1c)$/,"suffix":"xn--wgbh1c"}],"xn--wgbl6a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--wgbl6a)$/,"suffix":"xn--wgbl6a"}],"xn--xhq521b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--xhq521b)$/,"suffix":"xn--xhq521b"}],"xn--xkc2al3hye2a":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--xkc2al3hye2a)$/,"suffix":"xn--xkc2al3hye2a"}],"xn--xkc2dl3a5ee0h":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--xkc2dl3a5ee0h)$/,"suffix":"xn--xkc2dl3a5ee0h"}],"xn--y9a3aq":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--y9a3aq)$/,"suffix":"xn--y9a3aq"}],"xn--yfro4i67o":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--yfro4i67o)$/,"suffix":"xn--yfro4i67o"}],"xn--ygbi2ammx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--ygbi2ammx)$/,"suffix":"xn--ygbi2ammx"}],"xn--zfr164b":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xn--zfr164b)$/,"suffix":"xn--zfr164b"}],"xperia":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xperia)$/,"suffix":"xperia"}],"xxx":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xxx)$/,"suffix":"xxx"}],"xyz":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(xyz)$/,"suffix":"xyz"}],"yachts":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yachts)$/,"suffix":"yachts"}],"yahoo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yahoo)$/,"suffix":"yahoo"}],"yamaxun":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yamaxun)$/,"suffix":"yamaxun"}],"yandex":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yandex)$/,"suffix":"yandex"}],"ye":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.ye)$/,"suffix":"ye"}],"yodobashi":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yodobashi)$/,"suffix":"yodobashi"}],"yoga":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yoga)$/,"suffix":"yoga"}],"yokohama":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yokohama)$/,"suffix":"yokohama"}],"you":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(you)$/,"suffix":"you"}],"youtube":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(youtube)$/,"suffix":"youtube"}],"yt":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yt)$/,"suffix":"yt"}],"yun":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(yun)$/,"suffix":"yun"}],"za":[{"level":4,"pattern":/^(?:(.+)\.)?([^.]+)\.(blogspot\.co\.za)$/,"suffix":"blogspot.co.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ac\.za)$/,"suffix":"ac.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(agric\.za)$/,"suffix":"agric.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(alt\.za)$/,"suffix":"alt.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(co\.za)$/,"suffix":"co.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(edu\.za)$/,"suffix":"edu.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(gov\.za)$/,"suffix":"gov.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(grondar\.za)$/,"suffix":"grondar.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(law\.za)$/,"suffix":"law.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(mil\.za)$/,"suffix":"mil.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(net\.za)$/,"suffix":"net.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(ngo\.za)$/,"suffix":"ngo.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nis\.za)$/,"suffix":"nis.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(nom\.za)$/,"suffix":"nom.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(org\.za)$/,"suffix":"org.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(school\.za)$/,"suffix":"school.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(tm\.za)$/,"suffix":"tm.za"},{"level":3,"pattern":/^(?:(.+)\.)?([^.]+)\.(web\.za)$/,"suffix":"web.za"}],"zappos":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zappos)$/,"suffix":"zappos"}],"zara":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zara)$/,"suffix":"zara"}],"zero":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zero)$/,"suffix":"zero"}],"zip":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zip)$/,"suffix":"zip"}],"zippo":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zippo)$/,"suffix":"zippo"}],"zm":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.zm)$/,"suffix":"zm"}],"zone":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zone)$/,"suffix":"zone"}],"zuerich":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.(zuerich)$/,"suffix":"zuerich"}],"zw":[{"level":2,"pattern":/^(?:(.+)\.)?([^.]+)\.([^.]+\.zw)$/,"suffix":"zw"}]};});
define('js-src/utils/utility-domain-parser', ['exports', 'ember', 'js-src/utils/utility-domain-json'], function (exports, _ember, _jsSrcUtilsUtilityDomainJson) {
  exports['default'] = utilityDomainParser;

  function utilityDomainParser(domainName) {
    if ('string' !== _ember['default'].typeOf(domainName) || _ember['default'].isBlank(domainName)) {
      return null;
    }

    var parts = domainName.split('.');
    if (!parts || !parts.length > 2) {
      return null;
    }

    var suffix = parts[parts.length - 1];
    if (_ember['default'].isBlank(suffix)) {
      return null;
    }

    var tld = _jsSrcUtilsUtilityDomainJson['default'][suffix];

    if (!tld || !_ember['default'].isArray(tld)) {
      return null;
    }

    for (var index = 0; index < tld.length; index++) {
      var possible_tld = tld[index];
      var pattern = possible_tld.pattern;
      var arrayOrNull = domainName.match(pattern);

      if (!arrayOrNull || !_ember['default'].isArray(arrayOrNull)) {
        continue;
      }

      if (arrayOrNull.length < 2) {
        continue;
      }

      var topLevelDomain = tld.suffix;
      var customerDomainName = arrayOrNull[2];
      var fullDomainName = customerDomainName + '.' + suffix;
      var exact = fullDomainName === domainName;

      return {
        customerDomainName: customerDomainName,
        topLevelDomain: topLevelDomain,
        fullDomainName: fullDomainName,
        originalDomainName: domainName,
        exact: exact
      };
    }
  }
});
define("js-src/validators/local/email", ["exports", "ember-validations/validators/base"], function (exports, _emberValidationsValidatorsBase) {
  exports["default"] = _emberValidationsValidatorsBase["default"].extend({

    call: function call() {
      var email = this.model.get(this.property);

      if (!email) {
        this.errors.pushObject("Must include an email");
      } else if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
        this.errors.pushObject("Must be a valid email address");
      }
    }
  });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('js-src/config/environment', ['ember'], function(Ember) {
  var prefix = 'js-src';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("js-src/app")["default"].create({"name":"js-src","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=js-src.map