const CardLoading = () => {
  return (
    <div className="
      w-[140px] sm:w-[160px] md:w-[185px] lg:w-[210px]
      flex-shrink-0 rounded-2xl border border-gray-100
      bg-white shadow-sm animate-pulse overflow-hidden flex flex-col
    ">
      {/* Image skeleton */}
      <div className="h-[110px] sm:h-[130px] md:h-[140px] lg:h-[160px] bg-gray-100 m-2 rounded-xl" />

      <div className="px-2.5 pb-3 flex flex-col gap-2">
        {/* Delivery badge */}
        <div className="h-4 w-12 bg-gray-100 rounded-full" />
        {/* Name */}
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        {/* Unit */}
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        {/* Price + button */}
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-8 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CardLoading;
