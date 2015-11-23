
/*
 * =============================================================
 * elliptical.Service
 * =============================================================
 *
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
        root.elliptical.Service=factory(root.elliptical.utils,root.elliptical.Class);
        root.returnExports = root.elliptical.Service;
    }
}(this, function (utils,Class) {

    utils.toQueryable=function(obj){
        if(typeof obj!=='object')return obj;
        var qry={};
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                if(key.indexOf('$')!==0)qry[key]=obj[key];
            }
        }
        return qry;
    };

    var object=utils.object;
    var Service;
    Service = Class.extend({
            id: 'id', //{String} set a custom id property other than 'id'
            _data: null, //{Object}
            '@resource': null, //{String}
            $provider: {}, //{Class|Object|Function}
            $paginationProvider: null,//{Class|Object|Function}


            /**
             * @static
             */

            /**
             * get
             * @param {object} params
             * @param {object} query
             * @param {function} callback
             * @public
             */
            get: function (params, query, callback) {
                if (typeof query === 'function') {
                    callback = query;
                    query = {};
                }
                var self = this,
                    $provider = this.$provider,
                    $paginationProvider = this.$paginationProvider,
                    resource = this['@resource'],
                    result=null;

                $provider.get(params, resource, query, function (err, data) {
                    if (!err) {
                        if (query.paginate && $paginationProvider) {
                            result = $paginationProvider.get(query, data);
                            self._data = result.data;
                        } else {
                            result = data;
                            self._data = data;
                        }
                    }
                    result = self.onGet(result);
                    if (callback) callback(err, result);
                });
            },

            onGet:function(data){return data},



            /**
             * post
             * @param {object} params
             * @param {function} callback
             * @public
             */
            post: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.post(params, resource, callback);

            },

            /**
             * put
             * @param {object} params
             * @param {function} callback
             * @public
             */
            put: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.put(params, resource, callback);

            },


            /**
             * delete
             * @param {object} params
             * @param {function} callback
             * @public
             */
            delete: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.delete(params, resource, callback);
            }




        },

        /**
         * @prototype
         */

        {
            _data: null,

            /**
             * @constructs
             * @param {object} params
             * @public
             */
            init: function (params) {
                /* this will get passed up as the params in below methods if params not explicitly passed in the calls */
                this._data = params;
                this.$query = {};
            },

            /**
             * @param {object} params
             * @param {function} callback
             * @public
             */
            get: function (params, callback) {
                var data = this._data,
                    query = this.$query;

                (typeof params === 'function') ? callback = params : data = params;
                this.constructor.get(data, query, callback);
            },

            /**
             * @param {object} params
             * @param {function} callback
             * @public
             */
            save: function (params, callback) {
                var data = this._data;
                var length = arguments.length;
                if (length === 0) params = data;
                else if (length === 1 && typeof params === 'function') {
                    callback = params;
                    params = data;
                }
                var idProp = this.constructor.id;
                if (params === undefined || params[idProp] === undefined) {
                    /* post */
                    this.constructor.post(params, callback);
                } else {
                    /* put */
                    this.constructor.put(params, callback);
                }
            },

            /**
             * @param {object} params
             * @param {function} callback
             * @public
             */
            put: function (params, callback) {
                var data = this._data;
                (typeof params === 'function') ? callback = params : data = params;
                this.constructor.put(data, callback);
            },


            /**
             *
             * @param {object} val
             * @public
             */
            filter: function (val) {
                if(val){
                    if(typeof val==='object'){
                        var newVal=utils.toQueryable(val);
                        if(!object.isEmpty(newVal))this.$query.filter = newVal;
                    }else{
                        this.$query.filter = val;
                    }
                }
                return this;
            },

            /**
             *
             * @param {object} val
             * @public
             */
            orderBy: function (val) {
                if(val && !object.isEmpty(val))this.$query.orderBy = val;
                return this;
            },

            /**
             *
             * @param {object} val
             * @public
             */
            orderByDesc: function (val) {
                if(val && !object.isEmpty(val))this.$query.orderByDesc = val;
                return this;
            },

            /**
             *
             * @param {object} val
             */
            top: function (val) {
                if(val && !object.isEmpty(val))this.$query.top = val;
                return this;
            },

            /**
             *
             * @param {object} val
             * @public
             */
            skip: function (val) {
                if(val && !object.isEmpty(val))this.$query.skip = val;
                return this;
            },

            /**
             *
             * @param {object} params
             * @public
             */
            paginate: function (params) {
                try {
                    params.page = parseInt(params.page);
                } catch (ex) {
                    params.page = 1;
                }
                this.$query.paginate = params;
                return this;
            },

            /**
             * @param {object} params
             * @param {function} callback
             * @public
             */
            delete: function (params, callback) {
                var data = this._data;
                (typeof params === 'function') ? callback = params : data = params;
                this.constructor.delete(data, callback);
            }

        });


    return Service;

}));

