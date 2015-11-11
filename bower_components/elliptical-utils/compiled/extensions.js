(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.extensions = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    (function (global) {
        String.prototype.toCamelCase = function () {
            return this.replace(/[-_]([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
        };
        String.prototype.toTitleCase = function () {
            return this.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
        String.prototype.toPixel = function () {
            var val = parseInt(this, 10);
            val = val.toString() + 'px';
            return val;
        };
        Number.prototype.toPixel = function () {
            var val = parseInt(this, 10);
            val = val.toString() + 'px';
            return val;
        };
        String.prototype.toFloatPixel = function () {
            return this.toString() + 'px';
        };
        Number.prototype.toFloatPixel = function () {
            return this.toString() + 'px';
        };
        String.prototype.toInteger = function () {
            return parseInt(this.replace('px', ''), 10);
        };
        String.prototype.toMillisecond = function () {
            var val = parseInt(this, 10);
            val = val.toString() + 'ms';
            return val;
        };
        Number.prototype.toMillisecond = function () {
            var val = parseInt(this, 10);
            val = val.toString() + 'ms';
            return val;
        };
    })(undefined);
});