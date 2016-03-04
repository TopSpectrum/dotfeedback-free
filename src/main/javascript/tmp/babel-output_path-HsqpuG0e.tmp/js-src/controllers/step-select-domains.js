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