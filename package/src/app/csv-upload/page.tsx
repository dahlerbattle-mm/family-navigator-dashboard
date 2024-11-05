"use client";

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const CSVUpload = () => {
  const [message, setMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setMessage('CSV successfully uploaded');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        CSV Upload
      </Typography>
      
      <Typography variant="body1" mb={2} color="text.secondary">
        Please upload the CSV from the Family Navigant Survey.
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
  );
};

export default CSVUpload;
