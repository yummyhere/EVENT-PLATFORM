import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ShieldCheck, Zap, HeartHandshake, Award, ArrowRight, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="badge badge-primary">
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              Connecting Communities Everywhere
            </span>
            <h1 className="about-title">Empowering People to Discover, Connect & Celebrate Together</h1>
            <p className="about-subtitle">
              CommuniVibe was born with a single mission: to remove friction from local community gatherings.
              From cutting-edge tech summits and acoustic concerts to neighborhood charity drives and wellness workshops,
              we bring communities to life.
            </p>
            <div className="about-hero-actions">
              <Link to="/events" className="btn btn-primary btn-lg">
                Explore Live Events <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn btn-outline btn-lg">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Transparent Pricing</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">12+</span>
              <span className="stat-label">Curated Experiences</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Community Members</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Instant Booking Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">What Drives CommuniVibe</h2>
            <p className="section-subtitle">
              Built on trust, speed, and real human connection. Here is how we ensure every event is memorable.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box bg-blue">
                <Users size={28} />
              </div>
              <h3>Community First</h3>
              <p>Every gathering is curated to foster genuine relationships, local networking, and lifelong shared memories.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box bg-green">
                <Zap size={28} />
              </div>
              <h3>Instant Reservation</h3>
              <p>Atomic transactions and real-time seat tracking guarantee your spot without overbooking or delays.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box bg-purple">
                <ShieldCheck size={28} />
              </div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade JWT authentication and strict privacy rules keep your account and bookings safe.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box bg-orange">
                <HeartHandshake size={28} />
              </div>
              <h3>Free Cancellation</h3>
              <p>Change of plans? Easily cancel reservations anytime before the event starts and restore tickets seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="about-how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your tickets in 3 effortless steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Discover</h3>
              <p>Filter through upcoming events by category, date, or search terms to find what excites you.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Reserve Instantly</h3>
              <p>Pick your ticket quantity, review details in the live booking modal, and confirm in one click.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Manage & Attend</h3>
              <p>Access your tickets under "My Bookings", view dates and venue addresses, and enjoy the experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Ready to Join Your Next Community Event?</h2>
            <p>Explore exciting meetups, masterclasses, and gatherings happening right now.</p>
            <Link to="/events" className="btn btn-primary btn-lg" style={{ backgroundColor: '#ffffff', color: '#2563eb' }}>
              Find Events Near You <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
