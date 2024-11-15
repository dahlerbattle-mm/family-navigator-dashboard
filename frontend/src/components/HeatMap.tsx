// src/components/Heatmap.tsx
import React from 'react';
import styles from './HeatMap.module.css';

interface HeatmapProps {
  data: number[][];
  rowLabels: string[];
  columnLabels: string[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data, rowLabels, columnLabels }) => {
  return (
    <div className={styles.heatmapContainer}>
      <table className={styles.heatmapTable}>
        <thead>
          <tr>
            <th className={styles.header}></th>
            {columnLabels.map((label, colIndex) => (
              <th key={colIndex} className={styles.header}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className={styles.header}>{rowLabels[rowIndex]}</td>
              {row.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className={styles.cell}
                  data-value={value} // Set the data-value attribute for styling
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;
