

let generator={};

/**
 * lazy find from an iterable collection using es6 generators
 * @param iterable {collection}
 * @param predicate {function}
 * @yields {object}
 */
generator.find=function*(iterable,predicate){
    for(let item of iterable){
        if(predicate(item)){
            yield item;
        }
    }
};

/**
 * lazy select the first <number> of items to return from an iterable collection
 * @param iterable {collection}
 * @param number {int}
 * @yields {object}
 */
generator.top=function*(iterable, number){
    let count=0;
    if(number < 1) return; //exits generator, sets done flag==true
    for(let item of iterable){
        yield item;
        count+=1;
        if(count >=number){
            return;
        }
    }
};

export default generator;
