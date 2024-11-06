// src/app/csv-upload/page.tsx
'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Header from '@/app/(DashboardLayout)/layout/header/Header'; // Import Header
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar'; // Import Sidebar

const CSVUpload = () => {
  const [message, setMessage] = useState('');
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessage('CSV successfully uploaded');
    }
  };

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
          <PageContainer title="CSV Upload" description="Upload your CSV file here">
            <DashboardCard title="Upload CSV File">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" mb={3}>
                  Please upload the CSV from the Family Navigant Survey
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    p: 5,
                    width: '100%',
                    maxWidth: '500px',
                    mx: 'auto',
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                  >
                    Choose CSV File
                    <input
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>

                  {message && (
                    <Typography color="success.main" mt={2}>
                      {message}
                    </Typography>
                  )}
                </Box>
              </Box>
            </DashboardCard>
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CSVUpload;
