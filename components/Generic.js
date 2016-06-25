/**
 * @Author: Mehedi Hasan
 * @E-mail: mhm2k9@gmail.com
 */

"use strict";
var crypto = require("crypto"),
    Generic = function(){};

Generic.prototype.uuidFromBytes = function(rnd){
    rnd[6] = (rnd[6] & 0x0f) | 0x40;
    rnd[8] = (rnd[8] & 0x3f) | 0x80;
    rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
    rnd.shift();
    return rnd.join('-');
};

Generic.prototype.genUuid = function(callback){
    var _self = this;
    if (typeof(callback) !== 'function') {
        return _self.uuidFromBytes(crypto.randomBytes(16));
    }

    crypto.randomBytes(16, function(err, rnd) {
        if (err) return callback(err);
        callback(null, _self.uuidFromBytes(rnd));
    });
};

Generic.prototype.getFormattedDate = function(_date, format){
    var formatted_date = "",
        date = new Date(_date),
        year = date.getFullYear(),
        month = (1 + date.getMonth()).toString(),
        day = date.getDate().toString(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        time = "00:00:00";

    month = month.length > 1 ? month : '0' + month;
    day = day.length > 1 ? day : '0' + day;
    hour = hour.length > hour ? hour : '0' + hour;
    minute = minute.length > minute ? minute : '0' + minute;
    second = second.length > second ? second : '0' + second;
    time = hour + ":" + minute + ":" + second;

    switch (format.toLowerCase()){
        case "yyyy-mm-dd":
            formatted_date = year + "-" + month + "-" + day;
            break;
        case "yyyy/mm/dd":
            formatted_date = year + "/" + month + "/" + day;
            break;
        case "yyyy-mm-dd h:i:s":
            formatted_date = year + "-" + month + "-" + day + " " +  time;
            break;
        case "yyyy/mm/dd h:i:s":
            formatted_date = year + "/" + month + "/" + day + " " +  time;
            break;
        default:
            formatted_date = date.substring(0, 19);
    }

    return formatted_date;
};

module.exports = new Generic();