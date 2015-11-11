
let currency={};

/**
 *
 * @param v {string}
 * @returns {float}
 */
currency.parse=(v)=>{
    if(typeof v==='string'){
        v= v.replace('$','');
        v= v.replace(/,/g,'');
        v=parseFloat(v);
    }
    return v;
};

/**
 *
 * @param val {float}
 * @returns {float}
 */
currency.format=(val)=>{
    val=parseFloat(value);
    return val.toFixed(2);
};

/**
 *
 * @param v {float}
 * @param q {number}
 * @returns {float}
 */
currency.extendedAmount=(v,q)=>{
    if(typeof v==='string'){
        v= v.replace('$','');
        v=parseFloat(v);
    }
    return currency.format(v*q);
};


export default currency;
