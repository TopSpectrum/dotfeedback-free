import DS from 'ember-data';

export default DS.Model.extend({

  'fullDomainName': DS.attr(),
  'name': DS.attr(),
  'organization': DS.attr(),
  'street': DS.attr(),
  'city': DS.attr(),
  'state': DS.attr(),
  'postal': DS.attr(),
  'country': DS.attr(),
  'phone': DS.attr(),
  'phoneExt': DS.attr(),
  'fax': DS.attr(),
  'faxExt': DS.attr(),
  'email': DS.attr()

});
