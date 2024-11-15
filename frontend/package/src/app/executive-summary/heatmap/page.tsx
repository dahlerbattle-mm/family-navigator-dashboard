'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import HeatMap from '@/components/HeatMap';

const BlankPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // State for heatmap data, row labels, column labels, loading, and error
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('/api/heatmap'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch heatmap data');
        const data = await response.json();

        // Update state with fetched data or fallback to empty arrays
        setRowLabels(data.rows || []);
        setColumnLabels(data.columns || []);
        setHeatmapData(data.data || []);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setError('Failed to load heatmap data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
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
          <PageContainer title="Heatmap" description="This page displays a heatmap">
            {loading ? (
              <p>Loading heatmap data...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : rowLabels.length === 0 || columnLabels.length === 0 || heatmapData.length === 0 ? (
              <p>No data available for the heatmap.</p>
            ) : (
              <HeatMap data={heatmapData} rowLabels={rowLabels} columnLabels={columnLabels} />
            )}
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default BlankPage;
