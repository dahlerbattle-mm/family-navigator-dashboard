import React, { useEffect, useState } from 'react';
import styles from './ConstituenciesChart.module.css';

type Constituency = {
  name: string;
  abbreviation: string;
  definition: string;
  numOfMembers: number;
};

const ConstituenciesChart: React.FC = () => {
  const [data, setData] = useState<Constituency[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(0);

  // API call to fetch constituency data
  useEffect(() => {
    const fetchConstituencyData = async () => {
      try {
        const response = await fetch('/api/constituencies'); // Replace with your API endpoint
        const result: Constituency[] = await response.json();
        setData(result);

        // Calculate total members
        const total = result.reduce((sum, constituency) => sum + constituency.numOfMembers, 0);
        setTotalMembers(total);
      } catch (error) {
        console.error('Error fetching constituency data:', error);
      }
    };

    fetchConstituencyData();
  }, []);

  return (
    <div className={styles.constituenciesChart}>
      <h2>Constituencies Chart</h2>
      <table className={styles.constituenciesTable}>
        <thead>
          <tr>
            <th>Constituency</th>
            <th>Abbreviation</th>
            <th>Definition</th>
            <th># of Members</th>
          </tr>
        </thead>
        <tbody>
          {data.map((constituency, index) => (
            <tr key={index}>
              <td>{constituency.name}</td>
              <td>{constituency.abbreviation}</td>
              <td>{constituency.definition}</td>
              <td>{constituency.numOfMembers}</td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td colSpan={3}><strong>Total</strong></td>
            <td><strong>{totalMembers}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConstituenciesChart;
