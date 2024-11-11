'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import Definitions from '@/components/Definitions'; // Import the Definitions component

// Types for API response data
type DefinitionSection = {
  title: string;
  subtitle: string;
  definition: string;
};

const DefinitionsPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [definitionsData, setDefinitionsData] = useState<DefinitionSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchDefinitionsData = async () => {
      try {
        const response = await fetch('/api/definitions'); // Replace with your API endpoint
        if (!response.ok) throw new Error('Failed to fetch definitions data');
        const data: DefinitionSection[] = await response.json();
        setDefinitionsData(data);
      } catch (err) {
        console.error('Error fetching definitions data:', err);
        setError('Failed to load definitions data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinitionsData();
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
          <PageContainer title="Family Dynamics Definitions" description="This page displays family dynamics definitions">
            {loading ? (
              <p>Loading definitions data...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : definitionsData.length === 0 ? (
              <p>No data available for definitions.</p>
            ) : (
              <Definitions sections={definitionsData} />
            )}
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default DefinitionsPage;
