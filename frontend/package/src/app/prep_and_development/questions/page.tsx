'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Header from '@/app/(DashboardLayout)/layout/header/Header';
import Sidebar from '@/app/(DashboardLayout)/layout/sidebar/Sidebar';
import QuestionsTable from '@/components/QuestionsTable'; // Import the QuestionsTable component

// Types for API response data
type DistributionData = {
  group: string;
  value: number;
};

type QuestionData = {
  question: string;
  average: number;
  distributions: DistributionData[];
};

const QuestionsPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchQuestionsData = async () => {
      try {
        const response = await fetch('/api/questions'); // Replace with your API endpoint
        if (!response.ok) throw new Error('Failed to fetch questions data');
        const data: QuestionData[] = await response.json();
        setQuestionsData(data);
      } catch (err) {
        console.error('Error fetching questions data:', err);
        setError('Failed to load questions data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsData();
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
          <PageContainer title="Questions Table" description="This page displays the questions table">
            {loading ? (
              <p>Loading questions data...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : questionsData.length === 0 ? (
              <p>No data available for the questions table.</p>
            ) : (
              <QuestionsTable data={questionsData} />
            )}
          </PageContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionsPage;
