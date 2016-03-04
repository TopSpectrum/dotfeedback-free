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