/*
 * =============================================================
 * elliptical.Provider
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
        root.elliptical.Provider=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Provider;
    }
}(this, function (Class) {

    return Class.extend({
        "@resource":null
    },{});

}));


/*
 * =============================================================
 * elliptical.factory
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').func);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.factory=factory(root._.func);
        root.returnExports = root.elliptical.factory;
    }
}(this, function (_) {
    if(_.func !==undefined) _=_.func;

    var factory;
    factory = {
        partial: function () {
            var args = [].slice.call(arguments);
            return _.partial.apply(this, args);
        },

        partialRight: function () {
            var args = [].slice.call(arguments);
            return _.partialRight.apply(this, args);
        },

        curry: function () {
            var args = [].slice.call(arguments);
            return _.curry.apply(this, args);
        },

        defer: function () {
            var args = [].slice.call(arguments);
            return _.defer.apply(this, args);
        },

        delay: function () {
            var args = [].slice.call(arguments);
            return _.delay.apply(this, args);
        },

        after: function () {
            var args = [].slice.call(arguments);
            return _.after.apply(this, args);
        },

        bind: function () {
            var args = [].slice.call(arguments);
            return _.bind.apply(this, args);
        },

        bindKey: function () {
            var args = [].slice.call(arguments);
            return _.bindKey.apply(this, args);
        },

        bindAll: function () {
            var args = [].slice.call(arguments);
            return _.bindAll.apply(this, args);
        },

        debounce: function () {
            var args = [].slice.call(arguments);
            return _.debounce.apply(this, args);
        },

        throttle: function () {
            var args = [].slice.call(arguments);
            return _.throttle.apply(this, args);
        },


        wrap: function () {
            var args = [].slice.call(arguments);
            return _.wrap.apply(this, args);
        },

        memoize: function () {
            var args = [].slice.call(arguments);
            return _.memoize.apply(this, args);
        }

    };

    return factory;

}));


/*
 * =============================================================
 * elliptical.noop
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.noop=factory();
        root.returnExports = root.elliptical.noop;
    }
}(this, function () {

    return{
        noop:function(){},
        throwErr:function(err){
            if (err) {
                throw err;
            }
        },
        doop:function(fn,args,context){
            if(typeof fn==='function') {
                return fn.apply(context, args);
            }
        }
    }


}));

/*
 * =============================================================
 * elliptical.Interval
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./debounce'),require('./throttle'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./debounce','./throttle'], factory);
    } else {
        root.elliptical.Interval=factory(root.elliptical.debounce,root.elliptical.throttle);
        root.returnExports = root.elliptical.Interval;
    }
}(this, function (debounce,throttle) {

    function _exe(fn,opts){
        fn();
    }

    return function Interval(opts){
        this.delay=opts.delay;
        this.timeOutId=null;
        if(opts.thread==='throttle')this.thread=throttle;
        else if(opts.thread==='debounce')this.thread=debounce;
        else{
            this.thread=_exe;
        }
        this.run=function(fn){
            var self=this;
            this.timeOutId=setInterval(function(){
                self.thread(fn,{
                    delay:10
                });

            },self.delay);
        };

        this.terminate=function(){
            clearInterval(this.timeOutId);
        }
    };


}));


/*
 * =============================================================
 * elliptical.debounce
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').func);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.debounce=factory(root._.func);
        root.returnExports = root.elliptical.debounce;
    }
}(this, function (_) {
    if(_.func !==undefined) _=_.func;

    return function debounce(fn,delay,opts){
        if(typeof delay==='undefined'){
            delay=1000;
        }
        if(typeof opts==='undefined'){
            opts={};
        }
        _.debounce(fn,delay,opts);
    }


}));


/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */



