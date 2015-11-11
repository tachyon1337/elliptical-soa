import * as objectAssign from './assign';
import * as extensions from './extensions';
import * as objectClone from 'js-object-clone';
import * as objectMixin from 'object-mixin';
import generator from './generator';
import random from './random';
import string from './string';
import date from './date';
import network from './network';
import color from './color';
import url from './url';
import currency from './currency';
import array from './array';
import path from './path';
import object from './object';


let utils={};

var spec = {
    descriptors:          false,
    extensibility:        false,
    enumerator:           Object.keys
};

/**
 * deep clones an object
 * @param src {object}
 * @param deep {boolean}
 * @returns {object}
 */
utils.clone = (src,deep=true)=>Object.clone(src,deep,spec);

/**
 * object 'is' comparison
 * @param x {object}
 * @param y {object}
 * @returns {boolean}
 */
utils.is = (x,y)=>Object.is(x,y);

/** compares equality of two objects
 * @param x {object}
 * @param y {object}
 * @returns {boolean}
 */
utils.isEqual = (x,y)=>Object.equals(x, y, spec);


/**
 * shallow extend of src onto target
 * @param target {Object}
 * @param src {Object}
 * @returns {Object}
 */
utils.assign = (target,src)=>Object.assign(target,src);

/**
 * deep extend of src onto target
 * @param target {object}
 * @param src {object}
 * @returns {object}
 */
utils.mixin=(target,src)=>Object.mixin(target,src);

/**
 * lazy find from an iterable collection using es6 generators
 * @param iterable {collection}
 * @param predicate {function}
 * @yields {object}
 */
utils.find=generator.find;

/**
 * lazy select the first <number> of items to return from an iterable collection
 * @param iterable {collection}
 * @param number {int}
 * @yields {object}
 */
utils.top=generator.top;

/**
 * tests if value is a number
 * @param val {object}
 * @returns {boolean}
 */
utils.isNumeric=(val)=>!isNaN(parseFloat(val)) && isFinite(val);


//random functions namespace
utils.random=random;

//string functions namespace
utils.string=string;

//date functions namespace
utils.date=date;

//network functions namespace
utils.network=network;

//color function namespace
utils.color=color;

//currency function namespace
utils.currency=currency;

//url functions namespace
utils.url=url;

//array functions namespace
utils.array=array;

//path functions namespace
utils.path=path;

//object functions namespace
utils.object=object;


export default utils;
















