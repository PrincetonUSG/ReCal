from django.conf import settings
from django.core.cache import cache, caches
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    """A simple management command which clears the site-wide cache."""

    help = "Fully clear your site-wide cache."

    def handle(self, *args, **kwargs):
        try:
            assert settings.CACHES
            cache.clear()
            self.stdout.write("Your default cache has been cleared!\n")
            caches["courses"].clear()
            self.stdout.write("Your courses cache has been cleared!\n")
            caches["courseapi"].clear()
            self.stdout.write("Your courseapi cache has been cleared!\n")
        except AttributeError:
            raise CommandError("You have no cache configured!\n")
