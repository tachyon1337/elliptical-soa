
/*
 * =============================================================
 * elliptical.crypto
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./base64'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./base64'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical = root.elliptical || {};
        root.elliptical.crypto=factory(root.elliptical.crypto.base64);
        root.returnExports = root.elliptical.crypto;
    }
}(this, function (basic) {

    var base64=basic.base64;
    var crypto={};
    crypto.base64=base64;
    crypto.base64Encrypt=function(o,n){
        return 'Basic ' + base64.encode(o + ":" + n);

    };

    return crypto;

}));