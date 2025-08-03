import { Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function ChatMessage({ text, isUser }) {
  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      p={1}
    >
      {!isUser && <SmartToyIcon sx={{ mr: 1 }} color="primary" />}
      <Typography
        variant="body1"
        sx={{
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "white" : "black",
          borderRadius: 2,
          px: 2,
          py: 1,
          maxWidth: "70%",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
