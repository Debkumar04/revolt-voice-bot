// components/BotChatCard.jsx
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function BotChatCard({ message, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 my-2"
    >
      <Avatar sx={{ bgcolor: "#1976d2" }}>
        <SmartToyIcon />
      </Avatar>

      <Card sx={{ bgcolor: "#f1f1f1", borderRadius: "20px", maxWidth: "80%" }}>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} />
              <Typography variant="body2">Gemini is thinking...</Typography>
            </div>
          ) : (
            <Typography variant="body2">{message}</Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
