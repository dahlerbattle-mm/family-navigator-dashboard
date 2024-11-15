import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const CSVUploadContent = () => {
  const [message, setMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessage('CSV successfully uploaded');
    }
  };

  return (
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
  );
};

export default CSVUploadContent;
