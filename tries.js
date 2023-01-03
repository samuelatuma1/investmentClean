// console.log(Array.from(new Set([11, 2, 0, 4])))
console.log((new Set([1, 5])).size)

const ts /*: Array<Object<string, number> */= [
    {amt: 4100}, {amt: -2130}, {amt: 7100}
]
console.log(ts[0].amt)
const balance /*: number */ = ts.reduce((prevT /*: number */, currT) => prevT + currT["amt"], 0);

console.log(balance);


function getMult({data /*: string */, repeat /*: number */}){
    for (let i /*: number */ = 0; i < repeat; i++){
        console.log(data);
    }
}

const exp = require("constants");
// getMult({data: "samuel", repeat: 10})

const events = require("events");

const EventEmitter /*: EventEmitter */ = new events.EventEmitter();
function /*void */ alert(num /**number */){
  console.log("I was clicked ", num, " times");
}

// EventEmitter.on("click", alert);
const num /**number */ = 20;
// EventEmitter.emit("click", num);
const oldDate /**DateTime */ = new Date("2022-10-12T19:54:00.627Z").getTime();
const currTime = new Date().getTime();

console.log((currTime - oldDate)/ (60 * 60 * 24 * 1000));

/**
 * 
 * @returns 
 */



const filter = (transactions /**Array<TransactionModel> */, filterObject /**{[Key: String]: String} */) => {
    let filterTransactions /**Array<TransactionModel> */ = transactions.slice();

    for(let key in filterObject){
        let filterValue /** string */= filterObject[key];
        filterTransactions = filterTransactions.filter(transaction => transaction[key]?.toLowerCase() === filterValue.toLowerCase());
    }

    return filterTransactions;
}

let names /** Array<{[Key: String]: string}> */ =  [{name: "sam", age: 6, gender: "male"}, {name: "Samu", age: 6, gender:"female"},
        {name: "Willy", age: 6, gender: "female"},
        {name: "Sam", age: 6, gender: "female"},
    ] 

console.log(filter(names, {name: "SAM", gender: "female"}))
/**
 * @desc merges two objects to form one object, objects must have key value pairs with values being dictionaries 
 * @param {{[Key: String]: {[Key: String]: any}} first_object 
 * @param {[Key: String]: {[Key: String]: any} second_object 
 * @returns {[Key: String]: {[Key: String]: any}} merged version of first_object and second_object
 */
function mergeObjects(first_object /**{[Key: String]: {[Key: String]: any} */, second_object /**{[Key: String]: {[Key: String]: any} */) /**{[Key: String]: {[Key: String]: any}} */{
    const return_object /** {[Key: String]: any */ = {};
    for(let second_object_key /**string */ in second_object){
        if(!first_object.hasOwnProperty(second_object_key))
            first_object[second_object_key] = {};
        
        const second_object_value /** {[Key: String]: any} */ = second_object[second_object_key];
        const first_object_value /** {[Key: String]: any} */ = first_object[second_object_key];
        return_object[second_object_key] = {...first_object_value, ...second_object_value};
    }
    return return_object;
}

const obj1 = {
    "naira": {
        "available": 10,
        "withdrawn": 20
    },
    "dollars": {
        "available": 15,
        "withdrawn": 23
    }
}

const obj2 = {
    "naira": {
        "user": "Nigeria"
    },
    "dollars": {
        user: "United States"
    }
}

console.log("merged => ", mergeObjects(obj1, obj2))

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

const x = new Date()
console.log({x: x, sevenDaysLater: addDays(x, 7).getTime()})

function generateX(data /** Any */, x /** Number */= 1){
    let res /**Array<any> */= [];
    for(let i /** Number */ = 0; i < x; i++){
        res.push(data);
    }
    return res;
}

/**
 * 
 * @param {String} words 
 * @param {Number} x 
 * @returns {String}
 */
function showXWords(words /** String */, x /** Number */ = 20) /** String */{
    // Split words  
    const splitWords /** Array<String> */ = words.split(" ");

    const expectedWordCount /**Array<String> */ = splitWords.slice(0, x);
    // join the first x words back
    
    return expectedWordCount.join(" ");
}

let words = "a noun is a name of a person, animal, place or thing. I hope you get it now?";

console.log({words: showXWords(words, 17)});