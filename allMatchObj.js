const cheerio = require('cheerio');
const request = require('request');

const scorCardObj = require('./scoreCard');

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

        scorCardObj.ps(fullLink); //scoreCardOBJ me full link bheja jo scoreCard file me url ka kaam krega
    }
}

module.exports = {
    getAllMatch : getAllMatchesLink,
};
