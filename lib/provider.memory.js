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
        root.elliptical.$Memory = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Memory;
    }
}(this, function (Class) {

    var $Memory;
    $Memory = Class.extend({

        _Map: {
            _map:null,
            get dictionary(){
                if(this._map) return this._map;
                else return new Map();
            }
        },


        /**
         * @param {string} key
         * @returns {object}
         * @public
         */
        get: function (key) {
            var map=this._Map.dictionary;
            return map.get(key);

        },

        /**
         * @param {string} key
         * @param {object} value
         * @param {object} params - not used by this provider
         * @public
         */
        set: function (key, value, params) {
            var map=this._Map.dictionary;
            map.set(key,value);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            var map=this._Map.dictionary;
            var i=0;
            var key_=null;
            map.forEach(function(value, key) {
                if(index===i) key_=key;
                i++;
            });

            return key_;
        },

        /**
         *
         * @param {string} key
         */
        delete: function (key) {
            var map=this._Map.dictionary;
            map.delete(key);
        },

        /**
         * @returns {number}
         * @public
         */
        count:function(){
            var map=this._Map.dictionary;
            return map.size;
        },

        /**
         * @public
         */
        clear: function () {
            var map=this._Map.dictionary;
            map.clear();
        }


    }, {});



    return $Memory;

}));


