"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./(DashboardLayout)/layout/sidebar/Sidebar";
import Header from "./(DashboardLayout)/layout/header/Header";
import { Box } from "@mui/material";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to control the sidebar visibility
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Handlers for sidebar open/close
  const handleSidebarClose = () => setMobileSidebarOpen(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />

          {/* Layout with Header, Sidebar, and Main Content */}
          <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header at the top */}
            <Header toggleMobileSidebar={toggleMobileSidebar} /> {/* Pass the toggle function here */}

            {/* Content area with Sidebar and Main Content */}
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Sidebar
                isMobileSidebarOpen={isMobileSidebarOpen}
                onSidebarClose={handleSidebarClose}
                isSidebarOpen={isSidebarOpen}
              />

              {/* Main content area */}
              <Box sx={{ flexGrow: 1, padding: 3 }}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
