// components/AvatarIcon.jsx
import { SmartToy } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function AvatarIcon() {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-cyan-600"
    >
      <SmartToy fontSize="large" />
    </motion.div>
  );
}
