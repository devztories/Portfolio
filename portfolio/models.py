from django.db import models

class SiteContent(models.Model):
    """Editable content for every public portfolio section (one active record)."""
    profile = models.JSONField(default=dict)
    about = models.JSONField(default=list)
    stats = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    projects = models.JSONField(default=list)
    journey = models.JSONField(default=list)
    services = models.JSONField(default=list)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Portfolio content"
        verbose_name_plural = "Portfolio content"

    def __str__(self):
        return "Website content"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=150)
    message = models.TextField(max_length=3000)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created"]
    def __str__(self):
        return f"{self.name}: {self.subject}"
