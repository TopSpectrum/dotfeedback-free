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