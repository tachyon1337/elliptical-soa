
/*
 * =============================================================
 * elliptical.$Navigation
 * =============================================================
 *  detail prev/next navigation
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Navigation = factory(root.elliptical.utils,root.elliptical.Class);
        root.returnExports = root.elliptical.$Navigation;
    }
}(this, function (utils,Class) {
    var array=utils.array;
    var string=utils.string;

    var $Navigation;
    $Navigation = Class.extend({
        idProp:'id',
        nextQS:'?dir=next',
        prevQS:'?dir=prev',

        /**
         *
         * @param {object} params
         * @returns {{next: null, prev: null}}
         * @public
         */
        get:function(params){
            var navigation={
                next: null,
                prev: null
            };

            var nav=params.data;
            if(!nav)return navigation;
            var id = params.id;
            var baseUrl=params.baseUrl;
            if(string.lastChar(baseUrl)!=='/') baseUrl+='/';

            var idProp=this.idProp;
            var nextQS=this.nextQS;
            var prevQS=this.prevQS;

            var index = this._getIndex(nav, id, idProp);
            var length = nav.length;
            length = length - 1;
            if (index < length) navigation.next = baseUrl + nav[index + 1][idProp] + nextQS;
            if (index > 0) navigation.prev = baseUrl + nav[index - 1][idProp] + prevQS;

            return navigation;

        },

        _getIndex:function(data, id, idProp){
            return array.indexById(data,id,idProp);
        }

    }, {});



    return $Navigation;

}));


