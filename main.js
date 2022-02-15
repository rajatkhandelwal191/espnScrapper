const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const request = require('request');
const cheerio = require('cheerio');
const allMatchObj = require('./allMatchObj');
const fs = require('fs');
const path = require('path');

 // __dirname will give parent directory path of our file

 let iplPath = path.join(__dirname, "IPL") //DIRNAME IS espn scrapper

 function dirCreator(filePath){
     if(fs.existsSync(filePath) == false){  
         fs.mkdirSync(filePath)
     }
 }


 dirCreator(iplPath);  //create ipl folder in espnScrapper

request(url, cb)

function cb(err, response, html){
    if(err){
        console.error(err);
    }else{
        extractLink(html);
    }
}

function extractLink (html){
    let selTool = cheerio.load(html);

    let anchorElement = selTool('a[data-hover="View All Results"]'); //attribute tag //view all result link
    let link = anchorElement.attr("href") ; //humko href chiye attribute se

    console.log(link)  //puri link nhi aayi

    let fullLink = "https://www.espncricinfo.com/" + link; 
    // console.log(fullLink)

    allMatchObj.getAllMatch(fullLink) //us page tak phuche jaha sare match pde hai
}


