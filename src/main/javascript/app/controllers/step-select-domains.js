"use strict";

import Ember from 'ember';
import domainParser from 'javascript/utils/utility-domain-parser';
import EmberValidations /*, { validator }*/ from 'ember-validations';

//region Global Utilities
var customerDomainNameRegex = /^[\w-]+$/;

function isValidFullDomainName(test) {
    let obj = domainParser(test);

    return (obj) ? (obj.exact) : false;
}

function isValidCustomerDomainName(test) {
    return customerDomainNameRegex.test(test);
}

// function getCustomerDomainName(fullDomainName) {
//     if (Ember.isEmpty(fullDomainName)) {
//         return null;
//     } else if (-1 === fullDomainName.indexOf('.')) {
//         return fullDomainName;
//     }
//
//     let parsedObject = domainParser(fullDomainName);
//
//     if (!parsedObject) {
//         return null;
//     }
//
//     return parsedObject.customerDomainName;
// }

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
//endregion

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

    focused: false,
    name: Ember.computed.alias('model.sourceFullDomainNameRecord.name'),
    email: Ember.computed.alias('model.email'),
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
        return (sanitizeString(this.get('model.newDestinationCustomerDomainName')) || '').replace('.feedback', '');
    }),

    availabilityStatus: Ember.computed('hasDestinationAvailabilityRecord', 'model.destinationAvailabilityRecord.status', function () {
        var hasDestinationAvailabilityRecord = this.get('hasDestinationAvailabilityRecord');
        var status = this.get('model.destinationAvailabilityRecord.status');

        if (!hasDestinationAvailabilityRecord) {
            return null;
        }

        return status;
    }),

    isAvailableAndSettled: Ember.computed('isAvailable', 'isFetchingSomething', 'isEditingDestination', function() {
        let available = this.get('isAvailable');
        let fetching = this.get('isFetchingSomething');
        let editing = this.get('isEditingDestination');

        return !fetching && available && !editing;
    }),

    inputBoxClass: Ember.computed('isAvailableAndSettled', 'isFetchingSomething', 'isEditingDestination', function() {
        let isAvailableAndSettled = this.get('isAvailableAndSettled');
        let isFetchingSomething = this.get('isFetchingSomething');
        let editing = this.get('isEditingDestination');

        if (isFetchingSomething || editing) {
            return '';
        }

        if (isAvailableAndSettled) {
            return 'has-feedback has-success';
        }

        return 'has-feedback has-error';
    }),
    //endregion

    //region Computed Properties that Decide
    shouldWarnAboutBelowErrors: Ember.computed('muteInitialWhoisErrors', 'isValid', 'isAvailable', function() {
        var isAvailable = this.get('isAvailable');
        var muteInitialWhoisErrors = this.get('muteInitialWhoisErrors');
        var isValid = this.get('isValid');

        return !isValid && !muteInitialWhoisErrors && isAvailable;
    }),

    muteInitialWhoisErrors: Ember.computed('nextIsDisabled', 'hasDestinationRecord', 'isAvailable', function() {
        var nextIsDisabled = this.get('nextIsDisabled');
        var isAvailable = this.get('isAvailable');
        var hasDestinationRecord = this.get('hasDestinationRecord');

        if (!hasDestinationRecord) {
            return true;
        }

        return !(nextIsDisabled && isAvailable);
    }),

    muteWhoisErrors: Ember.computed('nextIsDisabled', 'hasDestinationRecord', 'isAvailable', function() {
        /*var nextIsDisabled = this.get('nextIsDisabled');*/
        /*var isAvailable = this.get('isAvailable');*/
        var hasDestinationRecord = this.get('hasDestinationRecord');

        return !hasDestinationRecord;
    }),

    isFetchingWhois: Ember.computed('model.fetchingSourceFullDomainNameRecord', function () {
        return this.get('model.fetchingSourceFullDomainNameRecord');
    }),

    isEditingSource: Ember.computed('model.chooseDifferentSourceFullDomainNameMode', function () {
        return this.get('model.chooseDifferentSourceFullDomainNameMode');
    }),

    isFetchingSomething: Ember.computed('isFetchingWhois', 'isFetchingAvailability', function () {
        var isFetchingWhois = this.get('isFetchingWhois');
        var isFetchingAvailability = this.get('isFetchingAvailability');

        return isFetchingWhois || isFetchingAvailability;
    }),

    isFetchingAvailability: Ember.computed('model.fetchingDestinationAvailabilityRecord', function () {
        var count = this.get('model.fetchingDestinationAvailabilityRecord');

        if (!count || count <= 0) {
            return false;
        }

        return true;
    }),

    isEditingDestination: Ember.computed('newDestinationCustomerDomainName', 'destinationCustomerDomainName', function () {
        // Are we dirty?
        var computedDestinationFullDomainName = this.get('newDestinationCustomerDomainName');
        var textDestinationFullDomainName = this.get('destinationCustomerDomainName');

        return computedDestinationFullDomainName !== textDestinationFullDomainName;
    }),

    shouldShowWhoisTable: Ember.computed('isEditingSource', 'isFetchingWhois', 'hasSourceRecord', 'isAvailable', function () {
        /*var hasSourceRecord = this.get('hasSourceRecord');*/
        // var isFetchingWhois = this.get('isFetchingWhois');
        var isEditingSource = this.get('isEditingSource');
        //var isAvailable = this.get('isAvailable');

        return !isEditingSource;// && hasSourceRecord; //&& !isFetching && isAvailable;
    }),

    copyIsDisabled: Ember.computed('isFetchingSomething', 'hasInvalidNewSourceFullDomainName', 'model.sourceFullDomainName', 'model.newSourceFullDomainName', function() {
        let fetching = this.get('isFetchingSomething');
        let invalid = this.get('hasInvalidNewSourceFullDomainName');

        if (fetching || invalid) {
            return true;
        }

        let source1 = sanitizeString(this.get('model.sourceFullDomainName'));
        let source2 = sanitizeString(this.get('model.newSourceFullDomainName'));

        return (source1 === source2);
    }),

    nextIsDisabled: Ember.computed('isEditingSource', 'isFetchingWhois', 'isAvailable', 'isValid', function () {
        let choosing = this.get('isEditingSource');
        let fetching = this.get('isFetchingWhois');
        let available = this.get('isAvailable');
        let isValid = this.get('isValid');
        //console.log(fetching, choosing, available, isInvalid, this.get('errors'));

        return (fetching || choosing || !available || !isValid);
    }),

    isFailedToResolveSourceWhois: Ember.computed('model.sourceFullDomainNameRecord.failedToResolve', function () {
        return true === this.get('model.sourceFullDomainNameRecord.failedToResolve');
    }),

    hasSourceRecord: Ember.computed('model.sourceFullDomainNameRecord', function () {
        return !Ember.isNone(this.get('model.sourceFullDomainNameRecord'));
    }),

    hasDestinationRecord: Ember.computed('hasDestinationAvailabilityRecord', function () {
        return this.get('hasDestinationAvailabilityRecord');
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

    hasDestinationAvailabilityRecord: Ember.computed('model.destinationAvailabilityRecord', 'isValid', 'model.destinationFullDomainName', function () {
        var destinationFullDomainName = this.get('model.destinationFullDomainName');
        var destinationAvailabilityRecordFullDomainName = this.get('model.destinationAvailabilityRecord.id');

        return !Ember.isBlank(destinationFullDomainName) && (destinationFullDomainName === destinationAvailabilityRecordFullDomainName);
    }),

    isAvailable: Ember.computed('availabilityStatus', function () {
        var availabilityStatus = this.get('availabilityStatus');

        return (availabilityStatus === 'available');
    }),
    //endregion

    //region Observers

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

        if (Ember.isBlank(valueBeforeQuery)) {
            return;
        }

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
                .catch((/*err*/) => {
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
        focusedMainInputBox() {
            this.set('model.newDestinationCustomerDomainName', (this.get('model.newDestinationCustomerDomainName')||'').replace('.feedback', ''));
        },

        blurredMainInputBox() {
            this.send('finishUpdateDestinationCustomerDomainName');

            this.set('model.newDestinationCustomerDomainName', this.get('newDestinationCustomerDomainName') + '.feedback');
        },

        destinationCustomerDomainNameDotted(){
            // trigger
            this.send('enterWasHitOnDestinationDomainName');
        },

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
            let destinationCustomerDomainName = this.get('newDestinationCustomerDomainName');

            this.set('model.destinationCustomerDomainName', destinationCustomerDomainName);

            let sourceFullDomainName = this.get('model.sourceFullDomainName');

            if (Ember.isEmpty(sourceFullDomainName)) {
                if (!Ember.isBlank(destinationCustomerDomainName)) {
                    this.set('model.newSourceFullDomainName', destinationCustomerDomainName + '.com');

                    this.send('selectModelFromDomainName');
                }
            }
        },

        selectModelFromDomainName() {
            var model = this.get('model');
            var value = Ember.get(model, 'newSourceFullDomainName');

            if (Ember.isBlank(value)) {
                //alert('Please enter a valid domain name');
                //Ember.set(model, 'chooseDifferentSourceFullDomainNameMode', false);
                return false;
            }

            this.set('model.sourceFullDomainName', value);
            this.send('changeSourceFullDomainName', this.get('model'), value);
            // this.set('model.newSourceFullDomainName', '');

            return false;
        },

        next() {
            if (this.get('nextIsDisabled')) {
                // enter was hit..
                return;
            }

            // So they can pick a registrar.
            this.transitionToRoute('step-select-registrar');

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
