import { useState } from "react";
import "./Jobs.css";

function Jobs() {
  const [filter, setFilter] = useState("");
  const [jobs, setJobs] = useState([
    { 
    title: "Web Developer", 
    type: "Tech", 
    description: "Build and maintain accessible websites.",
    company: "Tech4All",
    contact: "+1234567890",
    applyUrl: "https://tech4all.com/apply"
  },
  { 
    title: "Nurse", 
    type: "Healthcare", 
    description: "Assist patients with daily care and medical needs.",
    company: "HealthCare Co.",
    contact: "+1987654321",
    applyUrl: "https://healthcareco.com/apply"
  },
  { 
    title: "Teacher", 
    type: "Education", 
    description: "Teach inclusive classes for students with diverse needs.",
    company: "Inclusive Academy",
    contact: "+1122334455",
    applyUrl: "https://inclusiveacademy.com/apply"
  }
  ]);

  const [newJob, setNewJob] = useState({ 
    title: "", 
    type: "", 
    description: "",
    company: "",
    contact: "",
    applyUrl: ""
  });

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.type.toLowerCase().includes(filter.toLowerCase()) ||
      job.company.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.type || !newJob.description || !newJob.company || !newJob.contact || !newJob.applyUrl) {
      alert("Please fill in all job fields.");
      return;
    }
    setJobs([...jobs, newJob]);
    setNewJob({ title: "", type: "", description: "", company: "", contact: "", applyUrl: "" });
    alert("Job posted successfully 🎉");
  };

  return (
    <div className="jobs-container">
      <h1>AccessAble Jobs</h1>
      <p className="subtitle">Find inclusive jobs designed for people with disabilities</p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search jobs by title, type, or company..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Job Listings */}
      <ul>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, idx) => (
            <li key={idx}>
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
          <p className="no-results">No jobs found matching your search.</p>
        )}
      </ul>

      {/* Job Posting Form for Companies */}
      <div className="post-job">
        <h2>Post a Job</h2>
        <form onSubmit={handlePostJob}>
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Job Type"
            value={newJob.type}
            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
          />
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          ></textarea>
          <input
            type="text"
            placeholder="Company Name"
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company Contact Number"
            value={newJob.contact}
            onChange={(e) => setNewJob({ ...newJob, contact: e.target.value })}
          />
          <input
            type="text"
            placeholder="Job Application URL"
            value={newJob.applyUrl}
            onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })}
          />
          <button type="submit" className="post-btn">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default Jobs;