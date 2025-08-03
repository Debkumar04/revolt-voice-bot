// components/LoadingDots.jsx
export default function LoadingDots() {
  return (
    <div className="flex gap-1 ml-11 mt-1 animate-pulse">
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    </div>
  );
}
