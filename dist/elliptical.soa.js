
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
        root.elliptical.Model=factory(root.elliptical.utils,root.elliptical.Class);
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
             * @param params {Object}
             * @param query {Object}
             * @param callback {Function}
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
             * post model
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            post: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.post(params, resource, callback);

            },

            /**
             * put model
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            put: function (params, callback) {
                var $provider = this.$provider,
                    resource = this['@resource'];
                $provider.put(params, resource, callback);

            },


            /**
             * delete model
             * @param params {Object}
             * @param callback {Function}
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
             *
             * @param params {Object}
             * @public
             */
            init: function (params) {
                /* this will get passed up as the params in below methods if params not explicitly passed in the calls */
                this._data = params;
                this.$query = {};
            },

            /**
             * @param params {Object}
             * @param callback {Function}
             * @public
             */
            get: function (params, callback) {
                var data = this._data,
                    query = this.$query;

                (typeof params === 'function') ? callback = params : data = params;
                this.constructor.get(data, query, callback);
            },

            /**
             * @param params {Object}
             * @param callback {Function}
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
             * @param params {Object}
             * @param callback {Function}
             */
            put: function (params, callback) {
                var data = this._data;
                (typeof params === 'function') ? callback = params : data = params;
                this.constructor.put(data, callback);
            },


            /**
             *
             * @param {object} val
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
             */
            orderBy: function (val) {
                if(val && !object.isEmpty(val))this.$query.orderBy = val;
                return this;
            },

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
             */
            skip: function (val) {
                if(val && !object.isEmpty(val))this.$query.skip = val;
                return this;
            },

            /**
             *
             * @param params {Object}
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
             * @param params {Object}
             * @param callback  {Function}
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
         * @param {string} key
         * @param {object} params
         * @public
         */
        delete: function (key,params) {
            if(params===undefined)params={path:'/'};
            $.removeCookie(key,params);
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
         * @param {string} key
         */
        delete: function (key) {
            localStorage.removeItem(key);
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

        filter: function (endpoint, filter) {
            if (typeof filter === 'object') filter = this._getFilterString(filter);
            var encodedFilter = '$filter=' + encodeURIComponent(filter);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedFilter : '?' + encodedFilter;
        },

        orderBy: function (endpoint, orderBy) {
            var encodedOrderBy = '$orderby=' + encodeURIComponent(orderBy);
            return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderBy : '?' + encodedOrderBy;
        },

        orderByDesc: function (endpoint, orderBy, orderByDesc) {
            if (orderBy !== undefined) return ', ' + encodeURIComponent(orderByDesc + ' desc');
            else {
                var encodedOrderByDesc = '$orderby=' + encodeURIComponent(orderByDesc + ' desc');
                return (endpoint.indexOf('?') > -1) ? '&' + encodedOrderByDesc : '?' + encodedOrderByDesc;
            }
        },

        top: function (endpoint, top) {
            var encodedTop = '$top=' + top;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedTop : '?' + encodedTop;
        },

        skip: function (endpoint, skip) {
            var encodedSkip = '$skip=' + skip;
            return (endpoint.indexOf('?') > -1) ? '&' + encodedSkip : '?' + encodedSkip;
        },

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
         * @returns {String}
         * @public
         */
        getBase: function () {
            return (network.isBrowser()) ? this.base.client : this.base.server;

        },

        /**
         *
         * @param opts {Object}
         */
        $setOpts: function (opts) {
            if (opts) {
                if (typeof opts.model !== 'undefined') this.model = opts.model;
                if (typeof opts.api !== 'undefined') this.api = opts.api;
                if (typeof opts.base !== 'undefined') this.base = opts.base;
            }
        },

        $setProvider: function ($provider) {
            this.$provider = $provider;

        },

        /**
         *
         * @param template {String}
         * @param context {Object}
         * @param callback {Function}
         * @returns callback
         * @public
         */
        render: function (template, context, callback) {
            var $provider = this.$provider;
            var cache = $provider.cache;
            if (typeof template === 'object') {
                var ctrlName = template.name.toLowerCase();
                var ctrlView = template.view.toLowerCase();
                var ctrlTemplate = ctrlName + '.' + ctrlView;
                if (!_.isEmpty(cache)) {
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
         */
        setBrowserGlobal: function () {
            if (typeof window != 'undefined') window.dust = this.$provider;
        }

    }, {
        /**
         * new instance init
         * @param base {boolean}
         */
        init: function (base) {
            if (base) this.constructor._data.base = true;
            this.root = this.constructor.root;
        },

        /**
         * renders with a context base
         * use render method on template provider's prototype to mixin a base context
         *
         * @param template {String}
         * @param context {Object}
         * @param callback {Function}
         * @returns callback
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
     * @param model {String}
     * @param $store {Object}
     * @param $provider {Object}
     * @param api {String}
     * @param callback {Function}
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
 * elliptical.$Validation
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'),require('./provider'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils','./provider'], factory);
    } else {
        // Browser globals (root is window)

        root.elliptical.$Validation = factory(root.elliptical.utils,root.elliptical.Provider);
        root.returnExports = root.elliptical.$Validation;
    }
}(this, function (utils,Provider) {
    var string = utils.string;

    var $Validation;
    $Validation = Provider.extend({
        schemas: [],

        submitLabel: 'submitLabel',

        successMessage: 'Successfully Submitted...',

        post: function (form, name, callback) {
            var err = null;
            var schema = this.getSchema(name);
            for (var key in schema) {
                if (schema.hasOwnProperty(key)) {
                    if (schema[key].required && (typeof form[key] === 'undefined' || form[key] === '')) {
                        form[key + '_placeholder'] = string.camelCaseToSpacedTitleCase(key) + ' Required...';
                        form[key + '_error'] = 'error';
                        if (!err) err = this.error();
                    } else if (schema[key].validate && typeof schema[key].validate === 'function') {
                        var msg = schema[key].validate(form);
                        if (msg) {
                            form[key + '_placeholder'] = msg;
                            form[key + '_error'] = 'error';
                            form[key] = '';
                            if (!err) err = this.error();
                        }
                    } else if (schema[key].confirm) {
                        if (form[key] && form['confirm' + key]) {
                            if (form[key] != form['confirm' + key]) {
                                form[key + '_placeholder'] = 'Does Not Match...';
                                form[key + '_error'] = 'error';
                                form['confirm' + key + '_placeholder'] = 'Does Not Match...';
                                form['confirm' + key + '_error'] = 'error';
                                if (!err) err = this.error();
                            }
                        }
                    } else if (key === 'validate' && typeof schema[key] === 'function') {
                        var msg = schema['validate'](form);
                        if (msg) err = this.error(msg);
                    }
                }
            }
            if (err) {
                form = this.addSubmitLabel(form, false);
                callback(err, form);
            } else {
                form = this.deleteProperties(form);
                callback(null, form);
            }


        },

        put: function (schema, name, callback) {
            var obj = {
                name: name,
                schema: schema
            };

            var schemas = this.schemas;
            schemas.push(obj);
            if (callback) callback(null, obj);
        },

        onError: function (form, msg) {
            form = this.addSubmitLabel(form, msg, false);
            return form;
        },

        onSuccess: function (form) {
            form = this.addEmptySubmitLabel(form);
            return form;
        },

        getSchema: function (name) {
            var schema = null;
            for (var i = 0; i < this.schemas.length; i++) {
                if (this.schemas[i].name.toLowerCase() === name.toLowerCase()) {
                    schema = this.schemas[i].schema;
                    break;
                }
            }
            return schema;
        },

        error: function (msg) {
            if (typeof msg === 'undefined') msg = 'Form Submission Error';
            var err = {};
            err.message = msg;
            err.css = 'error';
            err.cssDisplay = 'visible';
            return err;
        },

        addSubmitLabel: function (form, msg, valid) {
            if (typeof valid === 'undefined') {
                valid = msg;
                msg = undefined;
            }
            var obj;
            if (valid) obj = this.success();
            else obj = this.error(msg);
            form[this.submitLabel] = obj;
            return form;
        },

        addEmptySubmitLabel: function (form) {
            form[this.submitLabel] = this.emptyLabelObject();
            return form;
        },

        success: function () {
            var msg = {};
            msg.message = this.successMessage;
            msg.css = 'success';
            msg.cssDisplay = 'visible';
            return msg;
        },

        emptyLabelObject: function () {
            var msg = {};
            msg.message = '&nbsp;';
            msg.css = '';
            msg.cssDisplay = '';
            return msg;
        },

        deleteProperties: function (form) {
            for (var key in form) {
                if (form.hasOwnProperty(key)) {
                    if (form['confirm' + key]) delete form['confirm' + key];
                    if (form['confirm' + key + '_placeholder']) delete form['confirm' + key + '_placeholder'];
                    if (form['confirm' + key + '_error']) delete form['confirm' + key + '_error'];
                    if (form[key + '_placeholder'])delete form[key + '_placeholder'];
                    if (form[key + '_error']) delete form[key + '_error'];
                }
            }

            return form;
        }

    }, {});

    return $Validation;
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

        get: function (params, data) {

            var count_ = this.count;
            var data_ = this.data;
            var spread_ = this.spread;

            if (params.paginate) params = params.paginate;

            return _pagination(params, data);

            /**
             *
             * @param params {Object}
             * @param result {Object}
             *
             * @returns {Object}
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

        show:function(text,params){
            return this.$provider.show(text,params);
        },

        hide:function(){
            return this.$provider.hide();
        },

        visible:function(){
            return this.$provider.visible();
        },

        toggle:function(){
            return this.$provider.toggle();
        }

    },{

        show:function(text,params){
            return this.constructor.show(text,params);
        },

        hide:function(){
            return this.constructor.hide();
        },

        visible:function(){
            return this.constructor.visible();
        },

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

        show:function(params){
            return this.$provider.show(params);
        },

        hide:function(){
            return this.$provider.hide();
        },

        setContent:function(params){
            return this.$provider.setContent(params);
        }

    },{
        show:function(params){
            return this.constructor.show(params);
        },

        hide:function(){
            return this.constructor.hide();
        },

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
    Store=elliptical.Class.extend({
        '@resource':'Store',
        $provider:null,

        get:function(key){
            return this.$provider.get(key);
        },

        set:function(key,value,params){
            return this.$provider.set(key,value,params);
        },

        delete:function(key){
            return this.$provider.delete(key);
        },

        clear:function(){
            return this.$provider.clear();
        }
    },{
        get:function(key){
            return this.constructor.get(key);
        },

        set:function(key,value,params){
            return this.constructor.set(key,value,params);
        },

        delete:function(key){
            return this.constructor.delete(key);
        },

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
}(this, function (elliptical,providers) {
    var $Validation=providers.$Validation;

    var Validation=Service.extend({
        '@resource':'Validation', //{String},
        $provider:$Validation,
        schemas:null,

        /**
         *
         * @param data {Object}
         * @param name {String}
         * @param callback {Function}
         */
        post: function (data, name, callback) {
            if (this.schemas && !this.$provider.schemas) {
                this.$provider.schemas = this.schemas;
            }
            this.$provider.post(data,name,callback);
        },

        put: function (data, name, callback) {
            if (this.schemas && !this.$provider.schemas) {
                this.$provider.schemas = this.schemas;
            }
            this.$provider.put(data, name, callback);
        },

        /**
         *
         * @param data {Object}
         * @returns {Object}
         */
        onSuccess:function(data){
            return this.$provider.onSuccess(data);
        },

        /**
         *
         * @param data {Object}
         * @param msg {String}
         * @returns {Object}
         */
        onError:function(data,msg){
            return this.$provider.onError(data,msg);
        }



    }, {
        init: function ($provider) {
            ($provider !== undefined) ? this.$provider = $provider : this.$provider = null;

        },

        post: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !this.$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.post(data, name, callback);
        },

        put: function (data, name, callback) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            if (this.schemas && !$provider.schemas) {
                $provider.schemas = this.schemas;
            }
            $provider.put(data, name, callback);
        },

        /**
         *
         * @param data {Object}
         * @returns {Object}
         */
        onSuccess: function (data) {
            var $provider = (this.$provider) ? this.$provider : this.constructor.$provider;
            return $provider.onSuccess(data);
        },

        /**
         *
         * @param data {Object}
         * @param msg {String}
         * @returns {Object}
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

        find:function(params){
            return this.$provider.find(params);
        }

    },{
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

        sort:function(params){
            return this.$provider.sort(params);
        },

        sorted:function(params){
            return this.$provider.sorted(params);
        },

        refresh:function(params){
            return this.$provider.refresh(params);
        }

    },{
        sort:function(params){
            return this.constructor.sort(params);
        },

        sorted:function(params){
            return this.constructor.sorted(params);
        },

        refresh:function(params){
            return this.constructor.refresh(params);
        }


    });

    return Sort;

}));