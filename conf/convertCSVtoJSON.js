const csv = require('csvtojson');
const csvFilePath = 'biblical_persons.csv'; // Data
let csvData = [];


// Take CSV export file and convert it to JSON
//
csv({noheader: true, trim: true, delimiter: ';', ignoreColumns: [2, 3, 4]})
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
        csvData.push(jsonObj);
    })
    .on('done', () => {
        console.log(JSON.stringify(csvData));
    });
