
const LoadingDots = () => {
  return (
    <div className="flex space-x-1 items-center justify-center py-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
