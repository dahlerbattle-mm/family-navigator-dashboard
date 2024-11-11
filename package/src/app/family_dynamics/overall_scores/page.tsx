'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import SubSectionTable from '@/components/SubSectionTable'; // Import the SubSectionTable component

// Types for API response data
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

const SubSectionPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [sectionData, setSectionData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await fetch('/api/subsections'); // Replace with your API endpoint
        if (!response.ok) throw new Error('Failed to fetch section data');
        const data: SectionData[] = await response.json();
        setSectionData(data);
      } catch (err) {
        console.error('Error fetching section data:', err);
        setError('Failed to load section data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
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
          <PageContainer title="SubSection Table" description="This page displays the subsection table">
            {loading ? (
              <p>Loading subsection data...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : sectionData.length === 0 ? (
              <p>No data available for the subsection table.</p>
            ) : (
              <SubSectionTable data={sectionData} />
            )}
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default SubSectionPage;
