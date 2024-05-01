function writeCSV(fname="./hydrid-data.csv", data=[]) {
    const { createObjectCsvWriter } = require("csv-writer"); 

    const csvWriter = createObjectCsvWriter({
        path: fname, 
        header: [
            {id: "temp", title: "Temperature [K]"}, 
            {id: "pres", title: "Pressure [MPa]"},
            {id: "cmax", title: "Max Capacity [wt%]"},
            {id: "tcharge", title: "Charge time 1 / [wt%/s]"}
        ]
    }); 

    csvWriter.writeRecords(data); 
    console.log(`File ${fname} succesfully generated!`); 
}


function get_data(fname="./hydrid-data.csv") { 
    // ln(P [MPa]) = k * 1000/T[K] + b 
    const a = -3.417, b = 9.916; 
    // P[MPa] (c[wt%]) = A * c^2 + B * c + C 
    const A = -7.321, B = 12.31, C = -1.689; 
    // temperature sample
    const Tmin = 330.0, Tmax = 390.0; 

    const path = require("path"); 

    const N = 1000; 

    data = []; 

    for (let i = 0; i < N; i++) { 
        let T = Tmin + (Tmax - Tmin) * i / N; 
        let P = Math.exp(a * 1000 / T + b); 
        let Cmax = (-B - Math.sqrt(B * B - 4 * A * (C - Math.log(P)))) / 2 / A;  
        let tcharge = 1 - Math.sqrt(1 - Cmax / 100); 
        data.push(
            {
                "temp": T,
                "pres": P, 
                "cmax": Cmax,
                "tcharge": tcharge
            }
        );
    }

    if (path.parse(fname).ext === ".csv") { 
        writeCSV(fname, data); 
    }
    else {
        console.log(`Bad filename: ${fname}! Nothing to be done.`)
    }
}; 

const args = process.argv.slice(2); 

if (args.length != 1) {
    throw "Bad arguments! Only one argument supported."; 
}

get_data(args[0]); 
