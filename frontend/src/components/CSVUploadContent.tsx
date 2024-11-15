import { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const CSVUploadContent = () => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch('/api/csv-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('CSV successfully uploaded and processed.');
        console.log('Server response:', data);
      } else {
        const error = await response.json();
        setMessage(`Upload failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file.');
    } finally {
      setUploading(false);
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
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Choose CSV File'}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          {uploading && (
            <CircularProgress size={24} sx={{ mt: 2 }} />
          )}

          {message && (
            <Typography
              color={message.startsWith('CSV successfully') ? 'success.main' : 'error.main'}
              mt={2}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default CSVUploadContent;
