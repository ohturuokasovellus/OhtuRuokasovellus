# How papaparse works

To read data from a csv file efficiently, we use the papaparse package. It allows us to use threads so that 
the page stays reactive even when reading large files, and to also read files that are not local (in case we need that in the production
some day). 

To use papaparse, we first need to import it. We also need filesystem to select the file to be read.
```JavaScript
const filesystem = require('fs');
const papa = require('papaparse');
```

papa.parse should be inside a async function.

## Example of how to use papaparse

```JavaScript
const csvFile = filesystem.createReadStream('csvFilePath');

async function readCSV(){
    return new Promise(resolve => {
        papa.parse(csvFile, {
            worker: true, // to use threads
            step: function(result) {
                // Each line of the file has its own result object.
                // The data inside the current line of the csv file can
                // be accessed with result.data
                console.log(result.data);
            },
            complete: function(results) { // optional argument results, which could
                // be used to print all the results
                console.log(results)

                // Lastly we resolve the Promise
                resolve(results);
            }
        });
    });
}
```