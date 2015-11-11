
import generator from './generator';

let array={};

/**
 * tests if array
 * @param obj {*}
 * @retuns {boolean}
 */
array.isArray=(obj)=>(/Array/).test(Object.prototype.toString.call(obj));

/**
 * is object/value in array
 * @param arr {Array}
 * @param obj {Object}
 * @returns {Boolean}
 */
array.inArray=(arr,obj)=>{
    return generator.find(arr,function(o){
        return Object.is(o,obj);
    });
};

/**
 * remove of an array of items from an array
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @returns {Array}
 */
array.remove=(arr1, arr2)=> {
    for (var i = 0; i < arr1.length; i++) {
        if (array.inArray(arr2, arr1[i])) {
            arr1.splice(i, 1);
        }
    }
    return arr1;
};

/**
 * merge two arrays
 * @param a {Array}
 * @param b {Array}
 * @returns {Array}
 */
array.merge=(a,b)=>{
    var i = a.length, j = 0;

    if (typeof b.length === "number")
    {
        for ( var l = b.length; j < l; j++)
        {
            a[i++] = b[j];
        }

    } else
    {
        while (b[j] !== undefined)
        {
            a[i++] = b[j++];
        }
    }

    a.length = i;

    return a;
};

/**
 *
 * @returns {Array}
 */
array.makeArray=(arr,results)=>{
    var ret = results || [];

    if (arr != null)
    {
        var type = typeof arr;
        if (arr.length == null || type === "string" || type === "function"
            || type === "regexp")
        {
            ret.push(arr);
        } else
        {
            array.merge(ret, arr);
        }
    }

    return ret;
};

/**
 * concatenate two arguments
 * @param arr {Array}
 * @param args {Array}
 * @returns {Array}
 */
array.concatArgs=(arr,args)=>{
    return array.makeArray(arr).concat(array.makeArray(args));
};

/**
 * empty an array
 * @param arr {Array}
 */
array.empty=(arr)=>arr.splice(0,arr.length);


array.clone=(arr)=>arr.slice(0);

/**
 * tests if valid val for an array index
 * @param val {number}
 */
array.isValidIndex=(val)=>/^[0-9]+$/.test(String(val));

/**
 * validates if the value of an object prop is an array
 * @param obj {Object}
 * @param prop {String}
 * @returns {boolean}
 */
array.isObjectProperty=(obj,prop)=>!!((Array.isArray(obj[prop])));


/**
 * validates if the value of an object prop by index is an array
 * @param obj {Object}
 * @param index {Number}
 * @returns {boolean}
 */
array.isObjectPropertyByIndex=(obj,index)=>{
    try{
        var o=obj[Object.keys(obj)[index]];
        return !!((Array.isArray(o)));
    }catch(ex){
        return false;
    }

};

array.indexById=(arr,id,idProp="id")=>{
    if(arr.length && arr.length > 0){
        let len=arr.length;
        let index;
        for(var i=0;i<len;i++){
            if(arr[i][idProp]===id){
                index=i;
                break;
            }
        }
        return index;
    }else{
        return null;
    }
};

/**
 * finds an object in an array by id
 * @param arr {Array}
 * @param id {String}|{Number}
 * @param propId {String}
 * @returns {Object}
 */
array.findById=(arr,id,propId='id')=>{
    return generator.find(arr, function(obj) {
        return obj[propId]===id;
    });
};





export default array;
