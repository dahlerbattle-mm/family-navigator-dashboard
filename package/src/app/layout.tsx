"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./(DashboardLayout)/layout/sidebar/Sidebar";
import Header from "./(DashboardLayout)/layout/header/Header";
import { Box } from "@mui/material";
import { useState } from "react";
import { usePathname } from "next/navigation";

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

  // Get the current path
  const pathname = usePathname();

  // Define routes that should not display the layout
  const isAuthPage = pathname?.startsWith("/authentication");

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />

          {isAuthPage ? (
            // Blank layout for auth pages
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              {children}
            </Box>
          ) : (
            // Layout with Header, Sidebar, and Main Content for other pages
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
              {/* Header at the top */}
              <Header toggleMobileSidebar={toggleMobileSidebar} />

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
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
