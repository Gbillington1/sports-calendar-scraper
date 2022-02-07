# Sports Calendar Scraper
This NodeJS script scrapes my school's sports calendar and then sends me an email with the properly formatted events to read on the morning announcments at school.

### Todo
- [x] Configure RPI 
- [x] Write cronjob to run script every weekday at 7 AM `0 7 * * 1-5 bash runsportscalscraper.sh`
- [x] Write git deployment hook to automate deployment to RPI
- [ ] Create a way to format every event across all sports
  - [ ] Categorize different types of events
    - [ ] sport: soccer, football, golf, field hockey, volleyball, cross country, track, basketball, swimming & diving, wrestling, cheerleading, alpine ski, baseball, softball, lacrosse
    - [ ] event status: on schedule, rescheduled/postponed, canceled
    - [ ] event: 
      - [ ] 
- [ ] Handle special events (swim/wrestling meets, golf matches, postponed events, rescheduled events, canceled events, etc.)
  - [ ] Categorize the different types of events
- [ ] Scrape scores from games that happened the day before to report on announcements


### Please critique my code!
As a young developer, I am constantly learning. Feel free to leave any feedback via issues or pull requests. Additionally, you can leave a TikTok comment (see below), or you can [send me an email.](mailto:graham@grahambillington.com)

### Summary of the project
[View on TikTok](https://www.tiktok.com/@grahambillington/video/7059563461705174318?is_copy_url=1&is_from_webapp=v1)