// src/app/blank-page/page.tsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header'; // Import Header
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar'; // Import Sidebar

const BlankPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
          <PageContainer title="Blank Page" description="This is a blank page">
            <div />
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default BlankPage;
