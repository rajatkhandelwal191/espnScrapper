const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { patch } = require('request');
const path = require('path');

const xlsx = require('xlsx');

function processScoreCard(url){ //ye url fulllink hai jo ki allMatchObj se aaya hai

    request(url, cb)
}


function cb(err, response, html){
    if(err){
        console.error(err);
    }else{
        extractMatchesDetails(html);  //Match details page ko extract krege after clicking view all results
    }
}

function extractMatchesDetails(html){
    let $ = cheerio.load(html);

    let descString = $('.header-info .description')  //Kisi ek match ke description ko nikala jisme venue , date , result h

    let descStringArray = descString.text().split(',');  //string ko array m convert krne ke liye split() use kiya bcaz it will return Array

    let venue = descStringArray[1].trim(); //trim kiya to avoid some extra space
    let date = descStringArray[2].trim();

    let result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text').text(); //html ko text m convert kiya for our reading purpose
    
    console.log(venue)
    console.log(date)
    console.log(result)

    console.log('...........................................................') //for seperating two html


    let innings = $('.card.content-block.match-scorecard-table>.Collapsible') //take data of table of Mumbai and Chennai and not match details table

    let htmlString = ''

    for(let i = 0; i< innings.length; i++){
        htmlString += $(innings[i]).html() //innigs ke andar table ke data ka html nikal liya
        // or innings.html me dal diya

        let teamName = $(innings[i]).find('h5').text();  //this find method is from cheerio which takes element as input
        // Mumbai Indians INNINGS (20 overs maximum)
        // Chennai Super Kings INNINGS (target: 163 runs from 20 overs)
        //  0                      1     2 
        teamName = teamName.split('INNINGS')[0].trim();  //array return kiya team name ka jo 0 index pe h
        
        let opponentIndex = i == 0  ? 1 : 0; //i = 0 ke liye 1 idx wala opponent return kro and vise versa //ternary operator
        
        let opponentName = $(innings[opponentIndex]).find('h5').text();
        opponentName = opponentName.split('INNINGS')[0].trim()

        // console.log(teamName, opponentName)


        let currInning = $(innings[i]); //currentInning

        let allRows = currInning.find('.table.batsman tbody tr')  ///sari rows nikali

        for(let j = 0; j < allRows.length; j++){
            let allColumns = $(allRows[j]).find('td') //sari rows ke andar ke coulomn ko iterate kiya

            let isWorthy = $(allColumns[0]).hasClass('batsman-cell') //espn m table ke niche ek or table h jo ki collapsible h usse bachne ke liye ye "batsman-cell" class ko use kiya
                                        //  hasClass --> take class as argument

            if(isWorthy == true){ //agar ye batsman h to 

                let playerName = $(allColumns[0]).text().trim();
                let Runs = $(allColumns[2]).text().trim();
                let Balls = $(allColumns[3]).text().trim();
                let fours = $(allColumns[5]).text().trim();
                let sixes = $(allColumns[6]).text().trim();
                let strikeRate = $(allColumns[7]).text().trim();

                console.log(`${playerName} | ${Runs} | ${Balls} | ${fours} | ${sixes} | ${strikeRate}`);
                //    Template Literal used here in Bectics


                processPlayer(teamName, opponentName, playerName, Runs, Balls, fours, sixes, strikeRate, venue, date, result);

            }
        }

        console.log('....................................................................................')


    }
    // console.log(htmlString)
}


function processPlayer(teamName, opponentName, playerName, Runs, Balls, fours, sixes, strikeRate, venue, date, result){

    let teamPath = path.join(__dirname, 'IPL', teamName);

    dirCreator(teamPath);  //sari team ke folder bna dega

    let filePath = path.join(teamPath, playerName + ".xlsx") //team ke andar sari file bnai players ki in xlsx format

    let content = excelReader(filePath, playerName);
    
    let playerObj = {

        playerName,  //when just writing keys in object, key and value name will be same
        teamName,
        opponentName,
        Runs,
        Balls, 
        fours,
        sixes,
        strikeRate,
        venue,
        date,
        result,
    };

    //content me is object ko push krdo

    content.push(playerObj);

    excelWriter(filePath, playerName, content); //excel me write kiya file me content ko
}

function dirCreator(teamFolderPath){
    if(fs.existsSync(teamFolderPath) == false){  //reapeatation of team folder will be avoided by this
        fs.mkdirSync(teamFolderPath)
    }
}

//code snippet //to read json data in excel
function excelWriter(fileName, sheetName, jsonData){

    let newWB = xlsx.utils.book_new();  //creatine new workbook
    let newWS = xlsx.utils.json_to_sheet(jsonData);//json is converted to sheetformat //workbook to sheet format(rows and column format)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName); 
    xlsx.writeFile(newWB, fileName);  //
}


//code snippet //to read excel data in json
function excelReader(fileName, sheetName){

    if(fs.existsSync(fileName) == false){ //agar fileName pehle se exist krta hai to return krdo [] blank array ko
        return [];
    }

    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    // console.log(ans)
    return ans; 
}


module.exports = {
    ps : processScoreCard  //ye ps allMatchObj Me jaega or link laega saari
};