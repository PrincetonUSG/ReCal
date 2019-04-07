# Scraper

All of the scraper implementation is located in the `course_selection` folder. Within it:

* `scrape_all.py` is the main interface into the scraper
* `scrape_parse.py` contains the code for downloading and parsing the data into a dictionary format
* `scrape_validate.py` performs validation in the given dictionary format
* `scrape_import.py` imports the dictionary format into the database
