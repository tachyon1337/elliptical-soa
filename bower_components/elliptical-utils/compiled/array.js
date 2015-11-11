(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module", "./generator"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module, require("./generator"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.__tmp9z.generator);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.array = mod.exports;
    }
})(this, function (exports, module, _generator) {
    "use strict";

    function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

    var _generator2 = _interopRequire(_generator);

    var array = {};

    /**
     * tests if array
     * @param obj {*}
     * @retuns {boolean}
     */
    array.isArray = function (obj) {
        return /Array/.test(Object.prototype.toString.call(obj));
    };

    /**
     * is object/value in array
     * @param arr {Array}
     * @param obj {Object}
     * @returns {Boolean}
     */
    array.inArray = function (arr, obj) {
        return _generator2.find(arr, function (o) {
            return Object.is(o, obj);
        });
    };

    /**
     * remove of an array of items from an array
     * @param arr1 {Array}
     * @param arr2 {Array}
     * @returns {Array}
     */
    array.remove = function (arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            if (array.inArray(arr2, arr1[i])) {
                arr1.splice(i, 1);
            }
        }
        return arr1;
    };

    /**
     * merge two arrays
     * @param a {Array}
     * @param b {Array}
     * @returns {Array}
     */
    array.merge = function (a, b) {
        var i = a.length,
            j = 0;

        if (typeof b.length === "number") {
            for (var l = b.length; j < l; j++) {
                a[i++] = b[j];
            }
        } else {
            while (b[j] !== undefined) {
                a[i++] = b[j++];
            }
        }

        a.length = i;

        return a;
    };

    /**
     *
     * @returns {Array}
     */
    array.makeArray = function (arr, results) {
        var ret = results || [];

        if (arr != null) {
            var type = typeof arr;
            if (arr.length == null || type === "string" || type === "function" || type === "regexp") {
                ret.push(arr);
            } else {
                array.merge(ret, arr);
            }
        }

        return ret;
    };

    /**
     * concatenate two arguments
     * @param arr {Array}
     * @param args {Array}
     * @returns {Array}
     */
    array.concatArgs = function (arr, args) {
        return array.makeArray(arr).concat(array.makeArray(args));
    };

    /**
     * empty an array
     * @param arr {Array}
     */
    array.empty = function (arr) {
        return arr.splice(0, arr.length);
    };

    array.clone = function (arr) {
        return arr.slice(0);
    };

    /**
     * tests if valid val for an array index
     * @param val {number}
     */
    array.isValidIndex = function (val) {
        return /^[0-9]+$/.test(String(val));
    };

    /**
     * validates if the value of an object prop is an array
     * @param obj {Object}
     * @param prop {String}
     * @returns {boolean}
     */
    array.isObjectProperty = function (obj, prop) {
        return !!Array.isArray(obj[prop]);
    };

    /**
     * validates if the value of an object prop by index is an array
     * @param obj {Object}
     * @param index {Number}
     * @returns {boolean}
     */
    array.isObjectPropertyByIndex = function (obj, index) {
        try {
            var o = obj[Object.keys(obj)[index]];
            return !!Array.isArray(o);
        } catch (ex) {
            return false;
        }
    };

    array.indexById = function (arr, id) {
        var idProp = arguments[2] === undefined ? "id" : arguments[2];

        if (arr.length && arr.length > 0) {
            var len = arr.length;
            var index = undefined;
            for (var i = 0; i < len; i++) {
                if (arr[i][idProp] === id) {
                    index = i;
                    break;
                }
            }
            return index;
        } else {
            return null;
        }
    };

    /**
     * finds an object in an array by id
     * @param arr {Array}
     * @param id {String}|{Number}
     * @param propId {String}
     * @returns {Object}
     */
    array.findById = function (arr, id) {
        var propId = arguments[2] === undefined ? "id" : arguments[2];

        return _generator2.find(arr, function (obj) {
            return obj[propId] === id;
        });
    };

    module.exports = array;
});
