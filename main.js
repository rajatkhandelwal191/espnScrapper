const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const request = require('request');
const cheerio = require('cheerio');

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

    getAllMatchesLink(fullLink);  //us page tak phuche jaha sare match pde hai
}

function getAllMatchesLink(uri){
    request(uri, function(error, response, html){  //uri, cb  //request isliye kiya kyuki uri hai sirf usko request kero fir cheerio.load kero
        if(error){
            console.error(error);
        }
        else{
            extractAllMatchesLink(html) ;  //scorecard ka link nikalege sbhi matches ka
        }

    })

}

function extractAllMatchesLink(html){  //$ is a sel tool

    let $ = cheerio.load(html);
    let scoreCardArr = $('a[data-hover="Scorecard"]'); //sare matches ka link hai ScorCardArray me

    for(let i = 0; i < scoreCardArr.length; i++){
        let link = $(scoreCardArr[i]).attr('href');
        let fullLink = "https://www.espncricinfo.com/" + link;
    }
}

