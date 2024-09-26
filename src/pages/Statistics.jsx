import React, { useEffect, useState } from "react";

const Statistics = () => {
  const [stats, setStats] = useState({ genderStats: [], occupationStats: [] });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Statistics</h2>

      {/* Gender Ratio */}
      <h3>Gender Ratio</h3>
      <ul>
        {stats.genderStats.map((gender) => (
          <li key={gender._id}>
            {gender._id}: {gender.count}
          </li>
        ))}
      </ul>

      {/* Occupation Distribution */}
      <h3>Occupation Distribution</h3>
      <ul>
        {stats.occupationStats.map((occupation) => (
          <li key={occupation._id}>
            {occupation._id}: {occupation.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