(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    }else if (typeof module === 'object' && module.exports) {
        //CommonJS module

        if(typeof window!='undefined'){
            factory($);
        }

    } else {
        // Browser globals.
        factory($);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch(er) {}
    }

    var config = $.cookie = function (key, value, options) {
        config.raw = true;
        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

    return $;

}));


/*
 * =============================================================
 * elliptical.$Cookie
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
        root.elliptical.$Cookie = factory(root.elliptical.Class);
        root.returnExports = root.elliptical.$Cookie;
    }
}(this, function (Class) {

    function _getCookies() {
        var cookies = [];
        if (document.cookie && document.cookie != '') {
            var _cookies = document.cookie.split(';');
            for (var i = 0; i < _cookies.length; i++) {
                var name_value = _cookies[i].split("=");
                name_value[0] = name_value[0].replace(/^ /, '');
                cookies.push({
                    key:decodeURIComponent(name_value[0]),
                    value:decodeURIComponent(name_value[1])
                })
            }
        }
        return cookies;
    }

    var $Cookie;
    $Cookie = Class.extend({

        /**
         * @param {string} key
         * @returns {object}
         * @public
         */

        get: function (key) {
            var value= $.cookie(key);
            try {
                value = JSON.parse(value);
            } catch (ex) {
                value=null;
            }
            return value;
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set: function (key,value,params) {
            if(params===undefined){
                params={};
                params.path='/';
            }
            if(params.path===undefined)params.path='/';
            if (params.expires === undefined) params.expires = 365;
            if(typeof value==='object')value=JSON.stringify(value);
            $.cookie(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            var cookies = _getCookies();
            try{
                return cookies[index].key;
            }catch(ex){
                return null;
            }
        },

        /**
         *
         * @param {string} key
         * @param {object} params
         * @public
         */
        delete: function (key,params) {
            if(params===undefined)params={path:'/'};
            $.removeCookie(key,params);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            var cookies = document.cookie.split('; ');
            return cookies.length;
        },

        /**
         * @public
         */
        clear:function(){
            throw "Method 'clear' not implemented by the cookie provider";
        }

    }, {});



    return $Cookie;

}));

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



