import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Edit, Trash2, Eye } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  tech_stack: z.string().optional(),
  tags: z.string().optional(),
  github_url: z.string().optional(),
  live_url: z.string().optional(),
  image_url: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.string().optional()
});

const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.string().optional(),
  skills: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  current: z.boolean().optional(),
  logo_url: z.string().optional(),
  status: z.string().optional()
});

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, [token]);

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${API}/admin/login`, data);
      const newToken = response.data.access_token;
      setToken(newToken);
      localStorage.setItem('admin_token', newToken);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const fetchAdminData = async () => {
    try {
      const [projectsRes, experiencesRes, profileRes] = await Promise.all([
        axios.get(`${API}/projects?status=all`),
        axios.get(`${API}/experiences?status=all`),
        axios.get(`${API}/profile`)
      ]);
      
      setProjects(projectsRes.data);
      setExperiences(experiencesRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API}/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project deleted');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const deleteExperience = async (id) => {
    try {
      await axios.delete(`${API}/admin/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Experience deleted');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' }}>
        <Card className="w-full max-w-md glass border-blue-500/20" data-testid="login-card">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  {...loginForm.register('username')}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  data-testid="login-username"
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  data-testid="login-password"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full btn-primary" data-testid="login-submit">
                Login
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">Default: admin / admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="logout-btn">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="glass border-white/10 mb-6" data-testid="admin-tabs">
            <TabsTrigger value="projects" data-testid="tab-projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="experiences" data-testid="tab-experiences">Experiences ({experiences.length})</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Manage Projects</h2>
                <ProjectDialog token={token} onSuccess={fetchAdminData} />
              </div>
              <div className="grid gap-4">
                {projects.map(project => (
                  <Card key={project.id} className="glass border-white/10" data-testid={`project-card-${project.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <CardDescription className="text-gray-400">{project.description}</CardDescription>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                            {project.featured && <Badge variant="outline" className="border-yellow-500 text-yellow-500">Featured</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ProjectDialog token={token} project={project} onSuccess={fetchAdminData} />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProject(project.id)}
                            data-testid={`delete-project-${project.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No projects yet. Create your first one!</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experiences">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Manage Experiences</h2>
                <ExperienceDialog token={token} onSuccess={fetchAdminData} />
              </div>
              <div className="grid gap-4">
                {experiences.map(exp => (
                  <Card key={exp.id} className="glass border-white/10" data-testid={`experience-card-${exp.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{exp.title}</CardTitle>
                          <CardDescription className="text-gray-400">{exp.company} • {exp.type}</CardDescription>
                          <p className="text-sm text-gray-500 mt-1">
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                          </p>
                          <Badge variant={exp.status === 'published' ? 'default' : 'secondary'} className="mt-2">
                            {exp.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <ExperienceDialog token={token} experience={exp} onSuccess={fetchAdminData} />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteExperience(exp.id)}
                            data-testid={`delete-experience-${exp.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                {experiences.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No experiences yet. Add your first one!</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm token={token} profile={profile} onSuccess={fetchAdminData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ProjectDialog = ({ token, project, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      title: '',
      description: '',
      long_description: '',
      tech_stack: '',
      tags: '',
      github_url: '',
      live_url: '',
      image_url: '',
      featured: false,
      status: 'draft'
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        tech_stack: data.tech_stack ? data.tech_stack.split(',').map(s => s.trim()) : [],
        tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
        featured: data.featured || false
      };

      if (project) {
        await axios.put(`${API}/admin/projects/${project.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Project updated');
      } else {
        await axios.post(`${API}/admin/projects`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Project created');
      }
      
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="btn-primary" data-testid={project ? `edit-project-${project.id}` : 'add-project-btn'}>
          {project ? <Edit className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Project</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="project-dialog">
        <DialogHeader>
          <DialogTitle className="text-white">{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
          <DialogDescription className="text-gray-400">Fill in the project details below</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title *</Label>
            <Input id="title" {...form.register('title')} className="bg-white/5 border-white/10 text-white" data-testid="project-title" />
            {form.formState.errors.title && <p className="text-red-400 text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">Short Description *</Label>
            <Textarea id="description" {...form.register('description')} className="bg-white/5 border-white/10 text-white" data-testid="project-description" />
            {form.formState.errors.description && <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="long_description" className="text-gray-300">Long Description</Label>
            <Textarea id="long_description" {...form.register('long_description')} className="bg-white/5 border-white/10 text-white" rows={4} data-testid="project-long-description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tech_stack" className="text-gray-300">Tech Stack (comma separated)</Label>
              <Input id="tech_stack" {...form.register('tech_stack')} placeholder="React, Node.js, MongoDB" className="bg-white/5 border-white/10 text-white" data-testid="project-tech-stack" />
            </div>
            <div>
              <Label htmlFor="tags" className="text-gray-300">Tags (comma separated)</Label>
              <Input id="tags" {...form.register('tags')} placeholder="web, fullstack, saas" className="bg-white/5 border-white/10 text-white" data-testid="project-tags" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
              <Input id="github_url" {...form.register('github_url')} className="bg-white/5 border-white/10 text-white" data-testid="project-github" />
            </div>
            <div>
              <Label htmlFor="live_url" className="text-gray-300">Live URL</Label>
              <Input id="live_url" {...form.register('live_url')} className="bg-white/5 border-white/10 text-white" data-testid="project-live-url" />
            </div>
          </div>
          <div>
            <Label htmlFor="image_url" className="text-gray-300">Image URL</Label>
            <Input id="image_url" {...form.register('image_url')} className="bg-white/5 border-white/10 text-white" data-testid="project-image-url" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="featured" {...form.register('featured')} className="h-4 w-4" data-testid="project-featured" />
              <Label htmlFor="featured" className="text-gray-300">Featured</Label>
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select onValueChange={(value) => form.setValue('status', value)} defaultValue={project?.status || 'draft'}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full btn-primary" data-testid="project-submit">
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ExperienceDialog = ({ token, experience, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience || {
      title: '',
      company: '',
      type: 'job',
      description: '',
      responsibilities: '',
      skills: '',
      start_date: '',
      end_date: '',
      current: false,
      logo_url: '',
      status: 'draft'
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        responsibilities: data.responsibilities ? data.responsibilities.split(',').map(s => s.trim()) : [],
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        current: data.current || false
      };

      if (experience) {
        await axios.put(`${API}/admin/experiences/${experience.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Experience updated');
      } else {
        await axios.post(`${API}/admin/experiences`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Experience created');
      }
      
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="btn-primary" data-testid={experience ? `edit-experience-${experience.id}` : 'add-experience-btn'}>
          {experience ? <Edit className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Experience</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="experience-dialog">
        <DialogHeader>
          <DialogTitle className="text-white">{experience ? 'Edit Experience' : 'Create Experience'}</DialogTitle>
          <DialogDescription className="text-gray-400">Fill in the experience details below</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="exp-title" className="text-gray-300">Title *</Label>
            <Input id="exp-title" {...form.register('title')} className="bg-white/5 border-white/10 text-white" data-testid="experience-title" />
            {form.formState.errors.title && <p className="text-red-400 text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-gray-300">Company *</Label>
              <Input id="company" {...form.register('company')} className="bg-white/5 border-white/10 text-white" data-testid="experience-company" />
              {form.formState.errors.company && <p className="text-red-400 text-sm">{form.formState.errors.company.message}</p>}
            </div>
            <div>
              <Label htmlFor="type" className="text-gray-300">Type *</Label>
              <Select onValueChange={(value) => form.setValue('type', value)} defaultValue={experience?.type || 'job'}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="experience-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="exp-description" className="text-gray-300">Description *</Label>
            <Textarea id="exp-description" {...form.register('description')} className="bg-white/5 border-white/10 text-white" data-testid="experience-description" />
            {form.formState.errors.description && <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="responsibilities" className="text-gray-300">Responsibilities (comma separated)</Label>
            <Textarea id="responsibilities" {...form.register('responsibilities')} className="bg-white/5 border-white/10 text-white" data-testid="experience-responsibilities" />
          </div>
          <div>
            <Label htmlFor="skills" className="text-gray-300">Skills (comma separated)</Label>
            <Input id="skills" {...form.register('skills')} placeholder="JavaScript, React, Node.js" className="bg-white/5 border-white/10 text-white" data-testid="experience-skills" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-gray-300">Start Date *</Label>
              <Input id="start_date" {...form.register('start_date')} placeholder="Jan 2023" className="bg-white/5 border-white/10 text-white" data-testid="experience-start-date" />
              {form.formState.errors.start_date && <p className="text-red-400 text-sm">{form.formState.errors.start_date.message}</p>}
            </div>
            <div>
              <Label htmlFor="end_date" className="text-gray-300">End Date</Label>
              <Input id="end_date" {...form.register('end_date')} placeholder="Dec 2023" className="bg-white/5 border-white/10 text-white" data-testid="experience-end-date" />
            </div>
          </div>
          <div>
            <Label htmlFor="logo_url" className="text-gray-300">Company Logo URL</Label>
            <Input id="logo_url" {...form.register('logo_url')} className="bg-white/5 border-white/10 text-white" data-testid="experience-logo-url" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="current" {...form.register('current')} className="h-4 w-4" data-testid="experience-current" />
              <Label htmlFor="current" className="text-gray-300">Currently Working</Label>
            </div>
            <div>
              <Label htmlFor="exp-status" className="text-gray-300">Status</Label>
              <Select onValueChange={(value) => form.setValue('status', value)} defaultValue={experience?.status || 'draft'}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="experience-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full btn-primary" data-testid="experience-submit">
            {experience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProfileForm = ({ token, profile, onSuccess }) => {
  const form = useForm({
    defaultValues: profile || {
      name: 'Charchit Singh Sahay',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      avatar_url: '',
      resume_url: '',
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
      skills: ''
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        ...profile,
        skills: profile.skills ? profile.skills.join(', ') : ''
      });
    }
  }, [profile]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : []
      };

      await axios.put(`${API}/admin/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  return (
    <Card className="glass border-white/10" data-testid="profile-form">
      <CardHeader>
        <CardTitle className="text-white">Edit Profile</CardTitle>
        <CardDescription className="text-gray-400">Update your portfolio profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input id="name" {...form.register('name')} className="bg-white/5 border-white/10 text-white" data-testid="profile-name" />
            </div>
            <div>
              <Label htmlFor="prof-title" className="text-gray-300">Title</Label>
              <Input id="prof-title" {...form.register('title')} placeholder="Full Stack Developer" className="bg-white/5 border-white/10 text-white" data-testid="profile-title" />
            </div>
          </div>
          <div>
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <Textarea id="bio" {...form.register('bio')} rows={4} className="bg-white/5 border-white/10 text-white" data-testid="profile-bio" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" {...form.register('email')} className="bg-white/5 border-white/10 text-white" data-testid="profile-email" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input id="phone" {...form.register('phone')} className="bg-white/5 border-white/10 text-white" data-testid="profile-phone" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input id="location" {...form.register('location')} className="bg-white/5 border-white/10 text-white" data-testid="profile-location" />
            </div>
            <div>
              <Label htmlFor="avatar_url" className="text-gray-300">Avatar URL</Label>
              <Input id="avatar_url" {...form.register('avatar_url')} className="bg-white/5 border-white/10 text-white" data-testid="profile-avatar" />
            </div>
          </div>
          <div>
            <Label htmlFor="resume_url" className="text-gray-300">Resume URL</Label>
            <Input id="resume_url" {...form.register('resume_url')} className="bg-white/5 border-white/10 text-white" data-testid="profile-resume" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github" className="text-gray-300">GitHub</Label>
              <Input id="github" {...form.register('github')} placeholder="https://github.com/username" className="bg-white/5 border-white/10 text-white" data-testid="profile-github" />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
              <Input id="linkedin" {...form.register('linkedin')} className="bg-white/5 border-white/10 text-white" data-testid="profile-linkedin" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
              <Input id="twitter" {...form.register('twitter')} className="bg-white/5 border-white/10 text-white" data-testid="profile-twitter" />
            </div>
            <div>
              <Label htmlFor="website" className="text-gray-300">Website</Label>
              <Input id="website" {...form.register('website')} className="bg-white/5 border-white/10 text-white" data-testid="profile-website" />
            </div>
          </div>
          <div>
            <Label htmlFor="prof-skills" className="text-gray-300">Skills (comma separated)</Label>
            <Textarea id="prof-skills" {...form.register('skills')} placeholder="JavaScript, React, Node.js, Python" className="bg-white/5 border-white/10 text-white" data-testid="profile-skills" />
          </div>
          <Button type="submit" className="w-full btn-primary" data-testid="profile-submit">
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Admin;
