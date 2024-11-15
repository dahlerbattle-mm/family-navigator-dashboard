import React from "react";
import "./SubSectionTable.module.css"; // Import the CSS file

type ConstituencyData = {
  name: string;
  avg: number;
  rank: number;
};

type CategoryData = {
  category: string;
  avg: number;
  rank: number;
  constituencies: ConstituencyData[];
};

type SectionData = {
  section: string;
  categories: CategoryData[];
};

interface SubSectionTableProps {
  data: SectionData[];
}

const SubSectionTable: React.FC<SubSectionTableProps> = ({ data }) => {
  return (
    <div className="sub-section-table">
      {data.map((sectionData, sectionIndex) => (
        <div key={sectionIndex} className="section-container">
          <h2>{sectionData.section}</h2>
          {sectionData.categories.map((categoryData, categoryIndex) => (
            <div key={categoryIndex} className="category-container">
              <h3>{categoryData.category}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Constituency</th>
                    <th>Avg.</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.constituencies.map((constituency, constituencyIndex) => (
                    <tr key={constituencyIndex}>
                      <td>{constituency.name}</td>
                      <td>{constituency.avg.toFixed(2)}</td>
                      <td>{constituency.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubSectionTable;
