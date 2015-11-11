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
        global.__tmp9z.currency = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var currency = {};

    /**
     *
     * @param v {string}
     * @returns {float}
     */
    currency.parse = function (v) {
        if (typeof v === 'string') {
            v = v.replace('$', '');
            v = v.replace(/,/g, '');
            v = parseFloat(v);
        }
        return v;
    };

    /**
     *
     * @param val {float}
     * @returns {float}
     */
    currency.format = function (val) {
        val = parseFloat(value);
        return val.toFixed(2);
    };

    /**
     *
     * @param v {float}
     * @param q {number}
     * @returns {float}
     */
    currency.extendedAmount = function (v, q) {
        if (typeof v === 'string') {
            v = v.replace('$', '');
            v = parseFloat(v);
        }
        return currency.format(v * q);
    };

    module.exports = currency;
});