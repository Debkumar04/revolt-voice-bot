// components/BotMessage.jsx
import AvatarIcon from "./AvatarIcon";

export default function BotMessage({ text }) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <AvatarIcon />
      <div className="bg-gray-200 text-black p-3 rounded-xl max-w-[70%]">
        {text}
      </div>
    </div>
  );
}
