const fs = require('fs');

const xlsx = require('xlsx');

// let buffer = fs.readFileSync('./example.json');
// //this is buffer data

// let data = JSON.parse(buffer);  //change buffer data to string
// //This method is used to convert buffer or any type of data to string


// console.log(data)

let jsonFile = require('./example.json'); //requiring json file //alternate method of requiring a file without using fs module

jsonFile.push({
    name: "Thor",
    "last name": "Odinson",
    isAvenger: true,
    age: 4000,
    friends: ["Tony", "Bruce", "peter"],
    address: {
        Planet: "Asgard",

    },
})

//comma necessarry in the last for pushing new object in JSON file
//Will push an object into jsonFile but not the original JSON file

// console.log(jsonFile)


//TO push json data into original JSON file
//connvert json data into stringdata so that we can write it in other files
let stringData = JSON.stringify(jsonFile);

console.log(stringData)

//now push data to original json file
fs.writeFileSync("example.json", stringData)
//writing to json file

console.log("Json file updated")

//code snippet //to read json data in excel
let newWB = xlsx.utils.book_new();  //creatine new workbook
let newWS = xlsx.utils.json_to_sheet(jsonFile); //workbook to sheet format(rows and column format)
xlsx.utils.book_append_sheet(newWB, newWS, 'Avengers'); 
xlsx.writeFile(newWB, 'abc.xlsx');  //xlsx dont deal with nested objects or arrays


//code snippet //to read excel data in json
let wb = xlsx.readFile('abc.xlsx');
let excelData = wb.Sheets['Avengers'];
let ans = xlsx.utils.sheet_to_json(excelData);
console.log(ans)

