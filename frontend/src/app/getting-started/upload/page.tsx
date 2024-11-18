'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import CSVUploadContent from '@/components/CSVUploadContent';

const CSVUpload = () => {
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
        {/* Main content */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <PageContainer title="CSV Upload" description="Upload your CSV file here">
            <CSVUploadContent />
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CSVUpload;

// CSVUploadContent Component
const CSVUploadContent = () => {
  const [organization, setOrganization] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !organization) {
      alert('Please provide both an organization name and a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('organization', organization);

    try {
      const response = await fetch('/api/csv-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload CSV File
      </Typography>
      <TextField
        label="Organization Name"
        value={organization}
        onChange={handleOrganizationChange}
        fullWidth
        margin="normal"
      />
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ margin: '20px 0' }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </Box>
  );
};
