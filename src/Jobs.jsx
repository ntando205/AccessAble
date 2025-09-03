import { useState } from "react";

function Jobs() {
  const [filter, setFilter] = useState("");
  const jobs = [
    { title: "Web Developer", type: "Tech" },
    { title: "Nurse", type: "Healthcare" },
    { title: "Teacher", type: "Education" }
  ];

  const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h1>Jobs</h1>
      <input 
        placeholder="Filter jobs" 
        value={filter} 
        onChange={e => setFilter(e.target.value)} 
      />
      <ul>
        {filteredJobs.map((job, idx) => (
          <li key={idx}>{job.title} ({job.type})</li>
        ))}
      </ul>
    </div>
  );
}

export default Jobs;
