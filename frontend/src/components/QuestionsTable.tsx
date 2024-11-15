import React from "react";
import styles from "./QuestionsTable.module.css"; // Import the CSS module

// Types for data
type DistributionData = {
  group: string;
  value: number; // Represents the percentage or size for the bar
};

type QuestionData = {
  question: string;
  average: number;
  distributions: DistributionData[]; // Array of distribution for different groups
};

interface QuestionsTableProps {
  data: QuestionData[];
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ data }) => {
  return (
    <div className={styles.questionsTable}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Question</th>
            <th className={styles.tableHeader}>Average</th>
            <th className={styles.tableHeader}>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {data.map((questionData, index) => (
            <tr key={index}>
              <td className={styles.tableCell}>{questionData.question}</td>
              <td className={styles.tableCell}>{questionData.average.toFixed(2)}</td>
              <td className={styles.tableCell}>
                <div className={styles.distributionBars}>
                  {questionData.distributions.map((distribution, distIndex) => (
                    <div
                      key={distIndex}
                      className={styles.bar}
                      style={{
                        width: `${distribution.value * 10}px`,
                        backgroundColor: "orange",
                      }}
                      title={`${distribution.group}: ${distribution.value}`}
                    ></div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;
