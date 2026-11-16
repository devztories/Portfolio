from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created",)
