import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// SVG Logo Component
function Logo({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="app-logo">
      <circle cx="50" cy="50" r="45" fill="#667eea" stroke="#ff6b6b" strokeWidth="3"/>
      <circle cx="50" cy="50" r="35" fill="white"/>
      <text x="50" y="58" textAnchor="middle" fill="#667eea" fontSize="30" fontWeight="bold">A</text>
      <circle cx="70" cy="30" r="8" fill="#ff6b6b"/>
    </svg>
  )
}

// Resource Data
const resources = [
  {
    id: 1,
    title: "Accessibility Guide",
    category: "education",
    description: "Comprehensive guide to accessibility standards and best practices",
    icon: "📚",
    link: "/resources/guide"
  },
  {
    id: 2,
    title: "Job Search Toolkit",
    category: "jobs",
    description: "Resources for finding inclusive employment opportunities",
    icon: "💼",
    link: "/jobs"
  },
  {
    id: 3,
    title: "Healthcare Directory",
    category: "healthcare",
    description: "Find accessible healthcare providers in your area",
    icon: "🏥",
    link: "/healthcare"
  },
  {
    id: 4,
    title: "Community Forum",
    category: "community",
    description: "Connect with others and share experiences",
    icon: "👥",
    link: "/forum"
  },
  {
    id: 5,
    title: "Accessibility Map",
    category: "tools",
    description: "Interactive map of accessible locations",
    icon: "🗺️",
    link: "/map"
  },
  {
    id: 6,
    title: "Legal Rights Info",
    category: "education",
    description: "Understand your rights and protections",
    icon: "⚖️",
    link: "/legal"
  }
]

function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showResources, setShowResources] = useState(false)

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory)

  const categories = [
    { id: 'all', name: 'All Resources', icon: '🌟' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'jobs', name: 'Jobs', icon: '💼' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'tools', name: 'Tools', icon: '🛠️' },
    { id: 'community', name: 'Community', icon: '👥' }
  ]

  const handleExploreClick = () => {
    setShowResources(true)
    // Smooth scroll to resources section
    setTimeout(() => {
      document.getElementById('resources-section').scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 100)
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="logo-title-container">
            <Logo size={80} />
            <div className="title-text">
              <h1 className="hero-title">
                <span className="highlight">Access</span>
                <span className="highlight-secondary">Able</span>
              </h1>
              <div className="tagline">Making accessibility effortless</div>
            </div>
          </div>
          
          <p className="hero-subtitle">
            Empowering individuals with disabilities through accessible resources, 
            job opportunities, and healthcare support.
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="cta-button primary">
              Explore Accessibility Map
            </Link>
            <Link to="/jobs" className="cta-button secondary">
              Find Jobs
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            ♿
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>How We Help</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Accessibility Map</h3>
            <p>Find accessible locations, venues, and facilities in your area with our detailed map.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Job Opportunities</h3>
            <p>Discover inclusive employers and job opportunities tailored for people with disabilities.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Healthcare Resources</h3>
            <p>Access healthcare services, support groups, and medical resources in your community.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Explore our comprehensive resources and start your accessibility journey today.</p>
        <div className="cta-buttons">
          <button onClick={handleExploreClick} className="cta-button large">
            Explore Our Resources
          </button>
        </div>
      </section>

      {/* Interactive Resources Section */}
      {showResources && (
        <section id="resources-section" className="resources-section">
          <div className="resources-container">
            <h2>Explore Resources</h2>
            <p className="resources-subtitle">Filter by category to find exactly what you need</p>
            
            {/* Category Filters */}
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-icon">{resource.icon}</div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <Link to={resource.link} className="resource-link">
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>

            {/* Quick Navigation */}
            <div className="quick-nav">
              <h3>Quick Access</h3>
              <div className="quick-nav-buttons">
                <Link to="/map" className="quick-nav-btn">
                  <span>🗺️</span>
                  Accessibility Map
                </Link>
                <Link to="/jobs" className="quick-nav-btn">
                  <span>💼</span>
                  Job Search
                </Link>
                <Link to="/healthcare" className="quick-nav-btn">
                  <span>🏥</span>
                  Healthcare
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
