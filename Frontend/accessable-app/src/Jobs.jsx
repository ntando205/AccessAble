import { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css";

function Jobs() {
  const [filter, setFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [newJob, setNewJob] = useState({ 
    title: "", 
    type: "", 
    description: "",
    company: "",
    contact: "",
    applyUrl: ""
  });

  // Function to map API job fields to component expected fields
  const mapApiJobToComponent = (apiJob) => {
    return {
      id: apiJob.id || apiJob.job_id,
      title: apiJob.title || apiJob.job_position,
      type: apiJob.type || apiJob.job_type || "General",
      description: apiJob.description || `Location: ${apiJob.job_location || 'Gauteng'} | Posted: ${apiJob.job_posting_date || 'Recent'}`,
      company: apiJob.company || apiJob.company_name,
      contact: apiJob.contact || "Contact via application",
      applyUrl: apiJob.applyUrl || apiJob.job_link
    };
  };

  // Function to map component job fields to API expected fields
  const mapComponentJobToApi = (componentJob) => {
    return {
      // Required fields from JobListing model
      job_position: componentJob.title,
      job_link: componentJob.applyUrl,
      company_name: componentJob.company,
      company_profile: componentJob.applyUrl, // Use applyUrl as company_profile
      job_location: "Gauteng, South Africa",
      job_posting_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
      
      // Optional fields with defaults
      job_id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      company_logo_url: "",
      
      // Additional info
      contact: componentJob.contact,
      description: componentJob.description,
      job_type: componentJob.type
    };
  };

  // Fetch jobs from Django API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/jobs/");
      
      let jobsData = response.data;
      
      // Handle different API response structures
      if (response.data && typeof response.data === 'object') {
        if (response.data.results) {
          jobsData = response.data.results;
        } else if (response.data.data) {
          jobsData = response.data.data;
        }
      }
      
      if (!Array.isArray(jobsData)) {
        jobsData = [jobsData];
      }
      
      console.log("Raw API jobs data:", jobsData);
      
      // Map API job fields to component expected fields
      const mappedJobs = jobsData.map(mapApiJobToComponent);
      console.log("Mapped jobs:", mappedJobs);
      
      setJobs(mappedJobs);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
      // Fallback to sample data
      setJobs([
        { 
          id: 1,
          title: "Web Developer", 
          type: "Tech", 
          description: "Build and maintain accessible websites.",
          company: "Mediro ICT Recruitment",
          contact: "+27 12 657 0704",
          applyUrl: "https://www.pnet.co.za/jobs/junior%20web%20developer"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Save new job to Django API
  const saveJobToAPI = async (jobData) => {
    try {
      // Map component job fields to API expected fields
      const apiJobData = mapComponentJobToApi(jobData);
      console.log("Sending to API:", apiJobData);
      
      const response = await axios.post("http://127.0.0.1:8000/api/jobs/", apiJobData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("API Response:", response.data);
      
      // Map the response back to component format
      return mapApiJobToComponent(response.data);
    } catch (err) {
      console.error("Error saving job:", err);
      console.error("Error response:", err.response?.data);
      throw new Error("Failed to save job to server");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(filter.toLowerCase()) ||
      job.type?.toLowerCase().includes(filter.toLowerCase()) ||
      job.company?.toLowerCase().includes(filter.toLowerCase())
  ) : [];

  const handlePostJob = async (e) => {
    e.preventDefault();
    
    if (!newJob.title || !newJob.type || !newJob.description || !newJob.company || !newJob.contact || !newJob.applyUrl) {
      alert("Please fill in all job fields.");
      return;
    }

    try {
      setPosting(true);
      const savedJob = await saveJobToAPI(newJob);
      
      setJobs(prevJobs => Array.isArray(prevJobs) ? [...prevJobs, savedJob] : [savedJob]);
      setNewJob({ title: "", type: "", description: "", company: "", contact: "", applyUrl: "" });
      
      alert("Job posted successfully 🎉");
    } catch (err) {
      alert("Failed to post job. Please check the console for details.");
      console.error("Post job error:", err);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header-gradient">
          <h1>AccessAble Jobs</h1>
          <p className="subtitle">Find inclusive jobs designed for people with disabilities</p>
        </div>
        <div className="jobs-container">
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-gradient">
        <h1>AccessAble Jobs</h1>
        <p className="subtitle">Find inclusive jobs designed for people with disabilities</p>
      </div>

      <div className="jobs-container">
        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            color: '#c33', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {error}
            <button onClick={fetchJobs} style={{
                backgroundColor: '#c33',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
              Retry
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Search jobs by title, type, or company..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        />

        <ul>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <li key={job.id || job.title}>
                <div>
                  <strong>{job.title}</strong> <span>({job.type})</span>
                  <p>{job.description}</p>
                  <p className="company-info">
                    Company: {job.company} | Contact: {job.contact}
                  </p>
                </div>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="apply-btn">
                  Apply Here
                </a>
              </li>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              {Array.isArray(jobs) && jobs.length === 0 ? 'No jobs available.' : 'No jobs found matching your search.'}
            </p>
          )}
        </ul>

        <div className="post-job">
          <h2>Post a Job</h2>
          <form onSubmit={handlePostJob}>
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Job Type (e.g., Tech, Healthcare, Education)"
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              required
            />
            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              required
            ></textarea>
            <input
              type="text"
              placeholder="Company Name"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Company Contact Number"
              value={newJob.contact}
              onChange={(e) => setNewJob({ ...newJob, contact: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Job Application URL"
              value={newJob.applyUrl}
              onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })}
              required
            />
            <button type="submit" className="post-btn" disabled={posting}>
              {posting ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Jobs;