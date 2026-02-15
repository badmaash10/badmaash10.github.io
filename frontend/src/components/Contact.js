import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Github, Linkedin, ArrowUp, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = ({ profile }) => {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.contact-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.contact-header', start: 'top 85%' } }
            );

            gsap.utils.toArray('.contact-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 90%' },
                    }
                );
            });

            gsap.fromTo(
                '.contact-form-wrap',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 85%' } }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
        const body = encodeURIComponent(
            `Hi Charchit,\n\n${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`
        );
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
        setFormData({ name: '', email: '', message: '' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section id="contact" ref={sectionRef} className="section" style={{ paddingBottom: 40 }}>
            <div className="section-inner">
                <div className="section-header contact-header">
                    <h2>
                        Let's <span className="gradient-text">Connect</span>
                    </h2>
                    <p>Have an opportunity, project idea, or just want to chat? I'd love to hear from you.</p>
                </div>

                {/* Contact Info Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 20,
                        marginBottom: 48,
                    }}
                >
                    <ContactInfoCard
                        icon={<Mail size={24} />}
                        title="Email"
                        value={profile.email}
                        href={`mailto:${profile.email}`}
                        color="#3b82f6"
                    />
                    <ContactInfoCard
                        icon={<Phone size={24} />}
                        title="Phone"
                        value={profile.phone}
                        href={`tel:${profile.phone}`}
                        color="#8b5cf6"
                    />
                    <ContactInfoCard
                        icon={<MapPin size={24} />}
                        title="Location"
                        value={profile.location}
                        color="#06b6d4"
                    />
                </div>

                {/* Contact Form */}
                <div
                    className="contact-form-wrap"
                    style={{
                        maxWidth: 640,
                        margin: '0 auto',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="card" style={{ padding: 32, cursor: 'default' }}>
                            <h3
                                style={{
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    marginBottom: 24,
                                    textAlign: 'center',
                                }}
                            >
                                Send a Message
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 20px rgba(59,130,246,0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 20px rgba(59,130,246,0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <textarea
                                    placeholder="Your Message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 20px rgba(59,130,246,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <footer
                    style={{
                        marginTop: 80,
                        paddingTop: 32,
                        borderTop: '1px solid var(--border-subtle)',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 16,
                            marginBottom: 24,
                        }}
                    >
                        {profile.github && (
                            <FooterLink href={profile.github}>
                                <Github size={20} />
                            </FooterLink>
                        )}
                        {profile.linkedin && (
                            <FooterLink href={profile.linkedin}>
                                <Linkedin size={20} />
                            </FooterLink>
                        )}
                        {profile.email && (
                            <FooterLink href={`mailto:${profile.email}`}>
                                <Mail size={20} />
                            </FooterLink>
                        )}
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                        Built with <Heart size={14} style={{ display: 'inline', color: '#ec4899', verticalAlign: 'middle' }} /> by{' '}
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{profile.name}</span>
                    </p>

                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        © {new Date().getFullYear()} All rights reserved.
                    </p>

                    {/* Scroll to Top */}
                    <button
                        onClick={scrollToTop}
                        style={{
                            marginTop: 24,
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <ArrowUp size={20} />
                    </button>
                </footer>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
};

const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'all 0.3s ease',
};

const ContactInfoCard = ({ icon, title, value, href, color }) => (
    <a
        href={href || '#'}
        className="card contact-card"
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            textDecoration: 'none',
            cursor: href ? 'pointer' : 'default',
        }}
    >
        <div
            style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${color}12`,
                border: `1px solid ${color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
            }}
        >
            {icon}
        </div>
        <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </a>
);

const FooterLink = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
            transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        {children}
    </a>
);

export default Contact;
