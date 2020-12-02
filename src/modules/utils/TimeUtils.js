

var TimeUtils = cc.Class.extend({
    timeOffset: 0,
    getRemainingTime: function(timeInSeconds) {
        // let timeZoneOffset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000 + 15 * 1000;
        return Math.round(timeInSeconds - this.getCurrentTimeMillis()/ 1000);
    },

    getCurrentTimeMillis: function() {
        // let timeZoneOffset = 5 * 60 * 60 * 1000 + 45 * 60 * 1000 + 15 * 1000;
        return (Date.now() + this.timeOffset);
    },

    getFormattedTime: function(timeInSecond) {
        var seconds = timeInSecond;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        var days = Math.floor(hours / 24);
        hours = hours % 24;
        if (days != 0) {
            return days.toString() + "d" + hours.toString() + "h";
        } else if (hours != 0) {
            return hours.toString() + "h" + minutes.toString() + "m";
        } else if (minutes != 0) {
            return minutes.toString() + "m" + seconds.toString() + "s";
        } else
            return seconds.toString() + "s";
    },

    updateTimeOffset: function(timestamp) {
        this.timeOffset = timestamp - Date.now();
    }
});