
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
