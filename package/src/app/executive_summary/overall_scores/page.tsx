'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import CompetencyChart from '@/components/CompetencyChart'; // Import CompetencyChart

const CompetencyPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // State for competency data, loading, and error
  const [competencySections, setCompetencySections] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchCompetencyData = async () => {
      try {
        const response = await fetch('/api/competency-chart'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch competency data');
        const data = await response.json();

        // Update state with fetched data
        setCompetencySections(data.sections || []);
      } catch (err) {
        console.error('Error fetching competency data:', err);
        setError('Failed to load competency data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencyData();
  }, []);

  // Handlers for sidebar open/close
  const handleSidebarClose = () => setMobileSidebarOpen(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header at the top */}
      <Header toggleMobileSidebar={toggleMobileSidebar} />

      {/* Content area with Sidebar and Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={handleSidebarClose}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <PageContainer title="Competency Chart" description="This page displays a competency chart">
            {loading ? (
              <p>Loading competency data...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : competencySections.length === 0 ? (
              <p>No data available for the competency chart.</p>
            ) : (
              <CompetencyChart sections={competencySections} />
            )}
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CompetencyPage;
