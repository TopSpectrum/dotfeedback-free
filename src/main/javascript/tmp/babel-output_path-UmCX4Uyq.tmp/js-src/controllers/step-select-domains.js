define('js-src/controllers/step-select-domains', ['exports', 'ember', 'js-src/utils/utility-domain-parser', 'ember-validations'], function (exports, _ember, _jsSrcUtilsUtilityDomainParser, _emberValidations) {
  exports['default'] = _ember['default'].Controller.extend(_emberValidations['default'], {

    store: _ember['default'].inject.service(),

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

    updateDestinationFullDomainName: _ember['default'].observer('model.destinationCustomerDomainName', function () {
      var value = this.get('model.destinationCustomerDomainName');

      if (!value || _ember['default'].typeOf(value) !== 'string') {
        value = '';
      }

      _ember['default'].Logger.debug('I think the len should be 0: ' + (0 === value.length));
      if (value.length === 0) {
        this.set('model.destinationFullDomainName', null);
        this.set('model.destinationAvailabilityRecord', null);
      } else {
        this.set('model.destinationFullDomainName', value + '.feedback');
      }
    }),

    hasSourceRecord: _ember['default'].computed('model.sourceFullDomainNameRecord', function () {
      return !_ember['default'].isNone(this.get('model.sourceFullDomainNameRecord'));
    }),

    isFetching: _ember['default'].computed('model.fetchingSourceFullDomainNameRecord', function () {
      return this.get('model.fetchingSourceFullDomainNameRecord');
    }),

    isEditing: _ember['default'].computed('model.chooseDifferentSourceFullDomainNameMode', function () {
      return this.get('model.chooseDifferentSourceFullDomainNameMode');
    }),

    availabilityStatus: _ember['default'].computed('model.destinationAvailabilityRecord.status', function () {
      return this.get('model.destinationAvailabilityRecord.status');
    }),

    hasDestinationRecord: _ember['default'].computed('model.destinationFullDomainNameRecord', function () {
      return !_ember['default'].isNone(this.get('model.destinationFullDomainNameRecord'));
    }),

    hasDestinationAvailabilityRecord: _ember['default'].computed('model.destinationAvailabilityRecord', function () {
      return !_ember['default'].isNone(this.get('model.destinationAvailabilityRecord'));
    }),

    isAvailable: _ember['default'].computed('availabilityStatus', function () {
      var availabilityStatus = this.get('availabilityStatus');

      return availabilityStatus === 'available';
    }),

    refreshAvailabilityRecordObserver: _ember['default'].observer('isEditingEditDestinationFullDomainName', 'model.destinationFullDomainName', function () {
      var isEditing = this.get('isEditingEditDestinationFullDomainName');

      if (!isEditing) {
        return;
      }

      var valueBeforeQuery = this.get('model.destinationFullDomainName');

      /// POOR MAN VALIDITY CHECK
      if (!valueBeforeQuery || !valueBeforeQuery.endsWith('.feedback') || !(valueBeforeQuery.length > 10)) {
        return;
      }

      var scope = this;

      _ember['default'].run.debounce(this, function () {
        scope.set('model.fetchingDestinationAvailabilityRecord', true);

        // WE NEED TO QUERY
        scope.peekOrFind('availability', valueBeforeQuery).then(function (record) {
          // This record should always be defined....

          var valueAfterQuery = scope.get('model.destinationFullDomainName');

          if (valueBeforeQuery !== valueAfterQuery) {
            // Not the same... ignore.
            return;
          }

          scope.set('model.fetchingDestinationAvailabilityRecord', false);
          scope.set('model.destinationAvailabilityRecord', record);
        });
      }, 500);
    }),

    peekOrFind: function peekOrFind(recordType, recordId) {
      var record = this.store.peekRecord(recordType, recordId);
      if (record) {
        return _ember['default'].RSVP.Promise.resolve(record);
      }

      return this.store.findRecord(recordType, recordId);
    },

    isEditingEditDestinationFullDomainName: _ember['default'].computed('model.destinationAvailabilityRecord', 'model.destinationFullDomainName', function () {
      // Are we dirty?
      var computedDestinationFullDomainName = this.get('model.destinationAvailabilityRecord.id');
      var textDestinationFullDomainName = this.get('model.destinationFullDomainName');

      //console.log(computedDestinationFullDomainName, textDestinationFullDomainName);

      return computedDestinationFullDomainName !== textDestinationFullDomainName;
    }),

    showModelingBar: _ember['default'].computed('isEditing', 'isFetching', 'hasSourceRecord', 'isAvailable', function () {
      var hasSourceRecord = this.get('hasSourceRecord');
      //var isFetching = this.get('isFetching');
      var isEditing = this.get('isEditing');
      //var isAvailable = this.get('isAvailable');

      return !isEditing && hasSourceRecord; //&& !isFetching && isAvailable;
    }),

    showWhoisTable: _ember['default'].computed('showModelingBar', function () {
      var showModelingBar = this.get('showModelingBar');

      return showModelingBar;
    }),

    mask: (function () {
      return {
        regex: '[a-z]*\.feedback'
      };
    }).property('mask'),

    nextIsDisabled: _ember['default'].computed('model.chooseDifferentSourceFullDomainNameMode', 'isFetching', 'isInvalid', 'isAvailable', function () {
      var fetching = this.get('isFetching');
      var choosing = this.get('model.chooseDifferentSourceFullDomainNameMode');
      var available = this.get('isAvailable');
      var isInvalid = this.get('isInvalid');

      //console.log(fetching, choosing, available, isInvalid, this.get('errors'));

      return fetching || choosing || isInvalid || !available;
    }),

    hasValidNewSourceFullDomainName: _ember['default'].computed('model.newSourceFullDomainName', function () {
      var value = this.get('model.newSourceFullDomainName');
      var string = (0, _jsSrcUtilsUtilityDomainParser['default'])(value);
      if (!string) {
        return false;
      }

      if (value.indexOf(string) !== 0) {
        // startsWith check.
        return false;
      }

      console.log(string);

      return !_ember['default'].isNone(string);
    }),

    hasInvalidNewSourceFullDomainName: _ember['default'].computed('hasValidNewSourceFullDomainName', function () {
      return !this.get('hasValidNewSourceFullDomainName');
    }),

    hasDestinationFullDomainName: _ember['default'].computed('model', 'model.destinationFullDomainName', function () {
      return !_ember['default'].isEmpty(this.get('model.destinationFullDomainName'));
    }),

    actions: {
      selectModelFromDomainName: function selectModelFromDomainName() {
        var model = this.get('model');
        var value = _ember['default'].get(model, 'newSourceFullDomainName');

        if (_ember['default'].isBlank(value)) {
          alert('Please enter a valid domain name');
          _ember['default'].set(model, 'chooseDifferentSourceFullDomainNameMode', false);
          return;
        }

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

      //changeModel() {
      //
      //  //this.set('model.sourceFullDomainName', null);
      //  this.set('model.record', null);
      //}
    }

  });
});