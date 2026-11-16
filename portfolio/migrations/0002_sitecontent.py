from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [("portfolio", "0001_initial")]
    operations = [
        migrations.CreateModel(
            name="SiteContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("profile", models.JSONField(default=dict)),
                ("about", models.JSONField(default=list)),
                ("stats", models.JSONField(default=list)),
                ("skills", models.JSONField(default=list)),
                ("projects", models.JSONField(default=list)),
                ("journey", models.JSONField(default=list)),
                ("services", models.JSONField(default=list)),
                ("updated", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Portfolio content", "verbose_name_plural": "Portfolio content"},
        ),
    ]
