import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    var model = this.modelFor('application');
    var sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');

    if (!sourceFullDomainName) {
      Ember.Logger.warn('Could not determine the \'sourceFullDomainName\', so returning to the index route.');
      this.transitionTo('index');
    }
  },

  model() {
    return this.modelFor('application');
  },

  afterModel(model, transition) {
    this.query(model);
  },

  peekAndFind(recordType, recordId) {
    var scope = this;

    return Ember.RSVP.Promise
      .resolve(this.store.peekRecord(recordType, recordId))
      .then(function (record) {
        if (record) {
          return Ember.RSVP.Promise.resolve(record);
        } else {
          return scope.store.findRecord(recordType, recordId);
        }
      });
  },

  query: function (model, sourceFullDomainName) {
    if (Ember.isBlank(sourceFullDomainName)) {
      sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');
    }

    var scope = this;
    var destinationFullDomainName = Ember.get(model, 'destinationFullDomainName');

    Ember.set(model, 'fetchingSourceFullDomainNameRecord', true);
    Ember.set(model, 'chooseDifferentSourceFullDomainNameMode', false);

    this.peekAndFind('whois', sourceFullDomainName)
      .then(function (whoisRecord) {
        return scope.peekAndFind('availability', destinationFullDomainName)
          .then(function (availabilityRecord) {
            Ember.set(model, 'sourceFullDomainName', sourceFullDomainName);
            Ember.set(model, 'sourceFullDomainNameRecord', whoisRecord);
            Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
            Ember.set(model, 'sourceFullDomainNameRecord.email', Ember.get(model, 'email'));
            Ember.set(model, 'destinationAvailabilityRecord', availabilityRecord);
          });
      })
      .catch(function (err) {
        if (console) {
          console.log(err);
        }

        alert('There was an unknown server error. Please try again.');

        Ember.set(model, 'sourceFullDomainNameRecord', null);
        Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
      });
  },

  actions: {
    changeSourceFullDomainName(model, sourceFullDomainName) {
      if (Ember.isBlank(sourceFullDomainName)) {
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
