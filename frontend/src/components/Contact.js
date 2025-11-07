import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const Contact = ({ profile }) => {
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // In a real app, this would send to a backend
    const mailtoLink = `mailto:${profile?.email || 'contact@example.com'}?subject=Contact from ${formData.name}&body=${formData.message}%0D%0A%0D%0AFrom: ${formData.name} (${formData.email})`;
    window.location.href = mailtoLink;
    
    toast.success('Opening your email client...');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div 
      ref={contactRef}
      className="min-h-screen py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)' }}
      data-testid="contact-section"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4" data-testid="contact-heading">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg">
            Let's work together on your next project
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6" data-testid="contact-info">
            <h3 className="text-2xl font-semibold text-white mb-8">Contact Information</h3>
            
            {profile?.email && (
              <div className="card flex items-start gap-4" data-testid="contact-email-card">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-white hover:text-blue-400 transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile?.phone && (
              <div className="card flex items-start gap-4" data-testid="contact-phone-card">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Phone</p>
                  <a href={`tel:${profile.phone}`} className="text-white hover:text-purple-400 transition-colors">
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}

            {profile?.location && (
              <div className="card flex items-start gap-4" data-testid="contact-location-card">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Location</p>
                  <p className="text-white">{profile.location}</p>
                </div>
              </div>
            )}

            <div className="card mt-8" data-testid="contact-availability">
              <h4 className="text-lg font-semibold text-white mb-3">Availability</h4>
              <p className="text-gray-400">
                I'm currently available for freelance work and exciting opportunities. Feel free to reach out!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="card space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500" data-testid="contact-footer">
          <p>© {new Date().getFullYear()} {profile?.name || 'Charchit Singh Sahay'}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
