from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    path("profile/", views.profile, name="profile"),
    path("resume/", views.resume, name="resume"),
    path("resume/file/", views.resume_file, name="resume-file"),
    path("contact/", views.contact, name="contact"),
    path("manage/login/", views.admin_login, name="manage-login"),
    path("manage/", views.dashboard, name="dashboard"),
    path("manage/logout/", views.admin_logout, name="manage-logout"),
]
