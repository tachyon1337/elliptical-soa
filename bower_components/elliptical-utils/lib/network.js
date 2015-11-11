

function isLocalBlock(ip){
    var x = ip.split("."), x1, x2, x3, x4;
    if (x.length == 4) {
        x1 = parseInt(x[0], 10);
        x2 = parseInt(x[1], 10);
        x3 = parseInt(x[2], 10);
        x4 = parseInt(x[3], 10);

        return ((x1===10) || (x1===172 && x2===16) || (x1===192) && (x2===168));
    }
    return false;
}


let network={};

/**
 * tests for window to determine if browser environment
 * @returns {boolean}
 */
network.isBrowser=()=>typeof window != 'undefined';


/**
 * tests if string is a valid ipv4 address
 * @param ip {string}
 * @returns {boolean}
 */
network.isIPAddress=function(ip){
    return (/^(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])$/.test(ip));
};


/**
 * tests if a host is a valid localhost
 * @param host
 * @returns {boolean}
 */
network.isLocalHost=function(host){
    host=host.toLowerCase();
    if(host==='localhost'){
        return true
    }else if(host.indexOf('127.0.0.1')> -1){
        return true;
    }else {
        if(network.isIPAddress(host)){
            return (isLocalBlock(host));
        }else{
            return false;
        }
    }
};

export default network;