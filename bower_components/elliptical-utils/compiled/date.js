(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.__tmp9z=global.__tmp9z || {};
    global.__tmp9z.date = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var date = {};

  /**
   * return an object representing current date
   * @returns {{day: number, month: number, year: number}}
   */
  date.currentDateObj = function () {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    return {
      day: day,
      month: month,
      year: year
    };
  };

  /**
   * returns a current date string
   * @returns {string}
   */
  date.current = function () {
    var obj = undefined.currentDateObj();
    return obj.month.toString() + '/' + obj.day.toString() + '/' + obj.year.toString();
  };

  /**
   * tests if valid date
   * @param obj {object}
   * @returns {boolean}
   */
  date.isDate = function (obj) {
    return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  };

  /**
   * tests if year is leap year
   * @param year {number}
   * @returns {boolean}
   */
  date.isLeapYear = function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  };

  /**
   * returns days in month for given year
   * @param year {number}
   * @param month {number}
   * @returns {number}
   */
  date.getDaysInMonth = function (year, month) {
    return [31, date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };

  /**
   * sets a date to start of day
   * @param d {date}
   * @returns {void}
   */
  date.setToStartOfDay = function (d) {
    if (date.isDate(d)) d.setHours(0, 0, 0, 0);
  };

  /**
   * compares equality of two dates
   * @param a {date}
   * @param b {date}
   * @returns {boolean}
   */
  date.compareDates = function (a, b) {
    return a.getTime() === b.getTime();
  };

  module.exports = date;
});