import React from "react";
import styles from "./SubSectionTable.module.css"; // Import the CSS module

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
    <div className={styles.subSectionTable}>
      {data.map((sectionData, sectionIndex) => (
        <div key={sectionIndex} className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>{sectionData.section}</h2>
          {sectionData.categories.map((categoryData, categoryIndex) => (
            <div key={categoryIndex} className={styles.categoryContainer}>
              <h3 className={styles.categoryTitle}>{categoryData.category}</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Constituency</th>
                      <th className={styles.tableHeader}>Avg.</th>
                      <th className={styles.tableHeader}>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.constituencies.map((constituency, constituencyIndex) => (
                      <tr key={constituencyIndex} className={styles.tableRow}>
                        <td className={styles.tableCell}>{constituency.name}</td>
                        <td className={styles.tableCell}>{constituency.avg.toFixed(2)}</td>
                        <td className={styles.tableCell}>{constituency.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubSectionTable;
