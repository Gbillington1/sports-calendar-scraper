require('dotenv').config();
const { default: axios } = require("axios");

/**
 * Gets the HTML for the calendar page.
 * @returns {Promise<string>} A promise that resolves with the HTML for the calendar page.
 */
async function getCalendarHTML() {
    const headers = { "User-Agent": process.env.USER_AGENT }
    const { data: html } = await axios.get(process.env.CALENDAR_URL, { headers });
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

            // remove weird spacing characters
            if (string.includes("\t") || string.includes("\n")) {
                string = removeSpacing(string);
            }

            // add space between event and rescheduled date
            if (string.includes("Rescheduled")) {
                string = string.replace("Rescheduled", " Rescheduled");
            }


            // remove "CAL" from string
            let lastWord = string.substring(string.lastIndexOf(" ") + 1, string.length);
            if (lastWord.includes("CAL")) {
                string = string.replace("CAL", "")
            }

            stringArray.push(string)

        }
    })

    return stringArray;

}


/**
 * Parses the event strings as an object.
 * @param {import("cheerio").CheerioAPI} $ The cheerio API.
 * @param {string[]} eventStrings An array of events as strings.
 * @param {string[]} locationStrings An array of locations.
 * @returns {{ time: string; team: string; opponent: string; date: string; location: string; home: string }[]} An array of event objects.
 */
function mergeEvents($, eventStrings, locationStrings) {
    if (eventStrings.length != locationStrings.length) {
        return new Error("Event Strings and Location Strings are not the same length");
    }

    // Get date from calendar element in html (date relative to page, not machine)
    const dateElem = removeSpacing($(".daily-calendar").text().trim());
    const date = dateElem.substring(0, dateElem.search(/\n/));

    const events = eventStrings.filter((eventString) => {
        if (eventString.includes('Canceled')) {
            return false; // skip canceled events
        }
        return true;
    }).map((eventString, index) => {

        const time = eventString.substring(0, eventString.search(" ") + 3);
        const team = eventString.substring(eventString.search(" ") + 5, eventString.search("vs") - 6);
        const opponent = eventString.substring(eventString.search("vs") + 3, eventString.length);
        const location = locationStrings[index];
        const home = location.includes(process.env.HOME_TOWN);
        return { time, team, opponent, date, location, home };
    })

    return events;
}

function removeSpacing(string) {
    return string.replace(/\t|\n/g, "");
}

module.exports = {
    getCalendarHTML,
    getStringArrayOf,
    mergeEvents
}
