#!/usr/bin/bash
# actual script used in cronjob stored in /usr/bin/
/usr/local/bin/node /home/graham/sports-calendar-scraper/index.js >> /home/graham/cron.log
