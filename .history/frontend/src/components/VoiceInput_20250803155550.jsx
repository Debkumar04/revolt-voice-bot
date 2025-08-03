import { IconButton, Tooltip } from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

export default function VoiceInput({ onClick, listening }) {
  return (
    <Tooltip title={listening ? "Listening..." : "Click to Speak"}>
      <IconButton onClick={onClick} color={listening ? "error" : "primary"}>
        <KeyboardVoiceIcon />
      </IconButton>
    </Tooltip>
  );
}
