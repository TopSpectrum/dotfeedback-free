import Ember from 'ember';

var Mixin = Ember.Mixin;
var floor = Math.floor;

export default Mixin.create({
  resizeEventsEnabled: true,
  resizeDebouncedEventsEnabled: true,

  _oldViewWidth: null,
  _oldViewHeight: null,
  _oldViewWidthDebounced: null,
  _oldViewHeightDebounced: null,
  resizeWidthSensitive: true,
  resizeHeightSensitive: false,

  didInsertElement: function didInsertElement() {
    this._super.apply(this, arguments);
    if (this.get('resizeEventsEnabled')) {
      this.get('resizeService').on('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      this.get('resizeService').on('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },

  willDestroyElement: function willDestroyElement() {
    this._super.apply(this, arguments);
    if (this.get('resizeEventsEnabled')) {
      this.get('resizeService').off('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      this.get('resizeService').off('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },

  didResize: function didResize() /*width, height, evt*/{}, // Overridden in subclass
  debouncedDidResize: function debouncedDidResize() /*width, height, evt*/{}, // Overridden in subclass

  _getComponentSize: function _getComponentSize() {
    return this.$()[0].getClientRects()[0];
  },

  _handleResizeEvent: function _handleResizeEvent(evt) {
    var w = floor(this._getComponentSize().width);
    var h = floor(this._getComponentSize().height);
    if (this.get('resizeWidthSensitive') && this.get('_oldViewWidth') !== w || this.get('resizeHeightSensitive') && this.get('_oldViewHeight') !== h) {
      this.didResize(w, h, evt);
      this.setProperties({
        _oldViewWidth: w,
        _oldViewHeight: h
      });
    }
  },

  _handleDebouncedResizeEvent: function _handleDebouncedResizeEvent(evt) {
    var w = floor(this._getComponentSize().width);
    var h = floor(this._getComponentSize().height);
    if (this.get('resizeWidthSensitive') && this.get('_oldViewWidthDebounced') !== w || this.get('resizeHeightSensitive') && this.get('_oldViewHeightDebounced') !== h) {
      this.debouncedDidResize(w, h, evt);
      this.setProperties({
        _oldViewWidthDebounced: w,
        _oldViewHeightDebounced: h
      });
    }
  }
});