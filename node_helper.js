/* global Module */

/* node_helper.js
 *
 * Magic Mirror
 * Module: MMM-FunnyHolidays
 * Datasource by http://www.webcal.fi/
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * Module MMM-FunnyHolidays By Matti Lehtinen
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');
var zlib = require('zlib');

module.exports = NodeHelper.create({
  getData: function (payload) {
    var self = this;
    var options = {
      method: 'GET',
      url: 'http://www.webcal.fi/cal.php?id=50&format=json&start_year=current_year&end_year=current_year&tz=Europe%2FHelsinki',
      headers: {
        'Host': 'www.webcal.fi',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'MagicMirrorFunnyHolidaysModule'
      },
      encoding: null
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      if (response.headers['content-encoding'] == 'gzip') {
        zlib.gunzip(body, function (err, dezipped) {
          var json = JSON.parse(dezipped.toString());

          var isFirst = false;
          var text = "nodata";

          for (var i = 0; i < json.length; i++) {
            if (json[i].date === payload.date) {
              if (isFirst === false) {
                text = "";
                text = text + " " + json[i].name;
                isFirst = true;
              }
              else {
                text = text + "," + json[i].name;
              }
            }
          }

          self.sendSocketNotification(
            'FUNNY_HOLIDAYS_DATA_RESPONSE',
            text);
        });
      }
    });
  },
  formatDate: function (date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'FUNNY_HOLIDAYS_DATA_REQUEST') {
      this.getData(payload);
    }
  }
});
