import json
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from . import content
from .models import ContactMessage, SiteContent

FIELDS = ("profile", "about", "stats", "skills", "projects", "journey", "services")

def get_site_content():
    obj = SiteContent.objects.order_by("pk").first()
    if obj is None:
        obj = SiteContent.objects.create(
            profile=content.PROFILE, about=content.ABOUT, stats=content.STATS,
            skills=content.SKILLS, projects=content.PROJECTS,
            journey=content.JOURNEY, services=content.SERVICES)
    return obj

def clean_skills(skills):
    """Admin-entered levels are forced into 0-100 so the bars can never break."""
    out = []
    for cat in skills if isinstance(skills, list) else []:
        if not isinstance(cat, dict): continue
        items = []
        for it in cat.get("items", []):
            try:
                name, lv = it[0], int(float(it[1]))
            except (IndexError, TypeError, ValueError):
                continue
            items.append((name, max(0, min(100, lv))))
        out.append({**cat, "items": items})
    return out

@ensure_csrf_cookie
def index(request):
    obj = get_site_content()
    context = { "p": obj.profile, "about": obj.about, "stats": obj.stats,
        "skills": clean_skills(obj.skills), "projects": obj.projects, "journey": obj.journey,
        "services": obj.services }
    return render(request, "index.html", context)

def profile(request):
    obj = get_site_content()
    return render(request, "profile.html", {"p": obj.profile, "about": obj.about})

@require_POST
def contact(request):
    try:
        d = json.loads(request.body)
        assert isinstance(d, dict)
    except (ValueError, AssertionError):
        return JsonResponse({"ok": False, "errors": {"message": "Invalid request."}}, status=400)
    if d.get("website"):
        return JsonResponse({"ok": True})
    f = {k: str(d.get(k, "")).strip() for k in ("name", "email", "subject", "message")}
    errors = {}
    if len(f["name"]) < 2: errors["name"] = "Enter your name."
    try: validate_email(f["email"])
    except ValidationError: errors["email"] = "Enter a valid email address."
    if len(f["subject"]) < 3: errors["subject"] = "Enter a subject."
    if len(f["message"]) < 10: errors["message"] = "Write at least 10 characters."
    if any(len(v) > (3000 if k == "message" else 150) for k, v in f.items()): errors["message"] = "That is too long."
    if errors: return JsonResponse({"ok": False, "errors": errors}, status=400)
    ContactMessage.objects.create(**f)
    obj = get_site_content()
    to = settings.CONTACT_TO_EMAIL or obj.profile.get("email", "")
    try:
        if to:
            send_mail(f"[Portfolio] {f['subject']}", f"From: {f['name']} <{f['email']}>\\n\\n{f['message']}",
                settings.EMAIL_HOST_USER or "noreply@localhost", [to], fail_silently=True)
    except Exception:
        pass
    return JsonResponse({"ok": True})

def admin_login(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    error = ""
    if request.method == "POST":
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user and user.is_staff:
            login(request, user)
            next_url = request.GET.get("next", "")
            if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                return redirect(next_url)
            return redirect("dashboard")
        error = "Invalid login details or this account has no admin access."
    return render(request, "manage/login.html", {"error": error})

@login_required
def dashboard(request):
    if not request.user.is_staff:
        logout(request)
        return redirect("manage-login")
    obj = get_site_content()
    if request.method == "POST":
        field = request.POST.get("section", "")
        if field not in FIELDS:
            messages.error(request, "Unknown content section.")
            return redirect("dashboard")
        try:
            value = json.loads(request.POST.get("content", "null"))
            if field == "profile" and not isinstance(value, dict):
                raise ValueError("Profile content is invalid.")
            if field != "profile" and not isinstance(value, list):
                raise ValueError("Section content is invalid.")
            setattr(obj, field, value)
            obj.save(update_fields=[field, "updated"])
            messages.success(request, f"{field.title()} content saved successfully.")
        except (json.JSONDecodeError, ValueError) as exc:
            messages.error(request, str(exc) or "Could not save this section.")
        return redirect("dashboard")

    sections = []
    descriptions = {
        "profile": "Your name, role, introduction, contact details, social links and section headings.",
        "about": "The paragraphs shown in your About section.",
        "stats": "Numbers and labels displayed in your highlights.",
        "skills": "Skill groups and tools. Use the slider to set how full each tool's percentage line is (0-100).",
        "projects": "Project titles, descriptions, tags, links, screenshots and details.",
        "journey": "Your education, career and learning timeline entries.",
        "services": "The services and descriptions displayed on your website.",
    }
    for field in FIELDS:
        sections.append({
            "key": field,
            "title": field.replace("_", " ").title(),
            "description": descriptions[field],
            "content": getattr(obj, field),
        })
    return render(request, "manage/dashboard.html", {
        "sections": sections,
        "message_count": ContactMessage.objects.count(),
        "latest_messages": ContactMessage.objects.all()[:8],
        "updated": obj.updated,
    })

@login_required
def admin_logout(request):
    logout(request)
    return redirect("manage-login")
