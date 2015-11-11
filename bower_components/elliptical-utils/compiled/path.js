(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './array'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./array'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.__tmp9z.array);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.path = mod.exports;
    }
})(this, function (exports, module, _array) {
    'use strict';

    function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

    var _array2 = _interopRequire(_array);

    var isNumeric = function isNumeric(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    };

    var path_ = {};

    /**
     * converts a delimited path into an array of props
     * 'items.0.FirstName' --> [items,0,FirstName]
     *
     * @param path {string}
     * @param separator {string}
     * @returns {array}
     */
    path_.split = function (path) {
        var separator = arguments[1] === undefined ? '.' : arguments[1];

        if (typeof path === 'undefined' || path === '') {
            return [];
        } else {
            if (_array2.isArray(path)) {
                return path.slice(0);
            } else {
                return path.toString().split(separator);
            }
        }
    };

    /**
     * resolves the value of an object path
     * obj, 'items.0.FirstName'  --> 'John','FirstName'
     * returns an array of value,prop
     *
     * @param a {object}
     * @param path {string}
     * @param options {object}
     * @returns {array}
     */
    path_.resolve = function (a, path, options) {
        var e, k, last, stack;
        if (options == null) {
            options = {};
        }
        stack = path_.split(path);
        last = [stack.pop()];
        e = a;
        while ((k = stack.shift()) !== void 0) {
            if (e[k] !== void 0) {
                e = e[k];
            } else {
                stack.unshift(k);
                break;
            }
        }
        if (options.force) {
            while ((k = stack.shift()) !== void 0) {
                if (typeof stack[0] === 'number' || stack.length === 0 && typeof last[0] === 'number') {
                    e[k] = [];
                } else {
                    e[k] = {};
                }
                e = e[k];
            }
        } else {
            while ((k = stack.pop()) !== void 0) {
                last.unshift(k);
            }
        }
        return [e, last];
    };

    /**
     * resolves the value of an object path
     * obj, 'items.0.FirstName'  --> 'John'
     *
     * @param obj {object}
     * @param path {string}
     * @returns value
     */
    path_.objectProperty = function (obj, path) {
        try {
            var _ret = (function () {
                var pathArray = path.split(path);
                var a = obj;
                pathArray.forEach(function (p) {
                    var b = a[p];
                    a = b;
                });
                return {
                    v: a
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        } catch (ex) {
            return undefined;
        }
    };

    /**
     *
     * @param obj {object}
     * @param path {string}
     * @param value {object}
     * @returns void
     */
    path_.assignValueTo = function (obj, path, value) {
        try {
            var pathArray = path_.split(path);
            var a = obj;
            var len = pathArray.length;
            var max = len - 1;
            for (var i = 0; i < len; i++) {
                if (i === max) {
                    a[pathArray[i]] = value;
                } else {
                    var b = a[pathArray[i]];
                    a = b;
                }
            }
        } catch (ex) {}
    };

    /**
     * return the length of an array property of an object by path
     * @param obj {object}
     * @param path {string}
     * @returns {number}
     */
    path_.arrayPropertyLength = function (obj, path) {
        var prop = path_.objectProperty(obj, path);
        return prop && _array2.isArray(prop) ? prop.length : null;
    };

    /**
     * tests if a value of an object path is an array
     * @param obj
     * @param path
     * @returns {boolean}
     */
    path_.isPropertyArray = function (obj, path) {
        var prop = path_.objectProperty(obj, path);
        return _array2.isArray(prop);
    };

    /**
     * returns the index of the path
     * @param path {string}
     * @returns {object}
     */
    path_.getIndexOf = function (path) {
        if (path !== undefined) {
            var parts = path.split('.');
            var _length = undefined;
            if (parts.length) {
                _length = parts.length;
                _length--;
                return parts[_length];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    };

    /**
     * is path part of an array
     * @param path {string}
     * @returns {boolean}
     */
    path_.isInArray = function (path) {
        var index = undefined.getIndexOf(path);
        return index !== undefined ? isNumeric(index) : undefined;
    };

    /**
     * converts an array(of contexts and indices) and a property into a path string
     * [{index:5,context:User},{index:0,context:Address}],City ---> User.5.Address.0.City
     * @param arr {array}
     * @param prop {string}
     * @returns {string}
     */
    path_.create = function (arr, prop) {
        var path = '';
        if (arr && arr.length) {
            arr.forEach(function (obj) {
                path += obj.context + '.' + obj.index + '.';
            });

            typeof prop !== 'undefined' ? path += prop : path = path.substring(0, path.length - 1);
            return path;
        }
    };

    /**
     * converts an array of object properties into a path
     * @param arr {array}
     * @returns {string} path
     */
    path_.createFromArray = function (arr) {
        var path = '';
        if (arr && arr.length) {
            var index = 0;
            arr.forEach(function (obj) {
                path += index < arr.length - 1 ? obj + '.' : obj;
                index++;
            });
            return path;
        }
    };

    /**
     * deletes an obj prop by path
     * @param obj {object}
     * @param path {string}
     */
    path_.deleteObjectProperty = function (obj, path) {
        var pathArray = path_.split(path);
        var a = obj;
        var len = pathArray.length;
        var max = len - 1;
        for (var i = 0; i < len; i++) {
            if (i === max) {
                delete a[pathArray[i]];
            } else {
                var b = a[pathArray[i]];
                a = b;
            }
        }
    };

    /**
     * tests if a prop is the last node in a path
     * @param path {string}
     * @param prop {string}
     * @returns {boolean}
     */
    path_.isProperty = function (path, prop) {
        var splitPath = path_.split(path);
        var prop_ = splitPath.pop();
        return prop_ === prop;
    };

    /**
     * deletes an object from an array by id value
     * @param obj {object}
     * @param idProp {string}
     * @param id {string}
     * @returns {number} the index of the deleted object
     */
    path_.deleteObjectByIdFromArrayProp = function (obj, idProp, id) {
        var index = null;
        if (!_array2.isObjectPropertyByIndex(obj, 0)) {
            return index;
        }
        var arr = obj[Object.keys(obj)[0]];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][idProp].toString() === id.toString()) {
                arr.splice(i, 1);
                index = i;
                break;
            }
        }

        return index;
    };

    /**
     * finds an object in a $scope model list by id
     * @param obj {object}
     * @param idProp {string}
     * @param id {string}
     * @returns {object}
     */
    path_.selectObjectByIdFromArrayProp = function (obj, idProp, id) {
        var obj_ = undefined;
        var index = null;
        if (!_array2.isObjectPropertyByIndex(obj, 0)) {
            return index;
        }
        var arr = obj[Object.keys(obj)[0]];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][idProp].toString() === id.toString()) {
                obj_ = arr[i];
                break;
            }
        }
        return obj_;
    };

    /**
     * inserts an index into a model list path(at path index=1)
     * @param path {String}
     * @param index {Number}
     * @returns {String}
     */
    path_.replaceIndex = function (path, index) {
        var arr = path_.split(path);
        arr[1] = index;
        return arr.join('.');
    };

    /**
     * returns a normalized path format for Object.observe change record reporting
     * @param path {string}
     * @returns {string}
     */
    path_.map = function (path) {
        var arr = path_.split(path);
        var num = isNumeric;
        if (arr && arr.length) {
            var mapped = arr.map(function (v) {
                return num(v) ? '[' + v.toString() + ']' : v;
            });
            return mapped.join('.').replace(/.\[/, '[');
        } else {
            return path;
        }
    };

    module.exports = path_;
});