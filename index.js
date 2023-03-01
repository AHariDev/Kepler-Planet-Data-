const { parse } = require('csv-parse'); //csv-parse module to deal with csv data 
const fs = require('fs'); //file-system module for reading file data

const results = []; 

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6; 
    //Checks the stellar flux and planet radius properties of the planet to determine inhabitability
}

fs.createReadStream('kepler_data.csv') 
//This gives us an event emitter to react to events using the '.on' function
    .pipe(parse({
        comment: '#', //Treats lines starting with # as comments
        columns: true, //Returns csv file as a JS Object with Key Value pairs
    }))
    .on('data', (data)=>{ //Data coming into the stream will be dealt with using callback 
        if (isHabitablePlanet(data)){
            results.push(data); 
        }
    })
    .on('error', (err)=>{
        console.log(err); 
        //Deals with error in the data - logs the error
    })
    //Chaining of event handlers on read stream
    .on('end', () => { 
        //We reach the end of file
        console.log(`${results.length} habitable planets were found!`)
        let plan_no = 1; 
        results.map((planet) => {
            console.log(`Planet # ${plan_no} is ${planet['kepoi_name']}`); 
            plan_no++; 
        })
    })


