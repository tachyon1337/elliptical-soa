
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
