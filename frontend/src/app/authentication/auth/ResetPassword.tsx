import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .trim()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .trim()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(data);
    // Simulate reset password logic
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    setLoading(false);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="subtitle2" mb={2}>
          Enter your new password.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600}>
          New Password
        </Typography>
        <Box mb={2}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                type="password"
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            )}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600}>
          Confirm Password
        </Typography>
        <Box mb={2}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                type="password"
                variant="outlined"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
              />
            )}
          />
        </Box>
      </Box>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </Box>
    </form>
  );
};

export default ResetPasswordForm;
