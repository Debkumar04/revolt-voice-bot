export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-2">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm max-w-[70%]">
        {message}
      </div>
    </div>
  );
}
