export function Skeleton({ className = '', ...props }) {
  return <div className={`skeleton ${className}`} {...props} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-[var(--shadow-card)] border border-gray-100 p-6 space-y-4">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-5 p-5 border-b border-gray-100">
      <Skeleton className="h-5 w-52" />
      <Skeleton className="h-6 w-20 rounded-lg" />
      <Skeleton className="h-6 w-24 rounded-lg" />
      <Skeleton className="h-5 w-28 ml-auto" />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}
