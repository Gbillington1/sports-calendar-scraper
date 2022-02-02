const cheerio = require('cheerio');
const util = require('./util.js');
const mail = require('./mail.js');

(async () => {
    const html = await util.scrapeCalendar();

    const $ = cheerio.load(html);

    let eventStrings = util.getStringArrayOf($, $('.calendar-daily-event'));

    // light error handling
    if (eventStrings.length == 0) {
        console.log("There are no events today.")
        return
    }

    // todo: find a way to handle postponed games and canceled games
    // todo: find a way to handle special events (Wrestling, swimming, golf, etc.) 
    if (eventStrings[eventStrings.length - 1].includes("Postponed")) {
        console.log("This event has been postponed.")
    }
    
    let locationStrings = util.getStringArrayOf($, $('.calendar-daily-location'));
    
    // merge events and locations into an array of event objects
    let events = util.mergeEvents($, eventStrings, locationStrings)

    // generate announcements from events
    let announcements = mail.generateAnnouncementsFromEvents(events);

    // send email to my address with the events in announement readable format
    mail.sendAnnouncementsEmail(announcements);
    
})();