/*
 * =============================================================
 * elliptical.$Memory
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



/*
 * =============================================================
 * elliptical.$OData
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.$OData = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$OData;
    }
}(this, function (Provider) {

    var $OData;
    $OData = Provider.extend({

        /**
         *
         * @param {string} endpoint
         * @param {*} filter
         * @returns {string}
         */
        filter: function (endpoint, filter) {
            if (typeof filter === 'object') filter = this._getFilterString(filter);
            var encodedFilter = '$filter=' + encodeURIComponent(filter);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedFilter : '?' + encodedFilter;
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} orderBy
         * @returns {string}
         * @public
         */
        orderBy: function (endpoint, orderBy) {
            var encodedOrderBy = '$orderby=' + encodeURIComponent(orderBy);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderBy : '?' + encodedOrderBy;
        },

        /**
         *
         * @param endpoint
         * @param orderBy
         * @param orderByDesc
         * @returns {string}
         * @public
         */
        orderByDesc: function (endpoint, orderBy, orderByDesc) {
            if (orderBy !== undefined) return ', ' + encodeURIComponent(orderByDesc + ' desc');
            else {
                var encodedOrderByDesc = '$orderby=' + encodeURIComponent(orderByDesc + ' desc');
                return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderByDesc : '?' + encodedOrderByDesc;
            }
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} top
         * @returns {string}
         * @public
         */
        top: function (endpoint, top) {
            var encodedTop = '$top=' + top;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedTop : '?' + encodedTop;
        },

        /**
         *
         * @param {string} endpoint
         * @param {string} skip
         * @returns {string}
         * @public
         */
        skip: function (endpoint, skip) {
            var encodedSkip = '$skip=' + skip;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedSkip : '?' + encodedSkip;
        },

        /**
         *
         * @param {string} endpoint
         * @param {object} params
         * @returns {string}
         * @public
         */
        paginate: function (endpoint, params) {
            var page = params.page,
                pageSize = params.pageSize,
                skip,
                encodedPaginate;

            if (typeof page === 'undefined' || typeof pageSize === 'undefined') return endpoint;
            else {
                page--;
                skip = page * pageSize;
                encodedPaginate = (skip > 0) ? '$skip=' + skip + '&$top=' + pageSize + '&$inlinecount=allpages' : '$top=' + pageSize + '&$inlinecount=allpages';
                return (endpoint.indexOf('?') > -1) ? '&' + encodedPaginate : '?' + encodedPaginate;
            }
        },

        _getFilterString: function (query) {
            /*
             default:[field] eq [value]

             sw_[field]==startswith
             swl_[field]==startswith, tolower
             swu_[field]==startswith, toupper
             c_[field]==contains
             cl_[field]==contains,tolower
             cu_[field]==contains,toupper
             ew_[field]==endswith
             ewl_[field]==endswith,tolower
             ewu_[field]==endswith,toupper
             eql_[field]==eq, tolower
             equ_[field]==eq,toupper

             examples: sw_Name=Bob ---> startswith(Name,'Bob')
             Name=Bob --> Name eq 'Bob'
             cl_Name=B ---> substringof(tolower(Name),tolower('B'))
             */
            var str = '';
            var checksum = 0;
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var prop;
                    var value = decodeURIComponent(query[key]);
                    if (key.indexOf('sw_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and startswith(" + prop + ",'" + value + "')" : "startswith(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('swl_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(tolower(" + prop + "),tolower('" + value + "'))" : "startswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('swu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and startswith(toupper(" + prop + "),toupper('" + value + "'))" : "startswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('c_') === 0) {
                        prop = key.substring(2);
                        str += (checksum > 0) ? " and substringof(" + prop + ",'" + value + "')" : "substringof(" + prop + ",'" + value + "')";
                        checksum++;
                    } else if (key.indexOf('cl_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and substringof(tolower(" + prop + "),tolower('" + value + "'))" : "substringof(tolower(" + prop + "),(tolower('" + value + "'))";
                        checksum++;
                    } else if(key.indexOf('cu_')===0){
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and substringof(toupper(" + prop + "),toupper('" + value + "'))" : "substringof(toupper(" + prop + "),(toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('ew_') === 0) {
                        prop = key.substring(3);
                        str += (checksum > 0) ? " and endswith(" + prop + ",'" + value + "')" : "endswith(" + prop + ",'" + value + "')";
                        checksum++;
                    }else if (key.indexOf('ewl_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(tolower(" + prop + "),tolower('" + value + "'))" : "endswith(tolower(" + prop + "),tolower('" + value + "'))";
                        checksum++;
                    }else if(key.indexOf('ewu_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and endswith(toupper(" + prop + "),toupper('" + value + "'))" : "endswith(toupper(" + prop + "),toupper('" + value + "'))";
                        checksum++;
                    } else if (key.indexOf('eql_') === 0) {
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and tolower(" + key + ") eq tolower('" + value + "')" : "tolower(" + key + ") eq tolower('" + value + "')";
                        checksum++;
                    }else if(key.indexOf('equ_')===0){
                        prop = key.substring(4);
                        str += (checksum > 0) ? " and toupper(" + key + ") eq toupper('" + value + "')" : "toupper(" + key + ") eq toupper('" + value + "')";
                        checksum++;
                    } else if (key.indexOf('$') !== 0) {
                        str += (checksum > 0) ? " and " + key + " eq '" + value + "'" : key + " eq '" + value + "'";
                        checksum++;
                    }

                }
            }

            return str;
        }

    }, {});

    return $OData;


}));


