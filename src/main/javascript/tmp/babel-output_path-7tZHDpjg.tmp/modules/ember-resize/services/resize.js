import Ember from 'ember';

var Base = Ember.Service || Ember.Object;
var keys = Object.keys || Ember.keys;

var Evented = Ember.Evented;
var classify = Ember.String.classify;
var oneWay = Ember.computed.oneWay;
var debounce = Ember.run.debounce;

export default Base.extend(Evented, {
  _oldWidth: null,
  _oldHeight: null,
  _oldWidthDebounced: null,
  _oldHeightDebounced: null,

  debounceTimeout: oneWay('defaultDebounceTimeout'),
  widthSensitive: oneWay('defaultWidthSensitive'),
  heightSensitive: oneWay('defaultHeightSensitive'),

  init: function init() {
    var _this = this;

    this._super.apply(this, arguments);
    this._setDefaults();
    this._onResizeHandler = function (evt) {
      _this._fireResizeNotification(evt);
      debounce(_this, _this._fireDebouncedResizeNotification, evt, _this.get('debounceTimeout'));
    };
    this._installResizeListener();
  },

  destroy: function destroy() {
    this._super.apply(this, arguments);
    this._uninstallResizeListener();
  },

  _setDefaults: function _setDefaults() {
    var _this2 = this;

    var defaults = Ember.getWithDefault(this, 'resizeServiceDefaults', {});

    keys(defaults).map(function (key) {
      var classifiedKey = classify(key);
      var defaultKey = 'default' + classifiedKey;
      return Ember.set(_this2, defaultKey, defaults[key]);
    });
  },

  _hasWindowSizeChanged: function _hasWindowSizeChanged(w, h) {
    var debounced = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    return this.get('widthSensitive') && w !== this.get('_oldWidth' + (debounced ? 'Debounced' : '')) || this.get('heightSensitive') && h !== this.get('_oldHeight' + (debounced ? 'Debounced' : ''));
  },

  _updateCachedWindowSize: function _updateCachedWindowSize(w, h) {
    var debounced = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var wKey = '_oldWidth' + (debounced ? 'Debounced' : '');
    var hKey = '_oldHeight' + (debounced ? 'Debounced' : '');
    var props = {};
    props[wKey] = w;
    props[hKey] = h;
    this.setProperties(props);
  },

  _installResizeListener: function _installResizeListener() {
    window.addEventListener('resize', this._onResizeHandler);
  },

  _uninstallResizeListener: function _uninstallResizeListener() {
    window.removeEventListener('resize', this._onResizeHandler);
  },

  _fireResizeNotification: function _fireResizeNotification(evt) {
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;

    if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight);
    }
  },
  _fireDebouncedResizeNotification: function _fireDebouncedResizeNotification(evt) {
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;

    if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
      this.trigger('debouncedDidResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight, true);
    }
  }
});