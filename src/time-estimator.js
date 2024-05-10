function writeCSV(fname="./time-hydrid-data.csv", data=[]) {
    const { createObjectCsvWriter } = require("csv-writer"); 

    const csvWriter = createObjectCsvWriter({
        path: fname, 
        header: [
            {id: "temp", title: "Temperature [K]"}, 
            {id: "pres", title: "Pressure [MPa]"},
            {id: "tmax", title: "Charging time [min]"},
        ]
    }); 

    csvWriter.writeRecords(data); 
    console.log(`File ${fname} succesfully generated!`); 
}

function get_data(fname="./time-hydrid-data.csv", nsampes=1000) { 
    // ln(P [MPa]) = k * 1000/T[K] + b 
    const a = -3.417, b = 9.916; 
    // 1/t = A * T^2 + B * T + C
    const A = 2.173e-05, B = -0.01537, C = 2.71; 
    // temperature sample
    const Tmin = 270, Tmax = 313;  

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
        let tmax = 1 / (A * T * T + B * T + C);
        console.log(tmax);
        data.push(
            {
                "temp": T,
                "pres": P, 
                "tmax": tmax,
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