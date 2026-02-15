import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import { profile, projects, experiences } from './data/portfolioData';

function App() {
  return (
    <div className="App">
      <div className="noise-overlay" />
      <Navbar />
      <Hero profile={profile} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <About profile={profile} />
      <Contact profile={profile} />
    </div>
  );
}

export default App;
