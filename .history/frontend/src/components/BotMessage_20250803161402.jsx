// --- components/BotMessage.jsx ---
import AvatarIcon from "./AvatarIcon";
import LoadingDots from "./LoadingDots";

export default function BotMessage({ message, isLoading }) {
  return (
    <div className="flex items-start gap-2 my-2">
      <AvatarIcon />
      <div className="bg-gray-200 px-4 py-2 rounded-xl text-sm max-w-[70%]">
        {isLoading ? <LoadingDots /> : message}
      </div>
    </div>
  );
}
