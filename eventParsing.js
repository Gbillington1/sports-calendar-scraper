/*
    What event formats are there?
    1. Standard team vs oppenent format: Varsity Field Hockey Game vs Hamilton-Wenham
    2. League wide event format: Varsity Wrestling {leagueName} Open {leagueName} Open

    Which sports follow each format?
    1. 
     - Lacrosse
     - Softball
     - Basketball
     - Baseball
     - Track
     - Field Hockey
     - Football
     - Golf
     - Soccer
     - Volleyball
     - Cross Country
     - Cheerleading

    2.
     - Swimming & Diving: 2:30 PM: Varsity Girls Swimming & Diving {leagueName} League Meet{leagueName} League Meet
     - Wrestling: 9:30 AM: Varsity Wrestling {leagueName} Open{leagueName} Open
     - Cheerleading: 6:30 PM: Varsity Fall Cheerleading {leagueName} League Cheering Comp {leagueName} League Cheering Comp

    What other formatting issues are there?
    1. There are multiple kids of statuses that an event can have
     - On Schedule
     - Postponed
     - Rescheduled
     - Canceled

    3. Strings that are below the actual event are parsed incorrectly and seem to be appended to the end of the string. Sometimes this string is the "Rescheduled" string, and sometimes its a repeat of what was in the original game string. Fortunately, these strings are separated by new lines
     - 5:30 PM: Varsity Girls Volleyball Match vs {opponent} Round of 32 (see round of 32)
     - 2:30 PM: Varsity Boys Swimming & Diving Dive MeetDive Meet (see dive meet)
     - 9:30 AM: Varsity Wrestling {leagueName} {leagueName} OpenRescheduled from Jan 30, 2022

    How do I correctly parse all of these different events?
    1. Get the text of the correct html elements
     - ignore league box, account for status box
    2. Remove extraneous characters from the text that was just extracted
     - Only remove the those characters from the outsides of the string if possible
    3. Search the text to find what sport is being parsed
    4. Call 2 different functions depending on the sport (parseRegularFormat and parseLeaugeWideFormat)
    5. Remove weird duplicated words
    6. Break apart string to get the event in an object
    
*/

/**
 * Parses event text from website as an object
 * @param {import("cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {{ time: string; team: string; opponent: string; date: string; location: string; status: string }[]}
 */
function getEvents($) {

    // remove trailing league string from the event elements
    $('.league-box').remove();

    // get relevent event information
    const games = getGameStrings($);
    const times = getTimes(games);
    const opponents = getOpponents(games);
    const locations = getLocations($);
    const statuses = getGameStatuses($);
    const homeTeams = getHomeTeams($);
    const eventTitles = getEventTitles($);
    const date = getDate($);

    // throw error if the above arrays are not the same length
    if (games.length != locations.length || games.length != statuses.length || games.length != times.length || games.length != homeTeams.length || games.length != opponents.length) {
        throw new Error("Event info arrays are not the same length");
    }

    let events = [];

    for (let i = 0; i < games.length; i++) {

        let event = {
            time: times[i],
            team: homeTeams[i],
            opponent: opponents[i],
            eventTitle: eventTitles[i],
            date: date,
            location: locations[i],
            status: statuses[i],
        }

        // Checks if the event one of the 3 weirdly formatted sports and if the event is a regular event or a league wide event (no opponents) 
        if ((games[i].includes('Swimming & Diving') || games[i].includes('Wrestling') || games[i].includes('Cheerleading')) && eventTitles[i].length > 0) {
            event.opponent = eventTitles[i];
        }

        events.push(event);

    }

    return events;

}

/**
 * Parses string with time and teams from elements with .calendar-daily-event 
 * @param {import("Cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string[]} An array of game strings
 */
function getGameStrings($) {
    const gameStrings = [];

    $('.calendar-daily-event span.d-block').each(function () {

        // ignore children that don't contain relevant game information
        if (!($(this).hasClass('calendar-daily-title') || $(this).hasClass('calendar-daily-status'))) {

            // if ($(this).siblings('.calendar-daily-status').text().includes('Canceled')) {
            //     console.log('canceled')
            // } else {
            //     console.log('chillin')
            // }

            gameStrings.push($(this).text().trim())

        }
    })

    return gameStrings;
}

/**
 * Parses game location out of html with Cheerio 
 * @param {import("cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string[]} An array of locations 
 */
function getLocations($) {

    let locations = [];

    $('.calendar-daily-location span.d-none.d-lg-inline').each(function () {
        locations.push($(this).text().trim());
    })

    return locations
}

/**
 * Parses game status out of html with Cheerio
 * @param {import("Cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string[]} An array of statuses, '' if none
 */
function getGameStatuses($) {
    let statuses = [];

    $('.calendar-daily-status').each(function () {

        statuses.push($(this).text().trim());

    })

    return statuses
}

/**
 * Parses game time out of game strings
 * @param {string[]} gameStrings An array of game strings
 * @returns {string[]} An array of times
 */
function getTimes(gameStrings) {
    let times = [];

    for (let i = 0; i < gameStrings.length; i++) {
        times.push(gameStrings[i].substring(0, gameStrings[i].indexOf(': ')));
    }

    return times;
}

/**
 * Parses home team out of game strings
 * @param {import("Cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string[]} An array of home teams (ex: Varsity Boys Basketball)
 */
function getHomeTeams($) {
    let homeTeams = [];

    $('.calendar-daily-event span.d-block').each(function () {
        // ignore elems that don't contain relevant game information
        if (!($(this).hasClass('calendar-daily-title') || $(this).hasClass('calendar-daily-status'))) {

            homeTeams.push($(this).children().eq(0).text().trim())

        }
    })

    return homeTeams;
}

/**
 * Parses opponents out of game strings
 * @param {string[]} gameStrings An array of game strings 
 * @returns {string[]} An array of opponents
 */
function getOpponents(gameStrings) {
    let opponents = [];

    for (let i = 0; i < gameStrings.length; i++) {
        opponents.push(gameStrings[i].substring(gameStrings[i].indexOf('vs ') + 3, gameStrings[i].length));
    }

    return opponents;
}

/**
 * Parses the date of the calendar out of the html with Cheerio
 * @param {import("Cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string} The date of the calendar being scraped
 */
function getDate($) {
    const dateString = $('.daily-calendar span').eq(0).text().trim()
    return dateString;
}

/**
 * Parses event title out of the .calendar-daily-title element to check for tournaments, league meets, etc.
 * @param {import("Cheerio").CheerioAPI} $ The Cheerio API to parse HTML
 * @returns {string[]} An array of event titles
 */
function getEventTitles($) {

    let eventTitles = [];

    $('.calendar-daily-event span.d-block').each(function () {

        if ($(this).hasClass('calendar-daily-title')) {

            eventTitles.push($(this).text().trim())

        }
    })

    return eventTitles;

}

module.exports = {
    getEvents
}
