import React from "react";
import "./QuestionsTable.css"; // Import the integrated CSS file

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
    <div className="questions-table">
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Average</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {data.map((questionData, index) => (
            <tr key={index}>
              <td>{questionData.question}</td>
              <td>{questionData.average.toFixed(2)}</td>
              <td>
                <div className="distribution-bars">
                  {questionData.distributions.map((distribution, distIndex) => (
                    <div
                      key={distIndex}
                      className="bar"
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
