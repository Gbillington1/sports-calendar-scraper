#!/usr/bin/bash
# this file is copied over to /usr/bin/ when deployed to server
# the actual script used in cronjob stored in /usr/bin/
NODE_ENV=production /usr/local/bin/node /home/graham/sports-calendar-scraper/index.js >> /home/graham/sports-calendar-scraper/cron.log