/*
 * =============================================================
 * elliptical.$Template
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('./provider'), require('dustjs'),require('elliptical-dust-helpers'),require('./interval'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','./provider','dustjs','elliptical-dust-helpers','./interval'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Template = factory(root.elliptical.utils,root.elliptical.Provider, root.dust,root.dust.helpers,root.elliptical.Interval);
        root.returnExports = root.elliptical.$Template;
    }
}(this, function (utils, Provider,dust,helpers,Interval) {

    var object=utils.object;
    var network=utils.network;
    dust.optimizers.format = function (ctx, node) {
        return node;
    };

    dust._root = '';

    dust.onLoad = function (template, callback) {
        if (template.indexOf('shared.') > -1) _loadTemplateFromSharedViews(dust, template, callback);
        else {
            var err = new Error('Partial Not Found: ' + template);
            callback(err, null);
        }
    };

    var $Template;
    $Template = Provider.extend({
        _data: {},

        $store: null,

        base: {
            server: 'base',
            client: 'base-client'
        },

        $provider: dust,

        compile: dust.compile,

        cache: dust.cache,

        model: 'template',

        api: '/api/template',

        namespace: null,

        root: '',

        setRoot: function (val) {
            this.root = val;
            dust._root = val;
        },


        /**
         *
         * @returns {string}
         * @public
         */
        getBase: function () {
            return (network.isBrowser()) ? this.base.client : this.base.server;

        },

        /**
         *
         * @param {object} opts
         * @public
         */
        $setOpts: function (opts) {
            if (opts) {
                if (typeof opts.model !== 'undefined') this.model = opts.model;
                if (typeof opts.api !== 'undefined') this.api = opts.api;
                if (typeof opts.base !== 'undefined') this.base = opts.base;
            }
        },

        /**
         *
         * @param {object} $provider
         * @public
         */
        $setProvider: function ($provider) {
            this.$provider = $provider;

        },

        /**
         *
         * @param {string} template
         * @param {object} context
         * @param {function} callback
         * @public
         */
        render: function (template, context, callback) {
            var $provider = this.$provider;
            var cache = $provider.cache;
            if (typeof template === 'object') {
                var ctrlName = template.name.toLowerCase();
                var ctrlView = template.view.toLowerCase();
                var ctrlTemplate = ctrlName + '.' + ctrlView;
                if (!object.isEmpty(cache)) {
                    var result = cache[ctrlTemplate];
                    if (result) $provider.render(ctrlTemplate, context, callback);
                    else _loadTemplateFromControllerView(this, ctrlName, ctrlView, context, callback);
                } else {
                    _loadTemplateFromControllerView(this, ctrlName, ctrlView, context, callback);
                }
            } else {
                if (template.indexOf('shared.') > -1) {
                    _loadTemplateFromSharedViews($provider, template, function (err, out) {
                        $provider.render(template, context, callback);
                    });
                } else {
                    _loadTemplateByStringValue(this, template, context, callback);
                }

            }

        },

        /**
         * set the provider as a global to the window object
         * on the browser side, if compiled templates are referenced in script tag, you'll need to set
         * a reference to dust on the window object
         * @public
         */
        setBrowserGlobal: function () {
            if (typeof window != 'undefined') window.dust = this.$provider;
        }

    }, {
        /**
         * @constructs
         * @param {boolean} base
         */
        init: function (base) {
            if (base) this.constructor._data.base = true;
            this.root = this.constructor.root;
        },

        /**
         * renders with a context base
         * use render method on template provider's prototype to mixin a base context
         *
         * @param {string} template
         * @param {object} context
         * @param {function} callback
         * @public
         */
        render: function (template, context, callback) {

            if (this.constructor._data.base) {
                var baseRender = {
                    render: this.constructor.getBase()
                };
                var base = this.constructor.$provider.makeBase(baseRender);
                context = base.push(context);
            }

            this.constructor.render(template, context, function (err, out) {
                if (callback) callback(err, out);
            });
        }
    });

    function _sharedUrlPath($provider, template) {
        var root = $provider._root;
        var url = root + '/views';
        var arr = template.split('.');
        for (var i = 0; i < arr.length; i++) {
            url += '/' + arr[i];
        }
        url += '.html';
        return url;
    }

    function _loadTemplateFromSharedViews($provider, template, callback) {
        var url = _sharedUrlPath($provider, template);
        $.get(url, function (data) {
            if (data) {
                var compiled = $provider.compile(data, template);
                $provider.loadSource(compiled);
                callback(null, data);
            } else {
                callback(new Error('Error: cannot find ' + template + ' in shared views folder'), null);
            }
        });
    }


    function _loadTemplateFromControllerView(thisRef, ctrl, view, context, callback) {
        var root = thisRef.root;
        if (typeof window === undefined) {
            throw "Template provider for Controller/Action is currently not configured for non-browser environments"
        }
        var url = root + '/views/' + ctrl + '/' + view + '.html';
        var ctrlTemplate = ctrl + '.' + view;
        var $provider = thisRef.$provider;
        $.get(url, function (data) {
            if (data) {
                var compiled = $provider.compile(data, ctrlTemplate);
                $provider.loadSource(compiled);
                $provider.render(ctrlTemplate, context, callback);
            } else {
                callback('Error: Controller View does not exist', null);
            }
        });

    }

    function _loadTemplateByStringValue(thisRef, template, context, callback) {
        var $provider = thisRef.$provider;
        var cache = $provider.cache;
        if (_.isEmpty(cache)) {
            _loadTemplateCacheFromStore(thisRef.model, thisRef.$store, $provider, thisRef.api, function () {
                $provider.render(template, context, callback);
            });
        } else {
            $provider.render(template, context, callback);
        }
    }

    /**
     * if template cache is empty, load it from the store or client-side, load it from scripts
     * @param {string} model
     * @param {object} $store
     * @param {object} $provider
     * @param {string} api
     * @param {function} callback
     * @private
     */
    function _loadTemplateCacheFromStore(model, $store, $provider, api, callback) {
        if (!network.isBrowser()) {
            $store.getAll(model, function (err, data) {
                for (var i = 0, max = data.length; i < max; i++) {
                    var obj = JSON.parse(data[i]);
                    dust.loadSource(obj);
                }
                callback();
            });


        } else {

            //continue to query at intervals for cache to load from script
            var iterations = 0;
            var process = new Interval({
                delay: 10
            });
            process.run(function () {
                checkCache($provider, process, iterations, callback);
            })
        }
    }

    function checkCache($provider, process, iterations, callback) {
        var cache = $provider.cache;
        if (!object.isEmpty(cache)) {
            process.terminate();
            if (callback)callback();
        } else {
            if (iterations > 1000) {
                process.terminate();
                if (callback) callback();
            } else {
                iterations++;
            }
        }
    }


    return $Template;

}));


