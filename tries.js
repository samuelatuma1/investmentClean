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


console.log({time: greet()});