require('dotenv').config()
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASS
    }
});

// input: array of events objects
// output: array of strings containing announcements
function generateAnnouncementsFromEvents(events) {
    let announcements = [];

    // form announcement for each event
    events.forEach(event => {

        const homeOrAway = (event.home == true) ? "home" : "away";
        const todayOrTonight = (event.time.includes("PM")) ? "tonight" : "today";

        announcements.push(`${event.team} is ${homeOrAway} vs ${event.opponent} ${todayOrTonight} at ${event.time}`);
    });

    return announcements;
}

function sendEmail(subject, message) {
    // form mail options
    let mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: subject,
        text: message
    };

    // send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// send the announcements to my email
function getAnnouncementString(announcements) {

    // form email body
    let text = "Today's sports news:\n\n";
    for (let i = 0; i < announcements.length; i++) {
        text += `${announcements[i]}\n\n`;
    }

    return text;

}

module.exports = {
    generateAnnouncementsFromEvents,
    sendEmail,
    getAnnouncementString
}