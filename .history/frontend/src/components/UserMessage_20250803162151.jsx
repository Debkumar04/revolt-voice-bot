// components/UserMessage.jsx
export default function UserMessage({ text }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-500 text-white p-3 rounded-xl max-w-[70%]">
        {text}
      </div>
    </div>
  );
}
