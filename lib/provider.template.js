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

