from django.conf import settings
from scrape_parse import scrape_parse_semester
from scrape_validate import validate_course
from scrape_import import scrape_import_course, ScrapeCounter


def get_all_courses():
    term_code = settings.ACTIVE_TERMS[-1]
    try:
        print "Scraping for semester " + str(term_code)
        courses = scrape_parse_semester(term_code)
        # just a sanity check in case we ever modify scrape_parse
        [validate_course(x) for x in courses]
        print("validated")
        scrapeCounter = ScrapeCounter()
        [scrape_import_course(x, scrapeCounter) for x in courses]
        print str(scrapeCounter)
        print "----------------------------------"
    except Exception as e:
        print e
