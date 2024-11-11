import React from 'react';
import styles from './Definitions.module.css';

interface DefinitionSection {
  title: string;
  subtitle: string;
  definition: string;
}

interface DefinitionsProps {
  sections: DefinitionSection[];
}

const Definitions: React.FC<DefinitionsProps> = ({ sections }) => {
  return (
    <div className={styles.definitionContainer}>
      <h1 className={styles.pageTitle}>Family Dynamics: Definitions</h1>
      <div className={styles.sectionsWrapper}>
        {sections.map((section, index) => (
          <div key={index} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <h3 className={styles.sectionSubtitle}>{section.subtitle}</h3>
            <p className={styles.sectionDefinition}>{section.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Definitions;
