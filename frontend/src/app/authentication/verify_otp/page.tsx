"use client";
import { Grid, Box, Card, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import VerifyOtpForm from "../auth/VerifyOtp"; // Import the new component

const VerifyOtpPage = () => {
  return (
    <PageContainer title="Verify OTP" description="Enter your OTP">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo noLink />
              </Box>
              <VerifyOtpForm /> {/* Use the new VerifyOtpForm component */}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default VerifyOtpPage;
