

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