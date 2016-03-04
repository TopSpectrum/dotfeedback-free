define('ember-resize/services/resize', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var Base = _ember['default'].Service || _ember['default'].Object;
  var keys = Object.keys || _ember['default'].keys;

  var Evented = _ember['default'].Evented;
  var classify = _ember['default'].String.classify;
  var oneWay = _ember['default'].computed.oneWay;
  var debounce = _ember['default'].run.debounce;

  exports['default'] = Base.extend(Evented, {
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

      var defaults = _ember['default'].getWithDefault(this, 'resizeServiceDefaults', {});

      keys(defaults).map(function (key) {
        var classifiedKey = classify(key);
        var defaultKey = 'default' + classifiedKey;
        return _ember['default'].set(_this2, defaultKey, defaults[key]);
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
});