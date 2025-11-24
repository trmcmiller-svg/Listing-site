export const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
      {count > 9 ? "9+" : count}
    </div>
  );
};
