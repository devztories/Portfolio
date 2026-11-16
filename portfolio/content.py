"""All site content lives here. Edit values; templates and JS update automatically.
Empty links ("") hide the matching button. Stats of 0 display as an em dash."""
PROFILE = {
    "name": "[YOUR NAME]", "location": "Kerala, India", "email": "[YOUR EMAIL]",
    "github": "", "linkedin": "", "instagram": "", "whatsapp": "",  # whatsapp: full wa.me URL
    "resume": "",  # e.g. "/static/resume.pdf" after you drop your file in static/
    "tagline": "Turning Ideas Into Intelligent Digital Experiences.",
    "roles": ["Python Developer", "Django Developer", "AI/ML Developer", "Full Stack Developer"],
    "intro": "I build web applications with Django and machine learning models with Python, and care about both how they work and how they feel.",
    "about_heading": "Code that thinks.\nInterfaces that feel.",
    "skills_heading": "Tools I work with",
    "projects_heading": "Selected work",
    "journey_heading": "Learning journey",
    "services_heading": "What I can build for you",
    "contact_heading": "Let's build something.",
    "contact_intro": "Tell me about your idea, project or opportunity.",
    "explore_label": "Explore my work",
    "connect_label": "Let's connect",
    "contact_button": "Send message",
}
ABOUT = [
    "Replace this with your story: how you started programming and what pulled you toward software engineering and AI.",
    "Technical interests: backend architecture, REST APIs, and applied machine learning.",
    "Goal: write a sentence about the kind of role or problems you want to work on next.",
]
STATS = [  # set real values; 0 shows as an em dash
    {"label": "Projects completed", "value": 0}, {"label": "Technologies explored", "value": 0},
    {"label": "GitHub contributions", "value": 0}, {"label": "Years of experience", "value": 0},
]
SKILLS = [  # level is 0-100: edit to match your honest confidence
    {"cat": "Programming", "icon": "code-2", "items": [("Python", 80), ("JavaScript", 60), ("SQL", 65)]},
    {"cat": "Backend", "icon": "server", "items": [("Django", 80), ("Django REST Framework", 65), ("REST APIs", 70)]},
    {"cat": "Frontend", "icon": "layout-template", "items": [("HTML5", 80), ("CSS3", 75), ("JavaScript", 60), ("Bootstrap", 70)]},
    {"cat": "AI / Machine Learning", "icon": "brain-circuit", "items": [("NumPy", 65), ("Pandas", 70), ("Scikit-learn", 70), ("TensorFlow", 55), ("PyTorch", 45)]},
    {"cat": "Database", "icon": "database", "items": [("MySQL", 65), ("PostgreSQL", 60), ("SQLite", 75)]},
    {"cat": "Tools", "icon": "wrench", "items": [("Git", 70), ("GitHub", 70), ("VS Code", 85), ("Jupyter Notebook", 75)]},
]
PROJECTS = [  # live / github: add real URLs. features / challenges / explanation / screenshots: fill in.
    {"id": "codered", "title": "CodeRed Inventions", "short": "Website for a software development company.",
     "tags": ["Python", "Django", "HTML", "CSS", "JavaScript"], "live": "", "github": "", "screenshots": [],
     "features": ["Add your key features here."], "challenges": ["Describe a problem you solved."],
     "explanation": "Describe the architecture, data model and your role."},
    {"id": "digital-galleria", "title": "Digital Galleria", "short": "Custom product e-commerce platform.",
     "tags": ["Django", "Python", "JavaScript", "Database"], "live": "", "github": "", "screenshots": [],
     "features": ["Add your key features here."], "challenges": ["Describe a problem you solved."],
     "explanation": "Describe the architecture, data model and your role."},
    {"id": "location-classification", "title": "Coordinate-Based Location Classification",
     "short": "Machine learning model that classifies locations from geographical coordinates.",
     "tags": ["Python", "Pandas", "Scikit-learn"], "live": "", "github": "", "screenshots": [],
     "features": ["Add your key features here."], "challenges": ["Describe a problem you solved."],
     "explanation": "Describe the dataset, model choice and evaluation."},
    {"id": "ecosort", "title": "EcoSort", "short": "AI-powered waste classification system.",
     "tags": ["Python", "CNN", "VGG16"], "live": "", "github": "", "screenshots": [],
     "features": ["Add your key features here."], "challenges": ["Describe a problem you solved."],
     "explanation": "Describe the dataset, transfer learning setup and results."},
    {"id": "water-potability", "title": "Water Potability Prediction", "short": "Machine learning project that predicts water quality.",
     "tags": ["Python", "Scikit-learn", "Pandas"], "live": "", "github": "", "screenshots": [],
     "features": ["Add your key features here."], "challenges": ["Describe a problem you solved."],
     "explanation": "Describe the dataset, model choice and evaluation."},
]
JOURNEY = [  # period / title / text: edit each entry
    {"period": "Start", "title": "Programming fundamentals", "text": "Add when and how you began coding."},
    {"period": "Next", "title": "Python development", "text": "Scripts, data structures and problem solving in Python."},
    {"period": "Next", "title": "Django projects", "text": "Built web apps: CodeRed Inventions and Digital Galleria."},
    {"period": "Next", "title": "Machine learning", "text": "Classification projects with Scikit-learn and CNNs."},
    {"period": "Now", "title": "Full-stack development", "text": "Joining backend, frontend and ML into complete products."},
    {"period": "Goal", "title": "What I'm learning next", "text": "Add your future learning goals."},
]
SERVICES = [
    ("Custom Website Development", "monitor", "Fast, responsive sites built around your content."),
    ("Django Web Applications", "layers", "Backend-driven apps with auth, admin and APIs."),
    ("Python Automation", "terminal", "Scripts that remove repetitive work."),
    ("Machine Learning Projects", "line-chart", "Data cleaning, modelling and evaluation."),
    ("AI-Powered Applications", "sparkles", "Models wired into usable products."),
    ("Academic Project Development", "graduation-cap", "Guided, documented projects for coursework."),
]
CONTEXT = {"p": PROFILE, "about": ABOUT, "stats": STATS, "skills": SKILLS, "projects": PROJECTS, "journey": JOURNEY, "services": SERVICES}
