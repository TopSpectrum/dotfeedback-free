import Ember from 'ember';
import domainParser from 'javascript/utils/utility-domain-parser';
import EmberValidations from 'ember-validations';

var customerDomainNameRegex = /^[\w]+$/;

function isValidFullDomainName(test) {
  let obj = domainParser(test);

  return (obj) ? (obj.exact) : false;
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
  if (Ember.typeOf(value) !== 'string') {
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

export default Ember.Controller.extend(EmberValidations, {

  store: Ember.inject.service(),

  //region Validations
  validations: {
    'name': {presence: true},
    'email': {presence: true},
    'street': {presence: true},
    'city': {presence: true},
    'state': {presence: true},
    'postal': {presence: true},
    'country': {presence: true},
    'phone': {presence: true}
  },

  name: Ember.computed.alias('model.sourceFullDomainNameRecord.name'),
  email: Ember.computed.alias('model.sourceFullDomainNameRecord.email'),
  street: Ember.computed.alias('model.sourceFullDomainNameRecord.street'),
  city: Ember.computed.alias('model.sourceFullDomainNameRecord.city'),
  state: Ember.computed.alias('model.sourceFullDomainNameRecord.state'),
  postal: Ember.computed.alias('model.sourceFullDomainNameRecord.postal'),
  country: Ember.computed.alias('model.sourceFullDomainNameRecord.country'),
  phone: Ember.computed.alias('model.sourceFullDomainNameRecord.phone'),
  //endregion

  //region Computed Properties
  newDestinationFullDomainName: Ember.computed('model.newDestinationFullDomainName', function () {
    return sanitizeString(this.get('model.newDestinationFullDomainName'));
  }),

  destinationCustomerDomainName: Ember.computed('model.destinationCustomerDomainName', function () {
    return sanitizeString(this.get('model.destinationCustomerDomainName'));
  }),

  newDestinationCustomerDomainName: Ember.computed('model.newDestinationCustomerDomainName', function () {
    return sanitizeString(this.get('model.newDestinationCustomerDomainName'));
  }),

  availabilityStatus: Ember.computed('hasDestinationAvailabilityRecord', 'model.destinationAvailabilityRecord.status', function () {
    var hasDestinationAvailabilityRecord = this.get('hasDestinationAvailabilityRecord');
    var status = this.get('model.destinationAvailabilityRecord.status');

    if (!hasDestinationAvailabilityRecord) {
      return null;
    }

    return status;
  }),
  //endregion

  //region Computed Properties that Decide
  isEditingDestination: Ember.computed('newDestinationCustomerDomainName', 'destinationCustomerDomainName', function () {
    // Are we dirty?
    var computedDestinationFullDomainName = this.get('newDestinationCustomerDomainName');
    var textDestinationFullDomainName = this.get('destinationCustomerDomainName');

    return computedDestinationFullDomainName !== textDestinationFullDomainName;
  }),

  shouldShowModelingBar: Ember.computed('isEditingSource', 'isFetchingWhois', 'hasSourceRecord', 'isAvailable', function () {
    var hasSourceRecord = this.get('hasSourceRecord');
    //var isFetchingWhois = this.get('isFetchingWhois');
    var isEditingSource = this.get('isEditingSource');
    //var isAvailable = this.get('isAvailable');

    return !isEditingSource && hasSourceRecord; //&& !isFetching && isAvailable;
  }),

  shouldShowWhoisTable: Ember.computed('shouldShowModelingBar', function () {
    return this.get('shouldShowModelingBar');
  }),

  nextIsDisabled: Ember.computed('isEditingSource', 'isFetchingWhois', 'isAvailable', function () {
    let choosing = this.get('isEditingSource');
    let fetching = this.get('isFetchingWhois');
    let available = this.get('isAvailable');

    //console.log(fetching, choosing, available, isInvalid, this.get('errors'));

    return (fetching || choosing || !available);
  }),

  isFetchingSomething: Ember.computed('isFetchingWhois', 'isFetchingAvailability', function () {
    var isFetchingWhois = this.get('isFetchingWhois');
    var isFetchingAvailability = this.get('isFetchingAvailability');

    return isFetchingWhois || isFetchingAvailability;
  }),

  isFetchingAvailability: Ember.computed('model.fetchingDestinationAvailabilityRecord', function() {
    var count = this.get('model.fetchingDestinationAvailabilityRecord');

    if (!count || count <= 0) {
      return false;
    }

    return true;
  }),

  isFetchingWhois: Ember.computed('model.fetchingSourceFullDomainNameRecord', function () {
    return this.get('model.fetchingSourceFullDomainNameRecord');
  }),

  isEditingSource: Ember.computed('model.chooseDifferentSourceFullDomainNameMode', function () {
    return this.get('model.chooseDifferentSourceFullDomainNameMode');
  }),

  hasSourceRecord: Ember.computed('model.sourceFullDomainNameRecord', function () {
    return !Ember.isNone(this.get('model.sourceFullDomainNameRecord'));
  }),

  hasDestinationRecord: Ember.computed('model.destinationFullDomainNameRecord', function () {
    return !Ember.isNone(this.get('model.destinationFullDomainNameRecord'));
  }),

  hasInvalidNewDestinationCustomerDomainName: Ember.computed('hasValidNewDestinationCustomerDomainName', function () {
    return !this.get('hasValidNewDestinationCustomerDomainName');
  }),

  hasValidNewDestinationCustomerDomainName: Ember.computed('newDestinationCustomerDomainName', function () {
    return isValidCustomerDomainName(this.get('newDestinationCustomerDomainName'));
  }),

  hasValidNewSourceFullDomainName: Ember.computed('model.newSourceFullDomainName', function () {
    var value = sanitizeFullDomainName(this.get('model.newSourceFullDomainName'));
    var parsedObject = domainParser(value);

    if (!parsedObject) {
      return false;
    }

    if (!parsedObject.exact) {
      // Not an exact match.
      return false;
    }

    return parsedObject.customerDomainName;
  }),

  hasInvalidNewSourceFullDomainName: Ember.computed('hasValidNewSourceFullDomainName', function () {
    return !this.get('hasValidNewSourceFullDomainName');
  }),

  hasDestinationAvailabilityRecord: Ember.computed('model.destinationAvailabilityRecord', 'model.destinationFullDomainName', function () {
    var destinationFullDomainName = this.get('model.destinationFullDomainName');
    var destinationAvailabilityRecordFullDomainName = this.get('model.destinationAvailabilityRecord.id');

    return (destinationFullDomainName === destinationAvailabilityRecordFullDomainName);
  }),

  isAvailable: Ember.computed('availabilityStatus', function () {
    var availabilityStatus = this.get('availabilityStatus');

    return (availabilityStatus === 'available');
  }),
  //endregion

  //region Observers
  //clearAvailabilityRecordObserver: Ember.observer('newDestinationCustomerDomainName', function () {
  //  let customerDomainName = this.get('newDestinationCustomerDomainName');
  //
  //
  //}),

  updateNewDestinationFullDomainName: Ember.observer('model.newDestinationCustomerDomainName', 'newDestinationCustomerDomainName', function () {
    var customerDomainName = this.get('newDestinationCustomerDomainName');

    if (!customerDomainName || (Ember.typeOf(customerDomainName) !== 'string')) {
      customerDomainName = '';
    }

    let newDestinationFullDomainName;
    if (customerDomainName.length === 0) {
      newDestinationFullDomainName = null;
      // Don't clear it until it's set.
      //this.set('model.destinationAvailabilityRecord', null);
    } else {
      newDestinationFullDomainName = customerDomainName + '.feedback';
    }

    this.set('model.newDestinationFullDomainName', newDestinationFullDomainName);
  }),

  updateDestinationFullDomainName: Ember.observer('destinationCustomerDomainName', function () {
    var customerDomainName = this.get('destinationCustomerDomainName');
    var value = (Ember.isBlank(customerDomainName) ? '' : (customerDomainName + '.feedback'));

    this.set('model.destinationFullDomainName', value);
  }),

  refreshAvailabilityRecordObserver: Ember.observer('model.destinationFullDomainName', function () {
    //var isEditingSource = this.get('isEditingEditDestinationFullDomainName');
    //
    //if (!isEditingSource) {
    //  return;
    //}

    var valueBeforeQuery = this.get('model.destinationFullDomainName');

    var scope = this;
    var model = this.get('model');

    Ember.run.debounce(this, function () {
      model.incrementProperty('fetchingDestinationAvailabilityRecord');

      //console.log('i changed it', model.get('fetchingDestinationAvailabilityRecord'))

      // WE NEED TO QUERY
      scope.peekOrFind('availability', valueBeforeQuery)
        .then((record) => {

          // This record should always be defined....
          var valueAfterQuery = scope.get('model.destinationFullDomainName');

          if (valueBeforeQuery !== valueAfterQuery) {
            Ember.Logger.warn('The values were not the same', valueBeforeQuery, valueAfterQuery);
            model.decrementProperty('fetchingDestinationAvailabilityRecord');
            // Not the same... ignore.
            return;
          }

          scope.set('model.destinationAvailabilityRecord', record);
          model.decrementProperty('fetchingDestinationAvailabilityRecord');
        })
        .catch((err) => {
          model.decrementProperty('fetchingDestinationAvailabilityRecord');
        });
    }, 50);

  }),
  //endregion

  //region Functions
  peekOrFind(recordType, recordId) {
    var record = this.store.peekRecord(recordType, recordId);
    if (record) {
      return Ember.RSVP.Promise.resolve(record);
    }

    return this.store.findRecord(recordType, recordId);
  },
  //endregion

  //region Actions
  actions: {
    enterWasHitOnDestinationDomainName() {
      // We need to decide what to do.
      var isEditingDestination = this.get('isEditingDestination');

      if (isEditingDestination) {
        this.send('finishUpdateDestinationCustomerDomainName');
      } else {
        this.send('next');
      }
    },

    finishUpdateDestinationCustomerDomainName() {
      var allowed = this.get('hasValidNewDestinationCustomerDomainName');

      if (!allowed) {
        return false;
      }

      // TODO: Should we update more stuff?
      this.set('model.destinationCustomerDomainName', this.get('newDestinationCustomerDomainName'));
    },

    selectModelFromDomainName() {
      var model = this.get('model');
      var value = Ember.get(model, 'newSourceFullDomainName');

      if (Ember.isBlank(value)) {
        alert('Please enter a valid domain name');
        Ember.set(model, 'chooseDifferentSourceFullDomainNameMode', false);
        return;
      }

      this.set('model.sourceFullDomainName', value);
      this.send('changeSourceFullDomainName', this.get('model'), value);

      return false;
    },

    next() {
      if (this.get('nextIsDisabled')) {
        // enter was hit..
        return;
      }

      var scope = this;

      Ember.Logger.debug('next');

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
      reservation.save()
        .then(function () {
          // We are ready for confirmation
          scope.set('model.fetchingSourceFullDomainNameRecord', false);
          scope.set('model.waitingOnEmail', true);

          //scope.transitionTo('step-confirmation');
          scope.transitionToRoute('step-check-email');
        })
        .catch(function () {
          alert('There was a problem submitting your request. Please try again.');
          scope.set('model.fetchingSourceFullDomainNameRecord', false);
        });

      return false;
    },

    chooseDifferentSourceFullDomainName() {
      this.set('model.newSourceFullDomainName', this.get('model.sourceFullDomainName'));
      this.set('model.chooseDifferentSourceFullDomainNameMode', true);

      Ember.run.later(this, function () {
        // We need to focus the element.
        // We need it to happen after the runloop actually executes those changes.
        this.get('selectModelFromDomainNameInput')
          .send('focus');
      });
    }
  }
  //endregion

});
