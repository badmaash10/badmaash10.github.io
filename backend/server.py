from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 1 week

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class ProjectBase(BaseModel):
    title: str
    description: str
    long_description: Optional[str] = None
    tech_stack: List[str] = []
    tags: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    status: str = "published"  # draft, published

class Project(ProjectBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExperienceBase(BaseModel):
    title: str
    company: str
    type: str  # job, internship, freelance
    description: str
    responsibilities: List[str] = []
    skills: List[str] = []
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    logo_url: Optional[str] = None
    status: str = "published"

class Experience(ExperienceBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    skills: List[str] = []

class Profile(ProfileBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ============= AUTH HELPERS =============

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ============= PUBLIC ROUTES =============

@api_router.get("/")
async def root():
    return {"message": "Charchit Singh Sahay Portfolio API"}

@api_router.get("/profile", response_model=Optional[Profile])
async def get_profile():
    profile = await db.profiles.find_one({}, {"_id": 0})
    if profile and isinstance(profile.get('updated_at'), str):
        profile['updated_at'] = datetime.fromisoformat(profile['updated_at'])
    return profile

@api_router.get("/projects", response_model=List[Project])
async def get_projects(status: str = "published"):
    query = {"status": status} if status else {}
    projects = await db.projects.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if isinstance(project.get('updated_at'), str):
            project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if isinstance(project.get('created_at'), str):
        project['created_at'] = datetime.fromisoformat(project['created_at'])
    if isinstance(project.get('updated_at'), str):
        project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    return project

@api_router.get("/experiences", response_model=List[Experience])
async def get_experiences(status: str = "published"):
    query = {"status": status} if status else {}
    experiences = await db.experiences.find(query, {"_id": 0}).sort("start_date", -1).to_list(100)
    for exp in experiences:
        if isinstance(exp.get('created_at'), str):
            exp['created_at'] = datetime.fromisoformat(exp['created_at'])
        if isinstance(exp.get('updated_at'), str):
            exp['updated_at'] = datetime.fromisoformat(exp['updated_at'])
    return experiences

# ============= AUTH ROUTES =============

@api_router.post("/admin/login", response_model=Token)
async def admin_login(login_data: AdminLogin):
    # Check credentials - for demo, using simple check. In production, use hashed passwords
    admin = await db.admins.find_one({"username": login_data.username})
    
    if not admin:
        # Create default admin if doesn't exist (first time setup)
        if login_data.username == "admin" and login_data.password == "admin123":
            hashed_password = pwd_context.hash("admin123")
            await db.admins.insert_one({
                "username": "admin",
                "password": hashed_password
            })
            access_token = create_access_token(data={"sub": login_data.username})
            return {"access_token": access_token, "token_type": "bearer"}
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(login_data.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": login_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

# ============= ADMIN ROUTES =============

# Projects
@api_router.post("/admin/projects", response_model=Project)
async def create_project(project: ProjectBase, admin: str = Depends(get_current_admin)):
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.projects.insert_one(doc)
    return project_obj

@api_router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectBase, admin: str = Depends(get_current_admin)):
    existing = await db.projects.find_one({"id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    update_data['id'] = project_id
    update_data['created_at'] = existing.get('created_at')
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    
    result = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if isinstance(result.get('created_at'), str):
        result['created_at'] = datetime.fromisoformat(result['created_at'])
    if isinstance(result.get('updated_at'), str):
        result['updated_at'] = datetime.fromisoformat(result['updated_at'])
    return result

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, admin: str = Depends(get_current_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Experiences
@api_router.post("/admin/experiences", response_model=Experience)
async def create_experience(experience: ExperienceBase, admin: str = Depends(get_current_admin)):
    exp_obj = Experience(**experience.model_dump())
    doc = exp_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.experiences.insert_one(doc)
    return exp_obj

@api_router.put("/admin/experiences/{exp_id}", response_model=Experience)
async def update_experience(exp_id: str, experience: ExperienceBase, admin: str = Depends(get_current_admin)):
    existing = await db.experiences.find_one({"id": exp_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    update_data = experience.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    update_data['id'] = exp_id
    update_data['created_at'] = existing.get('created_at')
    
    await db.experiences.update_one({"id": exp_id}, {"$set": update_data})
    
    result = await db.experiences.find_one({"id": exp_id}, {"_id": 0})
    if isinstance(result.get('created_at'), str):
        result['created_at'] = datetime.fromisoformat(result['created_at'])
    if isinstance(result.get('updated_at'), str):
        result['updated_at'] = datetime.fromisoformat(result['updated_at'])
    return result

@api_router.delete("/admin/experiences/{exp_id}")
async def delete_experience(exp_id: str, admin: str = Depends(get_current_admin)):
    result = await db.experiences.delete_one({"id": exp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}

# Profile
@api_router.put("/admin/profile", response_model=Profile)
async def update_profile(profile: ProfileBase, admin: str = Depends(get_current_admin)):
    existing = await db.profiles.find_one({})
    
    profile_obj = Profile(**profile.model_dump())
    doc = profile_obj.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    if existing:
        doc['id'] = existing.get('id', doc['id'])
        await db.profiles.update_one({}, {"$set": doc})
    else:
        await db.profiles.insert_one(doc)
    
    result = await db.profiles.find_one({}, {"_id": 0})
    if isinstance(result.get('updated_at'), str):
        result['updated_at'] = datetime.fromisoformat(result['updated_at'])
    return result

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
