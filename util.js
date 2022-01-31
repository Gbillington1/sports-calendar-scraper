require("dotenv").config();
const puppeteer = require('puppeteer');

// uses puppeteer to scrape todays sports calendar page 
async function scrapeCalendar() {
    // open browser and go to specified calendar page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.CALENDAR_URL, {
        waitUntil: 'networkidle2'
    });

    // get html return it
    const html = await page.content();

    browser.close();

    return html;
}

// input: array of cheerio objects containing weirdly formatted event data
// output: array of strings containing event data
function getStringArrayOf($, array) {

    let stringArray = [];
    array.each((i, elem) => {

        let string = $(elem).text().trim();

        // excludes the "Events" row that doesn't have an event
        if (!string.includes($(array[0]).text().trim())) {

            // remove weird tab characters
            if (string.includes("\t")) {
                string = removeTabs(string)
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
// input: array of strings containing event data, array of strings containing location data
// output: array of event objects
function mergeEvents($, eventStrings, locationStrings) {

    // error handling
    if (eventStrings.length != locationStrings.length) {
        return new Error("Event Strings and Location Strings are not the same length");
    }
    
    let events = [];

    // Get date from calendar element in html (date relative to page, not machine)
    let dateElem = removeTabs($(".daily-calendar").text().trim());
    let date = dateElem.substring(0, dateElem.search(/\n/));

    // loop through each event string and location string
    // populate array of event objects
    eventStrings.forEach((eventString, i) => {

        let event = {
            time: "",
            date: "",
            team: "",
            opponent: "",
            location: ""
        }

        // time from string "4:30 PM"
        event.time = eventString.substring(0, eventString.search(" ") + 3);

        // current day of the week
        event.date = date

        // team from left side of "vs" in the left side of the string
        event.team = eventString.substring(eventString.search(" ") + 5, eventString.search("vs") - 6);

        // opponent from right side of "vs" in event string
        event.opponent = eventString.substring(eventString.search("vs") + 3, eventString.length);


        event.location = locationStrings[i];

        events.push(event)

    })

    return events;

}

function removeTabs(string) {
    return string.replace(/\t/g, "")
}

module.exports = {
    scrapeCalendar,
    getStringArrayOf,
    mergeEvents
}