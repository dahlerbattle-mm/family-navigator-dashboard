import React from "react";
import "./CompetencyChart.module.css";

// Define the structure for each competency section
interface Competency {
  name: string;
  value: number;
}

interface Section {
  title: string;
  competencies: Competency[];
  borderColor: string;
}

// Define props for the CompetencyChart component
interface CompetencyChartProps {
  sections: Section[];
}

const CompetencyChart: React.FC<CompetencyChartProps> = ({ sections }) => {
  // Function to determine background color based on competency value
  const getColor = (value: number): string => {
    if (value > 5.249) return "#8BC34A"; // Green for strong competency
    if (value < 3.251) return "#E57373"; // Red for weak competency
    return "#FFF176"; // Yellow for medium competency
  };

  return (
    <div className="competency-chart">
      <h2>Competency Chart</h2>

      {/* Key for the chart */}
      <div className="chart-key">
        <div className="key-box">
          <strong>Key</strong>
          <div>Focus Area</div>
          <div>Competency</div>
        </div>
        <div className="competency-strength">
          <strong>Competency Strength</strong>
          <div className="strength-level strong">Strong</div>
          <div className="strength-level medium">Medium</div>
          <div className="strength-level weak">Weak</div>
        </div>
      </div>

      {/* Chart sections */}
      <div className="chart-sections">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="section"
            style={{
              borderColor: section.borderColor,
            }}
          >
            <h3 style={{ color: section.borderColor }}>{section.title}</h3>
            {section.competencies.map((comp, compIndex) => (
              <div
                key={compIndex}
                className="competency"
                style={{
                  backgroundColor: getColor(comp.value),
                }}
              >
                {comp.name}
                <br />
                <span>{comp.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyChart;
