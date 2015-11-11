
import array from './array';

let isNumeric=(val)=>!isNaN(parseFloat(val)) && isFinite(val);

let path_={};

/**
 * converts a delimited path into an array of props
 * 'items.0.FirstName' --> [items,0,FirstName]
 *
 * @param path {string}
 * @param separator {string}
 * @returns {array}
 */
path_.split=(path,separator=".")=>{

    if ((typeof path ==='undefined') || path === '') {
        return [];
    } else {
        if (array.isArray(path)) {
            return path.slice(0);
        } else {
            return path.toString().split(separator);
        }
    }
};

/**
 * resolves the value of an object path
 * obj, 'items.0.FirstName'  --> 'John','FirstName'
 * returns an array of value,prop
 *
 * @param a {object}
 * @param path {string}
 * @param options {object}
 * @returns {array}
 */
path_.resolve=(a, path, options)=>{
    var e, k, last, stack;
    if (options == null) {
        options = {};
    }
    stack = path_.split(path);
    last = [stack.pop()];
    e = a;
    while ((k = stack.shift()) !== void 0) {
        if (e[k] !== void 0) {
            e = e[k];
        } else {
            stack.unshift(k);
            break;
        }
    }
    if (options.force) {
        while ((k = stack.shift()) !== void 0) {
            if ((typeof stack[0] === 'number') || ((stack.length === 0) && (typeof last[0] === 'number'))) {
                e[k] = [];
            } else {
                e[k] = {};
            }
            e = e[k];
        }
    } else {
        while ((k = stack.pop()) !== void 0) {
            last.unshift(k);
        }
    }
    return [e, last];
};

/**
 * resolves the value of an object path
 * obj, 'items.0.FirstName'  --> 'John'
 *
 * @param obj {object}
 * @param path {string}
 * @returns value
 */
path_.objectProperty=(obj,path)=>{
    try{
        let pathArray=path.split(path);
        let a=obj;
        pathArray.forEach(function(p){
            let b=a[p];
            a=b;
        });
        return a;
    }catch(ex){
        return undefined;
    }

};


/**
 *
 * @param obj {object}
 * @param path {string}
 * @param value {object}
 * @returns void
 */
path_.assignValueTo=(obj,path,value)=>{
    try{
        let pathArray=path_.split(path);
        let a=obj;
        let len=pathArray.length;
        let max=len-1;
        for(var i=0;i<len;i++){
            if(i===max){
                a[pathArray[i]]=value;
            } else{
                var b=a[pathArray[i]];
                a=b;
            }
        }
    }catch(ex){

    }
};

/**
 * return the length of an array property of an object by path
 * @param obj {object}
 * @param path {string}
 * @returns {number}
 */
path_.arrayPropertyLength=(obj,path)=>{
    let prop=path_.objectProperty(obj,path);
    return (prop && array.isArray(prop)) ? prop.length : null;

};

/**
 * tests if a value of an object path is an array
 * @param obj
 * @param path
 * @returns {boolean}
 */
path_.isPropertyArray=(obj,path)=>{
    let prop=path_.objectProperty(obj,path);
    return (array.isArray(prop));

};


/**
 * returns the index of the path
 * @param path {string}
 * @returns {object}
 */
path_.getIndexOf=(path)=>{
    if(path !==undefined){
        let parts=path.split('.');
        let length;
        if(parts.length){
            length=parts.length;
            length--;
            return parts[length];

        }else{
            return undefined;
        }
    }else{
        return undefined;
    }

};

/**
 * is path part of an array
 * @param path {string}
 * @returns {boolean}
 */
path_.isInArray=(path)=>{
    let index=this.getIndexOf(path);
    return (index !== undefined) ? isNumeric(index) : undefined;
};


/**
 * converts an array(of contexts and indices) and a property into a path string
 * [{index:5,context:User},{index:0,context:Address}],City ---> User.5.Address.0.City
 * @param arr {array}
 * @param prop {string}
 * @returns {string}
 */
path_.create=(arr,prop)=>{
    let path='';
    if(arr && arr.length){
        arr.forEach(function(obj){
            path+=obj.context + '.' + obj.index + '.';
        });

        (typeof prop !=='undefined') ? path+=prop : path=path.substring(0, path.length - 1);
        return path;
    }
};

/**
 * converts an array of object properties into a path
 * @param arr {array}
 * @returns {string} path
 */
path_.createFromArray=(arr)=>{
    let path='';
    if(arr && arr.length){
        var index=0;
        arr.forEach(function(obj){
            path+=(index < arr.length -1) ? obj + '.' : obj;
            index++;
        });
        return path;
    }
};

/**
 * deletes an obj prop by path
 * @param obj {object}
 * @param path {string}
 */
path_.deleteObjectProperty=(obj,path)=>{
    let pathArray=path_.split(path);
    let a=obj;
    let len=pathArray.length;
    let max=len-1;
    for(var i=0;i<len;i++){
        if(i===max){
            delete a[pathArray[i]];
        } else{
            var b=a[pathArray[i]];
            a=b;
        }
    }
};

/**
 * tests if a prop is the last node in a path
 * @param path {string}
 * @param prop {string}
 * @returns {boolean}
 */
path_.isProperty=(path,prop)=>{
    let splitPath=path_.split(path);
    let prop_=splitPath.pop();
    return ((prop_=== prop));
};

/**
 * deletes an object from an array by id value
 * @param obj {object}
 * @param idProp {string}
 * @param id {string}
 * @returns {number} the index of the deleted object
 */
path_.deleteObjectByIdFromArrayProp=(obj,idProp,id)=>{
    let index=null;
    if(!array.isObjectPropertyByIndex(obj,0)){
        return index;
    }
    var arr=obj[Object.keys(obj)[0]];
    for(var i=0;i<arr.length;i++){
        if(arr[i][idProp].toString()===id.toString()){
            arr.splice(i,1);
            index=i;
            break;
        }
    }

    return index;
};


/**
 * finds an object in a $scope model list by id
 * @param obj {object}
 * @param idProp {string}
 * @param id {string}
 * @returns {object}
 */
path_.selectObjectByIdFromArrayProp=(obj,idProp,id)=>{
    let obj_=undefined;
    let index=null;
    if(!array.isObjectPropertyByIndex(obj,0)){
        return index;
    }
    var arr=obj[Object.keys(obj)[0]];
    for(var i=0;i<arr.length;i++){
        if(arr[i][idProp].toString()===id.toString()){
            obj_=arr[i];
            break;
        }
    }
    return obj_;
};


/**
 * inserts an index into a model list path(at path index=1)
 * @param path {String}
 * @param index {Number}
 * @returns {String}
 */
path_.replaceIndex=(path,index)=>{
    let arr=path_.split(path);
    arr[1]=index;
    return arr.join('.');
};

/**
 * returns a normalized path format for Object.observe change record reporting
 * @param path {string}
 * @returns {string}
 */
path_.map=(path)=>{
    let arr=path_.split(path);
    let num=isNumeric;
    if(arr && arr.length){
        let mapped=arr.map(function(v){
            return (num(v)) ? '['+ v.toString() + ']' : v;
        });
        return mapped.join('.').replace(/.\[/,'[');
    }else{
        return path;
    }
};


export default path_;