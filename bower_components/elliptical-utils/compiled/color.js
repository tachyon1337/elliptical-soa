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
        global.__tmp9z.color = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var color = {};

    color.rgb2hex = function (rgb) {
        if (rgb.search('rgb') == -1) {
            return rgb;
        } else if (rgb == 'rgba(0, 0, 0, 0)') {
            return 'transparent';
        } else {
            var hex = function (x) {
                return ('0' + parseInt(x).toString(16)).slice(-2);
            };

            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

            return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    };

    module.exports = color;
});