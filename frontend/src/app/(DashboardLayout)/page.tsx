import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const LoginPage = () => {
  return (
    <Container sx={{ mb: 4 }}>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <EmojiPeopleIcon sx={{ fontSize: 80, color: "#2c3e50" }} />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}
        >
          Welcome to Family Navigator
        </Typography>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#34495e" }}
          >
            The FamilyNavigator is based on the analysis of the responses of all
            the participants who completed the FamilyNavigator. The
            questionnaire is an outgrowth of research conducted by family
            business expert, Dean R. Fowler, Ph.D., to develop the
            FamilyNavigator with its focus on four Focus Areas, which are
            critical for successful intergenerational family transitions.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, color: "#555" }}
          >
            As you will see in this report, each of the four Focus Areas has
            three Competencies which measure and reflect a family’s progress
            towards transitional success. The FamilyNavigator provides
            analytical and graphical results for each of these twelve
            Competencies. It also suggests a roadmap of focus and actions, which
            should maximize the odds that your family will successfully reach
            your transitional goals and create a sustainable family legacy which
            will last for generations.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, color: "#555" }}
          >
            The FamilyNavigator is rooted in a purposeful approach to planning
            based on the culture, vision, and values of the family. The four
            Focus Areas should be traversed sequentially starting with the
            issues of Family Dynamics and moving on to the Competencies in the
            Focus Areas of Preparation & Development, and Business Preservation
            & Growth. Completion of the journey through these first three Focus
            Areas provides the underlying foundation to address the fourth Focus
            Area of sustainable Transition Planning.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, color: "#555" }}
          >
            Too often the technical issues of the twelfth Competency – Estate,
            Financial & Tax Planning – drive and dominate the planning process.
            We have discovered the best technical planning occurs as an
            outgrowth of first addressing the other eleven Competencies. If you
            have already put a comprehensive technical plan in place before
            engaging in the FamilyNavigator, you will want to carefully review
            that technical plan to see how it is aligned with the needs of your
            family as illuminated through the FamilyNavigator.
          </Typography>
        </Box>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#2980b9", textAlign: "center" }}
        >
          Contact Information
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#007BFF", fontWeight: "bold", textAlign: "center" }}
        >
          johndoe@gmail.com
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#007BFF", fontWeight: "bold", textAlign: "center" }}
        >
          janedoe@gmail.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
