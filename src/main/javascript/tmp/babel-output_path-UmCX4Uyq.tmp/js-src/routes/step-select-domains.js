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