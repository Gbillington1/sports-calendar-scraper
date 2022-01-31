const cheerio = require('cheerio');
const util = require('./util.js');

(async () => {
    const html = await util.scrapeCalendar();
    
    const $ = cheerio.load(html);
    
    // let eventStrings = [
    //     '4:30 PM: JV-2 Boys Basketball Game vs North Reading',
    //     '5:00 PM: Junior Varsity Girls Basketball Game vs North Reading',
    //     '6:30 PM: Varsity Girls Basketball Game vs North ReadingCAL',
    //     '7:30 PM: Varsity Boys Basketball Game vs North ReadingCAL'
    // ] 

    let eventStrings = util.getStringArrayOf($, $('.calendar-daily-event'));

    // light error handling
    if (eventStrings.length == 0) {
        console.log("There are no events today.")
        return
    }

    // todo: find a way to handle postponed games and canceled games
    // todo: find a way to handle special events (Wrestling, swimming, golf, etc.) 
    if (eventStrings[eventStrings.length -1].includes("Postponed")) {
        console.log("This event has been postponed.")
    }
    
    // let locationStrings = [
    //     'North Reading High School',
    //     'Georgetown High School',
    //     'Georgetown High School',
    //     'North Reading High School'
    // ]
    let locationStrings = util.getStringArrayOf($, $('.calendar-daily-location'));
    
    // merge events and locations into an array of event objects
    let events = util.mergeEvents($, eventStrings, locationStrings)
    
    console.log(events)
})();