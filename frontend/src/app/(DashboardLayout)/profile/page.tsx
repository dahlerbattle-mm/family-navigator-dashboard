"use client";
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Avatar,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for validation
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organization: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [isDirty, setIsDirty] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      organization: "Family Navigator",
      title: "Manager",
      email: "johndoe@gmail.com",
    },
  });

  const handleProfileUpdate = (data: any) => {
    console.log("Profile updated:", data);
    // TODO: Implement profile update logic
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Watch for changes to determine if the form is dirty
  watch((value) => {
    setIsDirty(true);
  });

  return (
    <Box>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Profile Settings
        </Typography>

        <form onSubmit={handleSubmit(handleProfileUpdate)}>
          <Grid container spacing={4}>
            {/* Profile Picture Section */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar
                  src={
                    typeof selectedImage === "string"
                      ? selectedImage
                      : "/images/profile/user-1.jpg"
                  }
                  alt="Profile Picture"
                  sx={{
                    width: 120,
                    height: 120,
                    boxShadow: 3,
                    border: "1px solid #ccc",
                  }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <IconUpload color="white" />
                </IconButton>
              </Box>
            </Grid>

            {/* Personal Information Section */}
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ? errors.firstName.message : ""
                    }
                    onChange={(e) => {
                      field.onChange(e);
                      setIsDirty(true);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsDirty(true);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Organization"
                    margin="normal"
                    onChange={(e) => {
                      field.onChange(e);
                      setIsDirty(true);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    margin="normal"
                    onChange={(e) => {
                      field.onChange(e);
                      setIsDirty(true);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value="johndoe@gmail.com" // Static value for now
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value="Customer Admin" // Static value for now
                disabled
                margin="normal"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  href="/authentication/reset_password"
                  variant="outlined"
                  color="primary"
                >
                  Change Password
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};

export default Profile;
