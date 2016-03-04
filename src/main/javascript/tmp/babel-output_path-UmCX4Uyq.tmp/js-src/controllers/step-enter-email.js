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
          var hostname = (0, _jsSrcUtilsUtilityDomainParser['default'])(suffix);

          if (!hostname) {
            //  Hmm, that's not right.
            this.errors.pushObject('Please enter a valid email');
            return;
          }

          console.log(suffix, hostname);
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
        var domainName = (0, _jsSrcUtilsUtilityDomainParser['default'])(result);

        if (!domainName) {
          _ember['default'].Logger.warn('The domain name was not parsable.');
        }

        this.set('model.sourceFullDomainName', domainName + '.com');
        this.set('model.destinationCustomerDomainName', domainName);
        this.set('model.destinationFullDomainName', domainName + '.feedback');

        _ember['default'].Logger.debug('transitioning to step-select-domains');
        this.transitionToRoute('step-select-domains');
      }
    }
  });
});