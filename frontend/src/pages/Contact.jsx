import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do I cancel a ticket reservation?',
    a: 'Simply log in to your account and go to the "My Bookings" tab. Under Active Bookings, click "Cancel Reservation". Your tickets are immediately released back to the event pool.'
  },
  {
    q: 'Do I get an instant confirmation?',
    a: 'Yes! All bookings are processed through atomic database transactions. Once confirmed, you can instantly see your ticket on your dashboard with complete event date, time, and venue details.'
  },
  {
    q: 'Can I book multiple tickets for friends or family?',
    a: 'Yes, in the booking modal you can select any quantity from 1 up to the total available seats remaining for that event.'
  },
  {
    q: 'How can I host or list an event on CommuniVibe?',
    a: 'We welcome community leaders and event organizers! Fill out the contact form below with the subject "Organizer Inquiry", and our team will get in touch within 24 hours.'
  }
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-header">
        <div className="container text-center">
          <span className="badge badge-primary">
            <MessageSquare size={14} style={{ marginRight: '6px' }} />
            We're Here For You
          </span>
          <h1 className="section-title" style={{ marginTop: '0.75rem', fontSize: '2.5rem' }}>
            Get in Touch With Our Team
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Have questions about an upcoming event, your ticket reservations, or partnering with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-layout-grid">
            
            {/* Left: Contact Info Cards */}
            <div className="contact-info-column">
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                <p className="contact-info-intro">
                  Reach out to us directly or drop by our local community office during working hours.
                </p>

                <div className="contact-details-list">
                  <div className="contact-detail-item">
                    <div className="contact-icon-box">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="contact-detail-label">Email Support</span>
                      <a href="mailto:support@communivibe.org" className="contact-detail-val">
                        support@communivibe.org
                      </a>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-box">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="contact-detail-label">Phone Hotline</span>
                      <a href="tel:+15553892849" className="contact-detail-val">
                        +1 (555) 389-2849
                      </a>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-box">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="contact-detail-label">Headquarters</span>
                      <span className="contact-detail-val">
                        Innovation Hub, 4th Floor, Tech Boulevard
                      </span>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-box">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="contact-detail-label">Operating Hours</span>
                      <span className="contact-detail-val">
                        Mon – Fri: 9:00 AM – 6:00 PM EST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="faq-card-box">
                <div className="faq-header-inline">
                  <HelpCircle size={20} style={{ color: '#2563eb' }} />
                  <h4>Frequently Asked Questions</h4>
                </div>

                <div className="faq-accordion-list">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="faq-accordion-item">
                      <button 
                        type="button" 
                        className="faq-question-btn" 
                        onClick={() => toggleFaq(idx)}
                      >
                        <span>{faq.q}</span>
                        {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {openFaq === idx && (
                        <div className="faq-answer-content">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-column">
              <div className="contact-form-card">
                <h3>Send Us a Message</h3>
                <p className="contact-form-subtitle">
                  Fill out the form below and a representative will reply within a few hours.
                </p>

                {submitted && (
                  <div className="contact-success-alert">
                    <CheckCircle size={22} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <div>
                      <h4>Message Sent Successfully!</h4>
                      <p>Thank you for reaching out. Our support team will get back to you shortly.</p>
                      <button 
                        type="button" 
                        onClick={() => setSubmitted(false)}
                        className="btn btn-sm btn-outline"
                        style={{ marginTop: '0.5rem' }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                )}

                {!submitted && (
                  <form onSubmit={handleSubmit} className="contact-actual-form">
                    <div className="form-group">
                      <label htmlFor="name">Your Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Sarah Connor"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. sarah@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. Question regarding booking #104"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Write your question or feedback in detail..."
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
