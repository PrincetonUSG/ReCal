# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ("course_selection", "0003_course_colors"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="ColorPalette",
            new_name="Color_Palette",
        ),
    ]
