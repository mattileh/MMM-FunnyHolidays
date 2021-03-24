/* global Module */

/* Magic Mirror
 * Module: MMM-FunnyHolidays
 *
 * By Matti Lehtinen
 * MIT Licensed.
 * TODO: 
 * translate possibility to config and fallback to a few spesified languages en,es,ger
 * timezones and API fetch for localizations 
 */

Module.register("MMM-FunnyHolidays", {
	getTemplateData: function () {
		return this.config;
	},
	// Override start method.
	start: function () {
		this.funnyholidaysToday = "No data",
		this.funnyholidaysTomorrow = "No data";

		// set a timer to refresh the dom just after midnight local time
		const dt = new Date();
		dt.setDate(dt.getDate()+1);
		dt.setHours(0,0,30,0);
		this.nextRunTime = dt.getTime() - new Date().getTime();
	},
	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (this.state < 3 && notification == 'FUNNY_HOLIDAYS_DATA_RESPONSE') {
			var self = this;
			//console.log("starting", this.state, payload);
			if (this.state == 1) {
				//fetching today
				this.funnyholidaysToday = payload;

				//proceed to fetch tomorrow
				this.state = 2;
				var tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				var formattedTomorrow = (self.formatDate(tomorrow));
				self.sendSocketNotification("FUNNY_HOLIDAYS_DATA_REQUEST", { 'date': formattedTomorrow });

			} else if (this.state == 2) {
				this.funnyholidaysTomorrow = payload;
				this.state = 3;

				//start again after timeout - ensure no duplicates are running:
				clearInterval(this.timerHook);
				//console.log(`scheduled to run again in ${this.nextRunTime}ms`);
				this.timerHook = setTimeout(function () {
					self.state = 1;
					self.nextRunTime = 1000*60*60*24;
					var today = new Date();
					var formatted = (self.formatDate(today));
					self.sendSocketNotification("FUNNY_HOLIDAYS_DATA_REQUEST", { 'date': formatted });
				}, this.nextRunTime);

			}
			this.updateDom();
		}
	},
	// Override socket notification handler.
	notificationReceived: function (notification, payload, sender) {
		var self = this;
		if (notification == 'MODULE_DOM_CREATED') {
			//fetch today's funny holidays
			var start = Date.now();
			var formatted = (self.formatDate(start));
			self.state = 1;
			self.sendSocketNotification("FUNNY_HOLIDAYS_DATA_REQUEST", { 'date': formatted });
		}
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
	getDom: function () {
		var wrapper = document.createElement("div");

		var message = document.createElement("div");
		message.className = "small bright";

		var text = document.createElement("span");
		text.innerHTML = this.translate("TODAY") + ": " + this.funnyholidaysToday;

		message.appendChild(text);
		wrapper.appendChild(message);

		var subtext = document.createElement("div");
		subtext.innerHTML = this.translate("TOMORROW") + ": " + this.funnyholidaysTomorrow;
		subtext.className = "xsmall dimmed";
		wrapper.appendChild(subtext);

		if(this.config.showSourceLogo){
			var icon = document.createElement("img");
			icon.src = "modules/MMM-FunnyHolidays/images/webcalfi-logo-small.png";
			icon.width = 24;
			icon.height = 24;
			wrapper.appendChild(icon);
		}

		return wrapper;
	},
});
