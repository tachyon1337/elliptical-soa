/*
 * =============================================================
 * elliptical.$Session
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Session = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Session;
    }
}(this, function (Class) {

    var $Session;
    $Session = Class.extend({


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var value = sessionStorage.getItem(key);
            try {
                value = JSON.parse(value);
            } catch (ex) {

            }

            return value;
        },

        /**
         * @param {string} key
         * @param {object} value
         * @param {object} params - not used by this provider
         * @public
         */
        set: function (key, value, params) {
            if (typeof value === 'object') value = JSON.stringify(value);
            sessionStorage.setItem(key, value);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete: function (key) {
            sessionStorage.removeItem(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return sessionStorage.length;
        },

        /**
         * @public
         */
        clear: function () {
            sessionStorage.clear();
        }


    }, {});


    return $Session;

}));


