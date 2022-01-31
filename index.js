require("dotenv").config();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

(async () => {

    // open browser and go to GMHS sports schedule page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.CALENDAR_URL, {
        waitUntil: 'networkidle2'
    });

    // get html and load it into parser (cheerio) 
    const html = await page.content();

    const $ = cheerio.load(html);
    let eventStrings = getStringArrayOf($('.calendar-daily-event'));
    console.log(eventStrings)
    let locationStrings = getStringArrayOf($('.calendar-daily-location'));
    console.log(locationStrings)

    // $(".calendar-daily-location").each((i, elem) => {
    //     let locationString = $(elem).text().trim();

    //     if (!locationString.includes("Locaiton")) {
    //         if (eventString.includes("\t")) {
    //             eventString = eventString.replace(/\t/g, "")
    //         }
    //     }
    // })



    // loop through all events on the calendar
    // $(".calendar-daily-event, .calendar-daily-location").each(function (i, elem) {

    //     // get the game string from the event
    //     let eventString = $(this).text().trim();
    //     console.log(eventString)

    //     // remove unwanted elements and characters from each event string
    //     if (!eventString.includes('Event')) {

    //         if (eventString.includes("\t")) {
    //             eventString = eventString.replace(/\t/g, "")
    //         }

    //         // // manipulate string to form an Game object to be pushed into the array
    //         // let game = {
    //         //     time: ,
    //         //     team: ,
    //         //     opponent: ,
    //         // }


    //         // populate array of games
    //         eventStrings.push(eventString)

    //     }
    // })
    // console.log(gameStrings)
    // get array of today's games from calendar 
    // let dailySportsCalendar = $(".calendar-daily-event").html()
    // console.log(dailySportsCalendar)
    // .replace('/(\\t|\s)+/g', 'nothign');
    // dailySportsCalendar = dailySportsCalendar.map(game => {
    //     // console.log(game.trim())
    //     game.trim();
    //     return game.replace(/\\t/g, '');

    // })





    await browser.close();

    // takes in array of cheerio objects and returns array of strings
    function getStringArrayOf(array) {

        let stringArray = [];
        array.each((i, elem) => {

            let string = $(elem).text().trim();

            if (!string.includes($(array[0]).text().trim())) {
                if (string.includes("\t")) {
                    string = string.replace(/\t/g, "")
                }

                stringArray.push(string)

            }
        })

        return stringArray;

    }


})();

