
const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' };
const colors = {
  navy: 'text-navy-600',
  gray: 'text-gray-600',
  emerald: 'text-emerald-600',
  orangered: 'text-orangered-500',
  red: 'text-red-600',
  white: 'text-white',
};

export const LoadingSpinner = ({ size = 'md', text, color = 'navy', fullPage }) => {
  const spinner = (
    <svg className={`animate-spin ${sizes[size]} ${colors[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm">
        {spinner}
        {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        {spinner}
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    );
  }

  return spinner;
};

export const CardSkeleton = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
        <div className="h-56 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
        <div className="p-6 space-y-3 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-28" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex gap-2">
            <div className="h-9 bg-gray-200 rounded-lg flex-1" />
            <div className="h-9 bg-gray-200 rounded-lg flex-1" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export const TipoSkeleton = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-xl flex-shrink-0 animate-shimmer" />
        <div className="flex-1 space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    ))}
  </>
);