/*
 * =============================================================
 * elliptical.$Pagination
 * =============================================================
 * returns a pagination ui context(object) for template binding
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./provider'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical.$Pagination = factory(root.elliptical.Provider);
        root.returnExports = root.elliptical.$Pagination;
    }
}(this, function (Provider) {
    /**
     * @param paginate {Object}
     * @param pagination {Object}
     * @param data {Object}
     * @returns {Object}
     */


    var $Pagination;
    $Pagination = Provider.extend({
        count: 'count',
        data: 'data',
        spread: 10,

        /**
         *
         * @param {object} params
         * @param {object} data
         * @returns {{pagination, data}|*}
         * @public
         */
        get: function (params, data) {

            var count_ = this.count;
            var data_ = this.data;
            var spread_ = this.spread;

            if (params.paginate) params = params.paginate;

            return _pagination(params, data);

            /**
             *
             * @param {object} params
             * @param {object} result
             *
             * @returns {object}
             * @qpi private
             */
            function _pagination(params, result) {
                var baseUrl, rawUrl, page, count, pageSize, pageSpread, data;
                baseUrl = params.baseUrl;
                rawUrl = params.rawUrl;
                page = params.page;


                if (result instanceof Array) {
                    count = result.length;
                    data = result;

                } else {
                    count = result[count_];
                    data = result[data_];
                    if (count === undefined) count = result.count;
                    if (data === undefined) data = result.data;
                }


                pageSize = params.pageSize;
                pageSpread = spread_;
                try {
                    page = parseInt(page);
                } catch (ex) {
                    page = 1;
                }

                var pageCount = parseInt(count / pageSize);
                var remainder = count % pageSize;
                if (pageCount < 1) pageCount = 1;
                else if (remainder > 0) pageCount++;

                //query search part of url
                var querySearch = getQuerySearch(rawUrl);

                //pagination object
                var pagination = {
                    page: page,
                    pageCount: pageCount,
                    prevPage: baseUrl + '/1',
                    firstPage: null,
                    prevClass: 'hide',
                    nextPage: baseUrl + '/' + pageCount,
                    nextClass: 'hide',
                    lastPage: null,
                    pages: [],
                    beginRecord: null,
                    endRecord: null,
                    count: count

                };
                //assign pagination properties
                //prev
                if (page > 1) {
                    pagination.prevClass = '';
                    pagination.prevPage = assignUrl(baseUrl, parseInt(page - 1), querySearch);
                }
                //next
                if (page < pageCount) {
                    pagination.nextClass = '';
                    pagination.nextPage = assignUrl(baseUrl, parseInt(page + 1), querySearch);
                }

                //get page links

                if (pageCount > 1) pagination.pages = _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch);


                //first,last pages
                pagination.firstPage = assignUrl(baseUrl, 1, querySearch);
                pagination.lastPage = assignUrl(baseUrl, pageCount, querySearch);
                if (page === pageCount) pagination.nextPage = pagination.lastPage;

                //assign record pointers
                var currentPointer = assignRecordPointers(count, page, pageSize);
                pagination.beginRecord = currentPointer.beginRecord;
                pagination.endRecord = currentPointer.endRecord;

                return {
                    pagination: pagination,
                    data: data
                };

            }


            /**
             *
             * @param {string} baseUrl
             * @param {number} page
             * @param {number} pageCount
             * @param {number} pageSpread
             * @param {string} querySearch
             * @returns {Array}
             * @api private
             */
            function _pageLinks(baseUrl, page, pageCount, pageSpread, querySearch) {
                var pages = [];
                if (pageSpread > pageCount) {
                    pageSpread = pageCount;
                }

                if (page < pageSpread) {

                    for (var i = 0; i < pageSpread; i++) {
                        var obj = {
                            page: i + 1,
                            pageUrl: assignUrl(baseUrl, parseInt(i + 1), querySearch)
                        };

                        if (i === parseInt(page - 1)) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                } else {
                    var halfSpread = parseInt(pageSpread / 2);
                    var beginPage, endPage;
                    if (pageCount < page + halfSpread) {
                        endPage = pageCount;
                        beginPage = endPage - pageSpread;
                    } else {
                        endPage = page + halfSpread;
                        beginPage = page - halfSpread;
                    }
                    for (var i = beginPage; i < endPage + 1; i++) {
                        var obj = {
                            page: i,
                            pageUrl: assignUrl(baseUrl, i, querySearch)
                        };
                        if (i === page) obj.activePage = 'active';
                        pages.push(obj);
                    }
                    return pages;
                }
            }

            function assignUrl(baseUrl, index, querySearch) {

                var pageUrl = baseUrl + '/' + index;
                if (querySearch && querySearch !== undefined) pageUrl += querySearch;
                return pageUrl;
            }

            function assignRecordPointers(count, page, pageSize) {
                var beginRecord = (page - 1) * pageSize + 1;
                if (count === 0) beginRecord = 0;
                var endRecord = page * pageSize;
                if (endRecord > count) endRecord = count;
                return {
                    beginRecord: beginRecord,
                    endRecord: endRecord
                };
            }

            function getQuerySearch(url) {
                var index = url.indexOf('?');
                var length = url.length;
                if (index > -1) return url.substring(index, length);
                else return null;
            }

        }


    }, {});


    return $Pagination;


}));

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
        root.elliptical.$Sort = factory(root.elliptical.Class,root.elliptical.Location);
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

        /**
         *
         * @param {object} params
         * @public
         */
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



