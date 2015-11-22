/*
 * =============================================================
 * elliptical.$Rest
 * =============================================================
 * generic rest provider
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('./provider'), require('elliptical-http'), require('./provider.odata'),require('./factory'),require('async'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','./provider', 'elliptical-http', './provider.odata','./factory','async'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Rest = factory(root.elliptical.utils,root.elliptical.Provider, root.elliptical.http, root.elliptical.$OData,root.elliptical.factory,root.async);
        root.returnExports = root.elliptical.$Rest;
    }
}(this, function (utils,Provider, http, $OData,factory,async) {

    var object=utils.object;
    var string=utils.string;

    var $Rest;
    $Rest = Provider.extend({
        _data: null,
        port: null,
        path: null,
        host: null,
        protocol: null,
        $queryProvider: $OData,
        onSend: null,
        withCredentials: false,

        /**
         * @constructs
         * @param {object} opts
         * @param {object} $queryProvider
         */
        init: function (opts, $queryProvider) {
            opts = opts || {};
            this.host = opts.host || this.constructor.host;
            this.host = this.host || 'localhost';
            this.port = opts.port || this.constructor.port;
            this.port = this.port || 80;
            this.path = opts.path || this.constructor.path;
            this.path = this.path || '/api';
            this.protocol = opts.protocol || this.constructor.protocol;
            this.protocol = this.protocol || 'http';
            this.withCredentials = opts.withCredentials || this.constructor.withCredentials;

            if ($queryProvider !== undefined) this.$queryProvider = $queryProvider;
        },

        /**
         * http get
         * @param params {Object}
         * @param resource {String}
         * @param query {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        get: function (params, resource, query, callback) {
            if (typeof query === 'function') callback = query;

            var options = this._getOptions(resource, 'GET', undefined);

            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q += '?' + key + '=' + val;
                        i++;
                    } else {
                        q += '&' + key + '=' + val;
                    }
                }
            }

            if (q !== '') options.path += (resource.indexOf('/') === -1) ? '/' + q : q;

            //test query options
            if (query && typeof query.filter !== 'undefined' && !object.isEmpty(query.filter)) {
                options.path += this.$queryProvider.filter(options.path, query.filter);
            }

            if (query && typeof query.orderBy !== 'undefined' && !object.isEmpty(query.orderBy)) {
                options.path += this.$queryProvider.orderBy(options.path, query.orderBy);
            }

            if (query && typeof query.orderByDesc !== 'undefined' && !object.isEmpty(query.orderByDesc)) {
                options.path += this.$queryProvider.orderByDesc(options.path, query.orderBy, query.orderByDesc);
            }

            if (query && typeof query.paginate !== 'undefined') {
                options.path += this.$queryProvider.paginate(options.path, query.paginate);
            } else {
                //don't allow mixing of paginate with skip/top since paginate is more or less a convenience wrapper for skip & top
                if (query && typeof query.skip !== 'undefined') options.path += this.$queryProvider.skip(options.path, query.skip);
                if (query && typeof query.top !== 'undefined') options.path += this.$queryProvider.top(options.path, query.top);
            }

            //send
            this._send(options, resource, callback);

        },

        /**
         * http post
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        post: function (params, resource, callback) {
            var options = this._getOptions(resource, 'POST', params);
            this._send(options, resource, callback);
        },



        /**
         * http put
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        put: function (params, resource, callback) {
            var options = this._getOptions(resource, 'PUT', params);
            this._send(options, resource, callback);
        },


        /**
         * http delete
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @public
         */
        delete: function (params, resource, callback) {
            if (params.ids && params.ids !== undefined) this.post(params.ids, resource, callback);
            else this._delete(params, resource, callback);
        },

        /**
         *
         * @param {object} params
         * @param {string} resource
         * @param {function} callback
         * @private
         */
        _delete: function (params, resource, callback) {
            var options = this._getOptions(resource, 'DELETE', undefined);
            var q = '';
            var i = 0;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = encodeURIComponent(params[key]);
                    if (i === 0) {
                        q += '?' + key + '=' + val;
                        i++;
                    } else {
                        q += '&' + key + '=' + val;
                    }
                }
            }

            if (q != '') options.path += '/' + q;

            //send
            this._send(options, resource, callback);
        },


        /**
         * send the request
         * @param {object} options
         * @param {string} resource
         * @param {function} callback
         * @private
         */
        _send: function (options, resource, callback) {

            /* we asynchronously pass through to _onAuthenticate and _onSend(if a callback has been defined)
             using the async waterfall pattern before passing off to http.
             Note: _onAuthenticate should be implemented by extending the $Rest provider and overwriting the current
             method which does nothing but pass through. You can also implement authentication by relying on the _onSend
             callback, which does pass up the request object, if available.
             ex:
             $myRestProvider.onSend=function(req, options, resource,callback){
             options.authorization=http.encodeSessionToken(req.cookies.authToken);
             callback.call(this,null,options);
             };

             pass the options object back as the data param in the callback
             */
            var req = this.req || {};
            var funcArray = [];
            var onAuth = factory.partial(this._onAuthentication, options, resource).bind(this);
            funcArray.push(onAuth);
            if (typeof this.onSend === 'function') {
                var onSendCallback = this.onSend;
                var onSend = factory.partial(this._onSend, onSendCallback, req, resource).bind(this);
                funcArray.push(onSend);
            }
            async.waterfall(funcArray, function (err, result) {
                (err) ? callback(err, null) : http.send(result, callback);
            });

        },

        /**
         * set authorization/authentication on the request; implement by extending the $Rest provider and class
         * and overwriting the method, returning options in the callback
         * @param {object} options
         * @param {string} resource
         * @param {function} callback
         * @private
         */
        _onAuthentication: function (options, resource, callback) {
            if (callback) callback.call(this, null, options);
        },


        /**
         * calls an onSend provided callback, if defined
         * @param {function} fn
         * @param {object} req
         * @param {string} resource
         * @param {object} options
         * @param {function} callback
         * @private
         */
        _onSend: function (fn, req, resource, options, callback) {
            fn.call(this, req, options, resource, callback);
        },

        /**
         * constructs the request options object
         * @param {string} method
         * @param {string} resource
         * @param {object} data
         * @returns {object}
         * @private
         */
        _getOptions: function (resource, method, data) {
            var options = {};
            options.host = this.host || this.constructor.host;
            options.port = this.port || this.constructor.port;
            options.method = method;
            options.path = this.path || this.constructor.path;
            resource = (string.firstChar(resource) === '/') ? resource : '/' + resource;
            options.path = options.path + resource;
            options.protocol = this.protocol || this.constructor.protocol;
            options.withCredentials = this.withCredentials || this.constructor.withCredentials;

            if (data && data !== undefined) options.data = data;

            return options;
        }


    });

    return $Rest;

}));


