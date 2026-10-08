import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Music, 
  Utensils, 
  HeartPulse, 
  HandHeart, 
  Briefcase, 
  ArrowRight, 
  Sparkles,
  Compass
} from 'lucide-react';

const CATEGORIES_DATA = [
  {
    id: 'technology',
    name: 'Technology',
    slug: 'Technology',
    icon: Laptop,
    color: '#2563eb',
    bgColor: '#eff6ff',
    badge: 'Popular',
    description: 'Hackathons, Web3 summits, AI keynotes, and developer workshops shaping the digital future.',
    highlights: ['AI & Machine Learning', 'Web3 & Cloud', 'Dev Masterclasses']
  },
  {
    id: 'music',
    name: 'Music & Concerts',
    slug: 'Music',
    icon: Music,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    badge: 'Trending',
    description: 'Live acoustic evenings, jazz festivals, indie performances, and energetic outdoor shows.',
    highlights: ['Acoustic Sessions', 'Indie & Rock', 'Jazz Festivals']
  },
  {
    id: 'food',
    name: 'Food & Culinary',
    slug: 'Food',
    icon: Utensils,
    color: '#f97316',
    bgColor: '#fff7ed',
    badge: 'Delicious',
    description: 'Artisanal bake sales, street food carnivals, wine tastings, and chef-led masterclasses.',
    highlights: ['Street Food Galas', 'Artisan Bakery', 'Chef Workshops']
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    slug: 'Health',
    icon: HeartPulse,
    color: '#10b981',
    bgColor: '#ecfdf5',
    badge: 'Refreshed',
    description: 'Morning yoga, mindfulness sessions, 5K charity runs, and holistic living workshops.',
    highlights: ['Sunrise Yoga', 'Marathons & 5K', 'Mindfulness Seminars']
  },
  {
    id: 'charity',
    name: 'Charity & Community',
    slug: 'Charity',
    icon: HandHeart,
    color: '#ec4899',
    bgColor: '#fdf2f8',
    badge: 'Inspiring',
    description: 'Beach cleanup drives, book fundraisers, blood donation camps, and non-profit galas.',
    highlights: ['Beach Cleanups', 'Fundraising Galas', 'Volunteer Drives']
  },
  {
    id: 'business',
    name: 'Business & Networking',
    slug: 'Business',
    icon: Briefcase,
    color: '#0284c7',
    bgColor: '#f0f9ff',
    badge: 'Professional',
    description: 'Startup pitch sessions, investor roundtables, leadership summits, and career meetups.',
    highlights: ['Pitch Competitions', 'Angel Investor Mixers', 'Executive Panels']
  }
];

export const Categories = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (categorySlug) => {
    navigate(`/events?category=${encodeURIComponent(categorySlug)}`);
  };

  return (
    <div className="categories-page">
      {/* Header */}
      <section className="categories-header">
        <div className="container text-center">
          <span className="badge badge-primary">
            <Compass size={14} style={{ marginRight: '6px' }} />
            Browse by Passion
          </span>
          <h1 className="section-title" style={{ marginTop: '0.75rem', fontSize: '2.5rem' }}>
            Explore All Event Categories
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto 1.5rem' }}>
            Find gatherings that ignite your interests. Click on any category below to instantly filter all upcoming events.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-grid-section">
        <div className="container">
          <div className="categories-cards-grid">
            {CATEGORIES_DATA.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className="category-showcase-card"
                  onClick={() => handleSelectCategory(cat.slug)}
                >
                  <div className="category-card-top">
                    <div 
                      className="category-icon-wrapper" 
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <IconComponent size={28} />
                    </div>
                    <span 
                      className="category-tag-badge"
                      style={{ backgroundColor: cat.bgColor, color: cat.color, borderColor: cat.color }}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="category-card-name">{cat.name}</h3>
                  <p className="category-card-desc">{cat.description}</p>

                  <div className="category-highlights">
                    {cat.highlights.map((highlight, idx) => (
                      <span key={idx} className="category-highlight-pill">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="category-card-footer">
                    <span className="view-events-text" style={{ color: cat.color }}>
                      Browse {cat.slug} Events
                    </span>
                    <div className="arrow-circle-btn" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Search Tip */}
      <section className="category-quick-banner">
        <div className="container">
          <div className="category-banner-box">
            <Sparkles size={24} style={{ color: '#2563eb' }} />
            <div>
              <h4>Looking for something specific?</h4>
              <p>You can search by keyword, filter by specific dates, or toggle only upcoming events on our main catalog.</p>
            </div>
            <button 
              onClick={() => navigate('/events')} 
              className="btn btn-primary"
              style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
            >
              Open Event Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