/*
 * =============================================================
 * elliptical.Notify
 * =============================================================
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

        root.elliptical.Notify=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Notify;
    }
}(this, function (Class) {


    var Notify=Class.extend({
        '@resource':'Notify', //{String}
        $provider:null,

        /**
         *
         * @param {string} text
         * @param {object} params
         * @returns {*}
         * @public
         */
        show:function(text,params){
            return this.$provider.show(text,params);
        },

        /**
         *
         * @returns {*}
         * @public
         */
        hide:function(){
            return this.$provider.hide();
        },

        /**
         *
         * @returns {*}
         * @public
         */
        visible:function(){
            return this.$provider.visible();
        },

        /**
         *
         * @returns {*}
         * @public
         */
        toggle:function(){
            return this.$provider.toggle();
        }

    },{

        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         */
        init:function(name,provider){
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }
        },

        /**
         *
         * @param {string} text
         * @param {object} params
         * @returns {*}
         * @public
         */
        show:function(text,params){
            return this.constructor.show(text,params);
        },

        /**
         *
         * @returns {*}
         * @public
         */
        hide:function(){
            return this.constructor.hide();
        },

        /**
         *
         * @returns {*}
         * @public
         */
        visible:function(){
            return this.constructor.visible();
        },

        /**
         *
         * @returns {*}
         * @public
         */
        toggle:function(){
            return this.constructor.toggle();
        }
    });

    return Notify;



}));


