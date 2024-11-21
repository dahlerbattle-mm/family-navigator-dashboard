import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
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

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle reset password logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h5" mb={1}>
          Reset Password
        </Typography>
        <Typography variant="subtitle2" mb={2}>
          Enter your new password.
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
        >
          Reset Password
        </Button>
      </Box>
    </form>
  );
};

export default ResetPasswordForm;
