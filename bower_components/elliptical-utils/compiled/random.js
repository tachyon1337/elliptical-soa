(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.random = mod.exports;
    }
})(this, function (exports, module) {
    "use strict";

    var random = {};
    random.guid = function () {
        var S4 = function S4() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };

    random.str = function () {
        var length = arguments[0] === undefined ? 16 : arguments[0];

        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = "";
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    };

    random.id = function () {
        var length = arguments[0] === undefined ? 16 : arguments[0];

        var chars = "0123456789";
        var result = "";
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    };

    random.emptyGuid = function () {
        return "00000000-0000-0000-0000-000000000000";
    };

    random.isEmptyGuid = function (val) {
        return Object.is(val, random.emptyGuid());
    };

    module.exports = random;
});