require("dotenv").config();
const puppeteer = require('puppeteer');

// uses puppeteer to scrape todays sports calendar page 
async function scrapeCalendar() {
    // open browser and go to GMHS sports schedule page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.CALENDAR_URL, {
        waitUntil: 'networkidle2'
    });
    
    // get html and load it into parser (cheerio) 
    const html = await page.content();
    
    browser.close();

    return html;
}

// takes in array of cheerio objects and returns array of strings
// used to get the event data out of the cheerio objects 
// todo: add removal of "CAL" at end of events 
function getStringArrayOf($, array) {

    let stringArray = [];
    array.each((i, elem) => {

        let string = $(elem).text().trim();
        console.log(typeof string)

        // excludes the "Events" row that doesn't have an event
        if (!string.includes($(array[0]).text().trim())) {

            // remove weird tab characters
            if (string.includes("\t")) {
                string = string.replace(/\t/g, "")
            }

            // remove "CAL" from end of string
            let lastWord = string.substring(string.lastIndexOf(" ") + 1, string.length);
    
            if (lastWord.includes("CAL")) {
                string = string.replace("CAL", "")
            }

            stringArray.push(string)

        }
    })

    return stringArray;

}

// function to parse/merge the event and location arrays into an array of event objects
function mergeEvents(eventStrings, locationStrings) {

    let events = [];

    // error handling
    if (eventStrings.length != locationStrings.length) {
        return new Error("Event Strings and Location Strings are not the same length");
    }

    // loop through each event string and location string
    // populate array of event objects
    eventStrings.forEach((eventString, i) => {
        
        let event = {
            time: "",
            day: "",
            team: "",
            opponent: "",
            location: ""
        }
        
        // time from string "4:30 PM"
        event.time = eventString.substring(0, eventString.search(" ") + 3);

        // current day of the week
        event.day = new Date().toLocaleString('en-us', {  weekday: 'long' });

        // team from left side of "vs" in the left side of the string
        event.team = eventString.substring(eventString.search(" ") + 5, eventString.search("vs") - 6);

        // opponent from right side of "vs" in event string
        event.opponent = eventString.substring(eventString.search("vs") + 3, eventString.length);
    

        event.location = locationStrings[i];

        events.push(event)

    })

    return events;

}

module.exports = {
    scrapeCalendar,
    getStringArrayOf,
    mergeEvents
}