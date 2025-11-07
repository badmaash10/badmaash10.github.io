import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import ExperienceLeague from '@/components/ExperienceLeague';
import BeamTransition from '@/components/BeamTransition';
import About from '@/components/About';
import Contact from '@/components/Contact';

gsap.registerPlugin(ScrollTrigger);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showBeam, setShowBeam] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Trigger beam animation on scroll past hero
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5 && !showBeam) {
        setShowBeam(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBeam]);

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, experiencesRes] = await Promise.all([
        axios.get(`${API}/profile`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/experiences`)
      ]);
      
      setProfile(profileRes.data);
      setProjects(projectsRes.data);
      setExperiences(experiencesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="noise-overlay" />
      
      <section ref={heroRef}>
        <Hero profile={profile} />
      </section>

      {showBeam && <BeamTransition />}

      <section id="experience" data-testid="experience-section">
        <ExperienceLeague experiences={experiences} />
      </section>

      <section id="projects" data-testid="projects-section">
        <Projects projects={projects} />
      </section>

      <section id="about" data-testid="about-section">
        <About profile={profile} />
      </section>

      <section id="contact" data-testid="contact-section">
        <Contact profile={profile} />
      </section>
    </div>
  );
};

export default Home;
