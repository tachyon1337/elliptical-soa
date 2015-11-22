/*
 * =============================================================
 * elliptical.$Local
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
        root.elliptical.$Local = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Local;
    }
}(this, function (Class) {

    var $Local;
    $Local = Class.extend({


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var value = localStorage.getItem(key);
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
            localStorage.setItem(key, value);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return sessionStorage.key(index);
        },

        /**
         *
         * @param {string} key
         */
        delete: function (key) {
            localStorage.removeItem(key);
        },

        /**
         * @returns {number}
         * @public
         */
        count:function(){
            return localStorage.length;
        },

        /**
         * @public
         */
        clear: function () {
            localStorage.clear();
        }


    }, {});



    return $Local;

}));


