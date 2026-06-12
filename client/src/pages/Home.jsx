import React, { useState, useEffect, useCallback } from "react";
import banner from "../assets/banner.jpg";
import banner1 from "../assets/image1.jpg";
import banner2 from "../assets/image2.jpg";
import banner3 from "../assets/image3.jpg";
import banner4 from "../assets/image4.jpg";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import toast from "react-hot-toast";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mobileBanners = [banner1, banner2, banner3, banner4];

  const handleBannerChange = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentBannerIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === mobileBanners.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isTransitioning, mobileBanners.length]);

  const handleRedirectProductListpage = (id, cat) => {
    try {
      const subcategory = subCategoryData.find((sub) =>
        sub.category.some((c) => c._id === id)
      );
      if (!subcategory) {
        toast.error("No subcategories found for this category");
        return;
      }
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
        subcategory.name
      )}-${subcategory._id}`;
      navigate(url);
    } catch (error) {
      console.error("Error redirecting to product list:", error);
      toast.error("Error loading category");
    }
  };

  return (
    <section className="relative bg-white pt-4">
      {/* Desktop Banner */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl lg:mt-10 overflow-hidden shadow-md bg-gradient-to-r from-green-50 to-green-100">
            <img
              src={banner}
              className="w-full h-[320px] object-cover"
              alt="banner"
            />
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="lg:hidden w-full aspect-[2/1] relative overflow-hidden">
        {mobileBanners.map((bannerImg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentBannerIndex
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <img
              src={bannerImg}
              className="w-full h-full object-cover"
              alt={`banner ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.postimg.cc/gkWpM52H/banner.png";
              }}
            />
          </div>
        ))}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {mobileBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleBannerChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? "bg-green-600 scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        {/* Slide Controls */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
          onClick={() =>
            handleBannerChange(
              currentBannerIndex === 0
                ? mobileBanners.length - 1
                : currentBannerIndex - 1
            )
          }
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
          onClick={() =>
            handleBannerChange((currentBannerIndex + 1) % mobileBanners.length)
          }
        />
      </div>

      {/* ── Category List ──
           Mobile  : single horizontal scrollable row
           sm+     : grid that wraps
      ── */}
      <div className="mt-6">
        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {loadingCategory
            ? new Array(10).fill(null).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[72px] flex flex-col items-center gap-2 animate-pulse">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl" />
                  <div className="w-10 h-2.5 bg-green-100 rounded" />
                </div>
              ))
            : categoryData.map((cat) => {
                const hasSubcategories = subCategoryData.some((sub) =>
                  sub.category.some((c) => c._id === cat._id)
                );
                if (!hasSubcategories) return null;
                return (
                  <div
                    key={cat._id}
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                    className="flex-shrink-0 w-[72px] flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center overflow-hidden border border-green-100 group-hover:border-green-300 transition">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-[10px] font-medium text-gray-600 text-center leading-tight line-clamp-2 w-full">
                      {cat.name}
                    </p>
                  </div>
                );
              })}
        </div>

        {/* Desktop (lg+): responsive grid */}
        <div className="hidden lg:grid grid-cols-9 xl:grid-cols-11 gap-3 max-w-7xl mx-auto px-4">
          {loadingCategory
            ? new Array(12).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm animate-pulse">
                  <div className="bg-green-100 h-14 w-14 rounded-xl" />
                  <div className="bg-green-100 h-3 w-3/4 rounded" />
                </div>
              ))
            : categoryData.map((cat) => {
                const hasSubcategories = subCategoryData.some((sub) =>
                  sub.category.some((c) => c._id === cat._id)
                );
                if (!hasSubcategories) return null;
                return (
                  <div
                    key={cat._id}
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                    className="group cursor-pointer bg-white rounded-2xl p-2 flex flex-col items-center justify-between gap-1 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-green-100"
                  >
                    <div className="w-full aspect-square flex items-center justify-center bg-green-50 rounded-xl overflow-hidden p-1">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-gray-600 text-center leading-tight line-clamp-2 w-full px-0.5">
                      {cat.name}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>


      {/* Category-Wise Products */}
      <div className="max-w-7xl mx-auto px-4 mt-10 space-y-10">
        {categoryData?.map((c) => (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
