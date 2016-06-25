/**
 * @Author: Mehedi Hasan
 * @E-mail: mhm2k9@gmail.com
 * Script: default.js
 */

"use strict";

/**
 * Document ready method.
 * This method will be executed after being ready DOM
 */
$(document).ready(function(){
    // ...
});

var DEFAULT = DEFAULT || {};

DEFAULT.getFormattedDate = function(_date, format){
    var formatted_date = "",
        date = new Date(_date),
        year = date.getFullYear(),
        month = (1 + date.getMonth()).toString(),
        day = date.getDate().toString(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        time;

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


