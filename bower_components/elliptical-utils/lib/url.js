
import string from './string';

let url={};

/**
 * returns a querystring value for query param in the window.location url
 * @param query {string}
 * @returns {string}
 */
url.queryString=function (query) {
    var hu = window.location.search.substring(1);
    var gy = hu.split("&");
    for (i = 0; i < gy.length; i++) {
        var ft = gy[i].split("=");
        if (ft[0] == query) {
            return ft[1];
        }
    }
    return null;
};

/**
 * returns a querystring object array for the window.location url
 * @returns {Array}
 */
url.queryStringArray=function () {
    var arr = [];
    var hu = window.location.search.substring(1);
    var gy = hu.split("&");
    for (i = 0; i < gy.length; i++) {
        var ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
        var obj = {};
        obj.prop = ft[0];
        obj.val = ft[1];
        arr.push(obj);
    }

    return arr;
};

/**
 * @param url {string}
 * @param index {number}
 * @returns {string}
 */
url.encodeURISection=(url,index)=>{
    if(string.firstChar(url)==='/'){
        url=string.trimFirstChar(url);
    }
    var arr=url.split('/');
    var section=arr[index];
    section=encodeURIComponent(section);
    var length=arr.length;
    var url_='';
    for(var i=0;i<length;i++){
        url_+=(i===index) ? '/' + section : '/' + arr[i];
    }

    return url_;
};

export default url;