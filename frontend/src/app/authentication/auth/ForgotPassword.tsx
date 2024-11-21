import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

const schema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

const ForgotPasswordForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle forgot password logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h5" mb={1}>
          Forgot Password
        </Typography>
        <Typography variant="subtitle2" mb={2}>
          Enter your email to receive a password reset link.
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
          mt="25px"
        >
          Email Address
        </Typography>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
      </Box>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Send Reset Link
        </Button>
      </Box>
    </form>
  );
};

export default ForgotPasswordForm;
