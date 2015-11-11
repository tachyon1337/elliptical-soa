
let date={};

/**
 * return an object representing current date
 * @returns {{day: number, month: number, year: number}}
 */
date.currentDateObj=()=>{
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    return{
        day:day,
        month:month,
        year:year
    };
};

/**
 * returns a current date string
 * @returns {string}
 */
date.current=()=>{
    let obj=this.currentDateObj();
    return (obj.month.toString() + '/' + obj.day.toString() + '/' + obj.year.toString());
};

/**
 * tests if valid date
 * @param obj {object}
 * @returns {boolean}
 */
date.isDate=(obj)=>(/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());

/**
 * tests if year is leap year
 * @param year {number}
 * @returns {boolean}
 */
date.isLeapYear=(year)=>year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;

/**
 * returns days in month for given year
 * @param year {number}
 * @param month {number}
 * @returns {number}
 */
date.getDaysInMonth=(year, month)=>[31, date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

/**
 * sets a date to start of day
 * @param d {date}
 * @returns {void}
 */
date.setToStartOfDay=(d)=>{
    if (date.isDate(d)) d.setHours(0,0,0,0);
};

/**
 * compares equality of two dates
 * @param a {date}
 * @param b {date}
 * @returns {boolean}
 */
date.compareDates=(a,b)=>a.getTime() === b.getTime();



export default date;
