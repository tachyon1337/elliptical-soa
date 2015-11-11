
let random={};
random.guid=()=>{
    let S4=()=>(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

random.str=(length=16)=>{
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};

random.id=(length=16)=>{
    let chars = '0123456789';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};

random.emptyGuid=()=>'00000000-0000-0000-0000-000000000000';

random.isEmptyGuid=(val)=>Object.is(val,random.emptyGuid());

export default random;