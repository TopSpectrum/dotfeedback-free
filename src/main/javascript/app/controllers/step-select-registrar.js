import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),

  actions: {

    innerNext(chosenRegistrar) {
      this.set('model.registrar', chosenRegistrar);

      var reservation = this.store.createRecord('reservation', {
        sourceFullDomainName: this.get('model.sourceFullDomainName'),
        destinationFullDomainName: this.get('model.destinationFullDomainName'),

        'referralCode': this.get('model.referralCodeState.code'),
        'registrar': this.get('model.registrar'),
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

      var scope = this;

      this.set('spinning', true);

      //Ember.RSVP.Promise.cast(
      //  Ember.$.ajax({
      //    url: '/api/v1/submit',
      //    method: 'POST',
      //    data: JSON.stringify(model)
      //  }))
      reservation.save()
        .then(function () {
          // We are ready for confirmation
          scope.set('model.waitingOnEmail', true);
          scope.set('spinning', true);

          //scope.transitionTo('step-confirmation');
          scope.transitionToRoute('step-check-email');
        })
        .catch(function (err) {
          alert('There was a problem submitting your request. Please try again.');
          scope.set('spinning', false);
          Ember.Logger.debug('Error', err);
        });

    }

  }

});
