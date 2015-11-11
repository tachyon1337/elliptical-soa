/*
 * =============================================================
 * elliptical.$Sort
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'),require('elliptical-location').Location);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class','elliptical-location'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Sort = factory(root.elliptical.class,root.elliptical.Location);
        root.returnExports = root.elliptical.$Sort;
    }
}(this, function (Class,Location) {
    if(Location.Location !==undefined) Location=Location.Location;
    var $Sort;

    $Sort = Class.extend({

        /**
         * @param {object} params
         * @public
         */
        sort: function (params) {
            var sortOrder = params.sortOrder;
            var field = params.field;
            var url = Location.href;
            var queryVar = (sortOrder === 'asc') ? '$orderBy' : '$orderByDesc';
            var path = this._getSortUrl(url, field, queryVar);
            Location.href=path;
        },

        /**
         * @param {object} params
         * @public
         */
        sorted: function (params) {
            var url = Location.href;
            if (url.indexOf('$orderBy') <= -1) return null;
            else {
                var field = Location.url.queryString(url, '$orderBy');
                if (field && field !== undefined) {
                    return {
                        field: field,
                        sort: 'asc'
                    };
                } else {
                    return {
                        field: Location.url.queryString(url, '$orderByDesc'),
                        sort: 'desc'
                    }
                }
            }
        },

        refresh: function (params) {
            if (typeof params === 'string') Location.redirect(params);
        },

        _getSortUrl: function (url, val, queryVar) {
            var index = url.indexOf('$orderBy');
            var str = queryVar + '=' + encodeURIComponent(val);
            if (index > -1) {
                url = url.substr(0, index) + str;
                return url;
            } else {
                url += (url.indexOf('?') > -1) ? '&' + str : '?' + str;
                return url;
            }
        }


    }, {});


    return $Sort;

}));
