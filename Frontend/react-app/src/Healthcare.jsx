import { useState } from "react";

function Healthcare() {
  const [search, setSearch] = useState("");
  const facilities = [
    { name: "Clinic A" },
    { name: "Hospital B" },
    { name: "Pharmacy C" }
  ];

  const results = facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1>Healthcare Facilities</h1>
      <input 
        placeholder="Search facilities" 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
      />
      <ul>
        {results.map((f, idx) => (
          <li key={idx}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Healthcare;
