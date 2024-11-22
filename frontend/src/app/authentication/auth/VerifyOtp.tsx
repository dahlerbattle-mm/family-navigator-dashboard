import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";

const schema = z.object({
  otp: z
    .string({ message: "OTP is required" })
    .trim()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must be numeric"),
});

const VerifyOtpForm = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    router.push("/authentication/reset_password");
  };

  const handleChange = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    setOtpValues(newOtpValues);
  };

  const isButtonEnabled = otpValues.every((val) => val.length === 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h5" mb={1}>
          Verify OTP
        </Typography>
        <Typography variant="subtitle2" mb={2}>
          Enter the 4-digit OTP sent to your email/phone.
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
          {otpValues.map((value, index) => (
            <Controller
              key={index}
              name="otp"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  inputRef={(el: any) => (inputRefs.current[index] = el)}
                  variant="outlined"
                  fullWidth
                  error={!!errors.otp}
                  value={value}
                  onChange={(e: any) => {
                    const newValue = e.target.value.replace(/\D/g, "");
                    handleChange(index, newValue);

                    const combinedValue = [
                      ...otpValues.slice(0, index),
                      newValue,
                      ...otpValues.slice(index + 1),
                    ].join("");
                    field.onChange(combinedValue);
                    console.log(combinedValue);
                    setValue("otp", combinedValue);
                  }}
                  inputProps={{ maxLength: 1 }}
                />
              )}
            />
          ))}
        </Box>
        {errors.otp && (
          <Typography color="error" mb={2}>
            {errors.otp.message}
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading || !isButtonEnabled}
        >
          {loading ? <CircularProgress size={24} /> : "Verify OTP"}
        </Button>
      </Box>
    </form>
  );
};

export default VerifyOtpForm;
