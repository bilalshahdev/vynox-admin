const Loading = () => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-6 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
};

export default Loading;
