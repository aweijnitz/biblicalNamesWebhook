const fs = require('fs');
const csv = require('csvtojson');
const csvFilePath = 'biblical_persons.csv'; // Data
let csvData = [];
const FACTS_FILE = 'generated-nameFacts.json';
const SEARCH_INDEX_FILE = 'generated-searchIndex.json';

const fulltextsearchlight = require('full-text-search-light');
const search = new fulltextsearchlight({
    ignore_case: true,
    index_amount: 14  // default = 12, The more indexes you have, the faster the search, but the slower the 'add' method  gets
});


// Take CSV export file and convert it to JSON
//
csv({noheader: true, trim: true, delimiter: ';', ignoreColumns: [2, 3, 4]})
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
        if (jsonObj.field1.length === 0 || jsonObj.field1.length === 0) return;
        jsonObj[jsonObj.field1] = jsonObj.field2;
        delete jsonObj.field2;
        csvData.push(jsonObj);
        console.log(JSON.stringify(jsonObj));
    })
    .on('done', () => {
//        console.log(JSON.stringify(csvData));

        csvData.forEach(entry => {
            search.add(entry.field1);
        });

        fs.unlinkSync(FACTS_FILE);
        fs.unlinkSync(SEARCH_INDEX_FILE);
        fs.writeFileSync(FACTS_FILE, JSON.stringify(csvData), {encoding: 'utf8'});
        search.saveSync(SEARCH_INDEX_FILE);

    });

