
let string={};

/**
 * get first char of string
 * @param s {string}
 * @returns {string}
 */
string.firstChar=(s)=>s.charAt(0);

/**
 * get last char of string
 * @param s {string}
 * @returns {string}
 */
string.lastChar=(s)=>s.slice(-1);

/**
 * returns first n chars of string
 * @param s {string}
 * @param n {number}
 * @returns {string}
 */
string.firstNChars=(s,n)=>s.substr(0,n);

/**
 * returns last n chars of string
 * @param s {string}
 * @param n {number}
 * @returns {string}
 */
string.lastNChars=(s,n)=>s.substr(s.length-n);

/**
 * trim first chr from string
 * @param s {String}
 * @returns {String}
 */
string.trimFirstChar=(s)=>s.substring(1);


/**
 * trim last chr from string
 * @param s {String}
 * @returns {String}
 */
string.trimLastChar=(s)=>s.substring(0,s.length-1);


/**
 * trim first n chars from string
 * @param s {String}
 * @param n {number}
 * @returns {String}
 */
string.trimFirstNChars=(s,n)=>s.substring(n);


/**
 * trim last n chars from string
 * @param s {string}
 * @param n {number}
 * @returns {string}
 */
string.trimLastNChars=(s,n)=>s.substring(0,s.length-n);

/**
 * trims a string into ellipsis format
 * @param s {string}
 * @param maxLength {number}
 * @returns {string}
 */
string.ellipsisTrim=(s,maxLength)=>{
    let ret=s;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-4) + " ...";
    }
    return ret;
};

/**
 * replaces a string with another string at index
 * @param s {string}
 * @param index {number}
 * @param replaceStr {string}
 * @returns {string}
 */
string.replaceAt=(s,index,replaceStr)=>s.substr(0, index) + replaceStr + s.substr(index+replaceStr.length);

/**
 * inserts a string value at specified index in a string
 * @param s {String}
 * @param index {Number}
 * @param insertStr {String}
 * @returns {string}
 */
string.insertAt=(s,index,insertStr)=>s.substr(0, index) + insertStr + s.substr(index);


/**
 * converts a dash delimited string to a camelCase string
 *
 * @param s {String}
 * @returns {String}
 */
string.dashToCamelCase=(s)=>s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });


/**
 * camel case to space separated
 * @param s {String}
 * @returns {String}
 */
string.camelCaseToSpace=(s)=>{
    let rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
    return s.replace( rex, '$1$4 $2$3$5' );
};



/**
 * camel case input string
 * @param s
 * @returns {String}
 */
string.toCamelCase=(s)=>{
    return s
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
};

string.toTitleCase=(s)=>s.charAt(0).toUpperCase() + s.slice(1);

/**
 * converts a space delimited string to a dash delimited string
 *
 * @param s {String}
 * @returns {String}
 */
string.spaceToDash=(s)=>s.replace(/\s+/g, '-').toLowerCase();

string.camelCaseToSpacedTitleCase=(s)=>{
    var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
    var ret = s.replace(rex, '$1$4 $2$3$5');
    return this.toTitleCase(ret);
};



export default string;