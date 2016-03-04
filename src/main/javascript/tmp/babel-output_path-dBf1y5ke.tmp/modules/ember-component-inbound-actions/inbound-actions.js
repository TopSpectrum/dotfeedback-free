import Em from 'ember';
import ActionProxy from './action-proxy';

var scheduleInAfterRender = /^1\.13|^[2-9]/.test(Em.VERSION);

export default Em.Mixin.create({
  _inbound_actions_setup: Em.on('init', function () {
    var _this = this;

    this._inbound_actions_maybeScheduleInAfterRender(function () {
      var proxy = ActionProxy.create({ target: _this });
      _this.set('actionReceiver', proxy);
    });
  }),
  _inbound_actions_maybeScheduleInAfterRender: function _inbound_actions_maybeScheduleInAfterRender(fn) {
    if (scheduleInAfterRender) {
      Em.run.schedule('afterRender', this, fn);
    } else {
      fn();
    }
  }
});