/*
 * =============================================================
 * elliptical.Dialog
 * =============================================================
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
        root.elliptical.Dialog=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Dialog;
    }
}(this, function (Class) {


    var Dialog=Class.extend({
        '@resource':'Dialog', //{String}
        $provider:null,

        /**
         * @param {object} params
         * @public
         */
        show:function(params){
            return this.$provider.show(params);
        },

        /**
         * @public
         */
        hide:function(){
            return this.$provider.hide();
        },

        /**
         * @param {object} params
         */
        setContent:function(params){
            return this.$provider.setContent(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         */
        init:function(name,provider){
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }
        },

        /**
         * @param {object} params
         * @public
         */
        show:function(params){
            return this.constructor.show(params);
        },

        /**
         * @public
         */
        hide:function(){
            return this.constructor.hide();
        },

        /**
         * @param {object} params
         */
        setContent:function(params){
            return this.constructor.setContent(params);
        }

    });

    return Dialog;

}));






/*
 * =============================================================
 * elliptical.Store
 * =============================================================
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
        root.elliptical.Store=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Store;
    }
}(this, function (Class) {

    var Store;
    Store=Class.extend({
        '@resource':'Store',
        $provider:null,

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.$provider.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.$provider.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.$provider.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.$provider.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.$provider.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.$provider.clear();
        }
    },{
        /**
         * Constructor
         * @constructs
         * @param {string} name
         * @param {object} provider
         */
        init:function(name,provider){
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }
        },

        /**
         *
         * @param {string} key
         * @returns {*}
         * @public
         */
        get:function(key){
            return this.constructor.get(key);
        },

        /**
         *
         * @param {string} key
         * @param {object} value
         * @param {object} params
         * @public
         */
        set:function(key,value,params){
            return this.constructor.set(key,value,params);
        },

        /**
         *
         * @param {number} index
         * @returns {string}
         * @public
         */
        key:function(index){
            return this.constructor.key(index);
        },

        /**
         *
         * @param {string} key
         * @public
         */
        delete:function(key){
            return this.constructor.delete(key);
        },

        /**
         *
         * @returns {number}
         * @public
         */
        count:function(){
            return this.constructor.count();
        },

        /**
         *
         * @public
         */
        clear:function(){
            return this.constructor.clear();
        }
    });

    return Store;

}));

/*
 * =============================================================
 * elliptical.Validation
 * =============================================================
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./service'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./service'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.Validation=factory(root.elliptical.Service);
        root.returnExports = root.elliptical.Validation;
    }
}(this, function (Service) {


    var Validation=Service.extend({
        '@resource':'Validation', //{String},
        $provider:null,

        /**
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            this.$provider.post(data,name,callback);
        },


        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess:function(data){
            return this.$provider.onSuccess(data);
        },

        /**
         *
         * @param {object} data
         * @param {string} msg
         * @returns {*}
         * @public
         */
        onError:function(data,msg){
            return this.$provider.onError(data,msg);
        }



    }, {
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        post: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !this.$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.post(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @param {string} name
         * @param {function} callback
         * @public
         */
        put: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.put(data, name, callback);
        },

        /**
         *
         * @param {object} data
         * @returns {*}
         * @public
         */
        onSuccess: function (data) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onSuccess(data);
        },

        /**
         *
         * @param {object} data
         * @param {string} msg
         * @returns {*}
         * @public
         */
        onError: function (data, msg) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onError(data, msg);
        }

    });

    return Validation;



}));


/*
 * =============================================================
 * elliptical.Search
 * =============================================================
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
        root.elliptical.Search=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Search;
    }
}(this, function (Class) {

    var Search;
    Search=Class.extend({
        '@resource':'Search',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.$provider.find(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        find:function(params){
            return this.constructor.find(params);
        }


    });

    return Search;

}));


/*
 * =============================================================
 * elliptical.Sort
 * =============================================================
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
        root.elliptical.Sort=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.Sort;
    }
}(this, function (Class) {

    var Sort;
    Sort=Class.extend({
        '@resource':'Sort',
        $provider:null,

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.$provider.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.$provider.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.$provider.refresh(params);
        }

    },{
        /**
         * @constructs
         * @param {string} name
         * @param {object} provider
         * @public
         */
        init: function (name,provider) {
            var length = arguments.length;
            if(length===1){
                if(typeof name==='string') this.constructor["@resource"]=name;
                else this.constructor.$provider=name;
            }else if(length===2){
                this.constructor["@resource"]=name;
                this.constructor.$provider=provider;
            }

        },


        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sort:function(params){
            return this.constructor.sort(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        sorted:function(params){
            return this.constructor.sorted(params);
        },

        /**
         *
         * @param {object} params
         * @returns {*}
         * @public
         */
        refresh:function(params){
            return this.constructor.refresh(params);
        }


    });

    return Sort;

}));