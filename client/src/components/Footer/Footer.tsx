import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        backgroundColor: "white",
        color: "orange",
      }}
    >
      <Typography variant="body2">© La Bringuerie</Typography>
    </Box>
  );
};
