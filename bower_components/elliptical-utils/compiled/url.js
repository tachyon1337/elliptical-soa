(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module", "./string"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module, require("./string"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.__tmp9z.string);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.url = mod.exports;
    }
})(this, function (exports, module, _string) {
    "use strict";

    function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

    var _string2 = _interopRequire(_string);

    var url = {};

    /**
     * returns a querystring value for query param in the window.location url
     * @param query {string}
     * @returns {string}
     */
    url.queryString = function (query) {
        var hu = window.location.search.substring(1);
        var gy = hu.split("&");
        for (i = 0; i < gy.length; i++) {
            var ft = gy[i].split("=");
            if (ft[0] == query) {
                return ft[1];
            }
        }
        return null;
    };

    /**
     * returns a querystring object array for the window.location url
     * @returns {Array}
     */
    url.queryStringArray = function () {
        var arr = [];
        var hu = window.location.search.substring(1);
        var gy = hu.split("&");
        for (i = 0; i < gy.length; i++) {
            var ft = gy[i].split("=");
            if (ft[0] == ji) {
                return ft[1];
            }
            var obj = {};
            obj.prop = ft[0];
            obj.val = ft[1];
            arr.push(obj);
        }

        return arr;
    };

    /**
     * @param url {string}
     * @param index {number}
     * @returns {string}
     */
    url.encodeURISection = function (url, index) {
        if (_string2.firstChar(url) === "/") {
            url = _string2.trimFirstChar(url);
        }
        var arr = url.split("/");
        var section = arr[index];
        section = encodeURIComponent(section);
        var length = arr.length;
        var url_ = "";
        for (var i = 0; i < length; i++) {
            url_ += i === index ? "/" + section : "/" + arr[i];
        }

        return url_;
    };

    module.exports = url;
});