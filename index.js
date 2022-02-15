require("dotenv").config({path: __dirname + "/.env"});

const cheerio = require('cheerio');
const util = require('./util.js');
const mail = require('./mail.js');

(async () => {
    const html = await util.getCalendarHTML();

    const $ = cheerio.load(html);

    const eventStrings = util.getStringArrayOf($, $('.calendar-daily-event'));

    // light error handling
    // TODO: email me this string
    if (eventStrings.length == 0) {
        mail.sendEmail("Georgetown Sports Calendar", "No events today");
        return
    }

    // todo: find a way to handle postponed games and canceled games
    // todo: find a way to handle special events (Wrestling, swimming, golf, etc.) 
    if (eventStrings[eventStrings.length - 1].includes("Postponed")) {
        console.log("This event has been postponed.")
    }
    
    const locationStrings = util.getStringArrayOf($, $('.calendar-daily-location'));
    
    // merge events and locations into an array of event objects
    const events = util.mergeEvents($, eventStrings, locationStrings)

    // generate announcements from events
    const announcements = mail.generateAnnouncementsFromEvents(events);

    // get email body from announcements
    const announcementString = mail.getAnnouncementString(announcements);

    // send email to my address with the events in announement readable format
    mail.sendEmail("Today's Sports News", announcementString);
    
})();
