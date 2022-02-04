#!/usr/bin/bash
# this file is copied over to /usr/bin/ when deployed to server
# actual script used in cronjob stored in /usr/bin/
/usr/local/bin/node /home/graham/sports-calendar-scraper/index.js >> /home/graham/cron.log
