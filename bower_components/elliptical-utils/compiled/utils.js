(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './assign', './extensions', 'js-object-clone', 'object-mixin', './generator', './random', './string', './date', './network', './color', './url', './currency', './array', './path', './object'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./assign'), require('./extensions'), require('js-object-clone'), require('object-mixin'), require('./generator'), require('./random'), require('./string'), require('./date'), require('./network'), require('./color'), require('./url'), require('./currency'), require('./array'), require('./path'), require('./object'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod,global.assign, global.__tmp9z.extensions, global.objectClone, global.objectMixin, global.__tmp9z.generator, global.__tmp9z.random,
        global.__tmp9z.string, global.__tmp9z.date, global.__tmp9z.network, global.__tmp9z.color, global.__tmp9z.url,
        global.__tmp9z.currency, global.__tmp9z.array, global.__tmp9z.path, global.__tmp9z.object);

    global.elliptical=global.elliptical || {};
    global.elliptical.utils = mod.exports;
  }
})(this, function (exports, module, _assign, _extensions, _jsObjectClone, _objectMixin, _generator, _random, _string, _date, _network, _color, _url, _currency, _array, _path, _object) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _generator2 = _interopRequire(_generator);

  var _random2 = _interopRequire(_random);

  var _string2 = _interopRequire(_string);

  var _date2 = _interopRequire(_date);

  var _network2 = _interopRequire(_network);

  var _color2 = _interopRequire(_color);

  var _url2 = _interopRequire(_url);

  var _currency2 = _interopRequire(_currency);

  var _array2 = _interopRequire(_array);

  var _path2 = _interopRequire(_path);

  var _object2 = _interopRequire(_object);

  var utils = {};

  var spec = {
    descriptors: false,
    extensibility: false,
    enumerator: Object.keys
  };

  /**
   * deep clones an object
   * @param src {object}
   * @param deep {boolean}
   * @returns {object}
   */
  utils.clone = function (src) {
    var deep = arguments[1] === undefined ? true : arguments[1];
    return Object.clone(src, deep, spec);
  };

  /**
   * object 'is' comparison
   * @param x {object}
   * @param y {object}
   * @returns {boolean}
   */
  utils.is = function (x, y) {
    return Object.is(x, y);
  };

  /** compares equality of two objects
   * @param x {object}
   * @param y {object}
   * @returns {boolean}
   */
  utils.isEqual = function (x, y) {
    return Object.equals(x, y, spec);
  };

  /**
   * shallow extend of src onto target
   * @param target {Object}
   * @param src {Object}
   * @returns {Object}
   */
  utils.assign = function (target, src) {
    return Object.assign(target, src);
  };

  /**
   * deep extend of src onto target
   * @param target {object}
   * @param src {object}
   * @returns {object}
   */
  utils.mixin = function (target, src) {
    return Object.mixin(target, src);
  };

  /**
   * lazy find from an iterable collection using es6 generators
   * @param iterable {collection}
   * @param predicate {function}
   * @yields {object}
   */
  utils.find = _generator2.find;

  /**
   * lazy select the first <number> of items to return from an iterable collection
   * @param iterable {collection}
   * @param number {int}
   * @yields {object}
   */
  utils.top = _generator2.top;

  /**
   * tests if value is a number
   * @param val {object}
   * @returns {boolean}
   */
  utils.isNumeric = function (val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  };

  //random functions namespace
  utils.random = _random2;

  //string functions namespace
  utils.string = _string2;

  //date functions namespace
  utils.date = _date2;

  //network functions namespace
  utils.network = _network2;

  //color function namespace
  utils.color = _color2;

  //currency function namespace
  utils.currency = _currency2;

  //url functions namespace
  utils.url = _url2;

  //array functions namespace
  utils.array = _array2;

  //path functions namespace
  utils.path = _path2;

  //object functions namespace
  utils.object = _object2;

  module.exports = utils;
});
