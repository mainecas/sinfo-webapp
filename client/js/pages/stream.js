var PageView = require('./base');
var templates = require('client/js/templates');
var SessionsView = require('client/js/views/live/liveSessions');
var moment = require('moment');
var config = require('client/js/helpers/clientconfig');

module.exports = PageView.extend({
  pageTitle: 'Live Stream',
  template: templates.pages.stream,
  initialize: function () {
    var self = this;
    self.interval = setInterval(function () {
      self.update();
    }, config.live.interval);

    app.sessions.once('sync', function () {
      self.update();
    });

    self.update();
  },
  update: function () {
    var self = this;
    app.sessions.fetch();

    var liveStreamSessions = app.sessions.filter(function (session) {
      var now = new Date();
      return moment(session.date).isSame(now, 'day') && session.isHappening && session.hasStream;
    });

    self.showStream = liveStreamSessions.length > 0;
  },
  props: {
    showStream: 'boolean'
  },
  bindings: {
    'showStream': {
      type: 'toggle',
      hook: 'live-stream',
    }
  },
  subviews: {
    speakers: {
      container: '[data-hook=live-sessions]',
      parent: this,
      prepareView: function (el) {
        var self = this;
        return new SessionsView({
          el: el
        });
      }
    },
  },
});
