function writeCSV(fname="./cap-hydrid-data.csv", data=[]) {
    const { createObjectCsvWriter } = require("csv-writer"); 

    const csvWriter = createObjectCsvWriter({
        path: fname, 
        header: [
            {id: "temp", title: "Temperature [K]"}, 
            {id: "pres", title: "Pressure [MPa]"},
            {id: "cmax", title: "Max Capacity [wt%]"},
        ]
    }); 

    csvWriter.writeRecords(data); 
    console.log(`File ${fname} succesfully generated!`); 
}

function get_data(fname="./cap-hydrid-data.csv", nsampes=1000) { 
    // ln(P [MPa]) = k * 1000/T[K] + b 
    const a = -3.417, b = 9.916; 
    // P[MPa] (c[wt%]) = A * c^2 + B * c + C 
    const A = -7.321, B = 12.31, C = -1.689; 
    // temperature sample
    const Tmin = 330.0, Tmax = 390.0; 

    const path = require("path"); 
    const N = nsampes; 
    let data = []; 

    if (path.parse(fname).ext != ".csv") { 
        throw `Bad filename: ${fname}! Nothing to be done.`; 
    }

    if (N <= 0) { 
        throw `Samples count must be non-negative!`; 
    }

    for (let i = 0; i < N; i++) { 
        let T = Tmin + (Tmax - Tmin) * i / N; 
        let P = Math.exp(a * 1000 / T + b); 
        let Cmax = (-B - Math.sqrt(B * B - 4 * A * (C - Math.log(P)))) / 2 / A;  
        data.push(
            {
                "temp": T,
                "pres": P, 
                "cmax": Cmax,
            }
        );
    }

    writeCSV(fname, data); 
}; 


const readline = require("node:readline"); 
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
}); 

rl.question("Введите размер выборки: ", (nsamples) => {
    rl.question("Введите путь к csv-файлу для генерации: ", (fpath) => {
        get_data(fpath, nsamples); 
        rl.close();
    });
});