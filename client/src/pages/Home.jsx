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
    <section className="relative bg-white pt-24">
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

      {/* Category List main conatainer */}
     <div className="w-full px-4 mt-6 overflow-x-auto">
  <div className="flex gap-4 whitespace-nowrap lg:grid grid-cols-8">
    {loadingCategory
      ? new Array(12).fill(null).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white rounded-xl p-4 w-[100px] h-[130px] flex flex-col items-center justify-center gap-2 shadow-md animate-pulse"
          >
            <div className="bg-green-100 h-20 w-full rounded"></div>
            <div className="bg-green-100 h-4 w-3/4 rounded"></div>
          </div>
        ))
      : categoryData.map((cat) => {
          const hasSubcategories = subCategoryData.some((sub) =>
            sub.category.some((c) => c._id === cat._id)
          );
          if (!hasSubcategories) return null;

          return (
            // category images in box 
            <div
              key={cat._id}
              className="flex-shrink-0 cursor-pointer rounded-xl shadow-sm hover:shadow-xl border-1 transition flex flex-col items-center justify-center text-center w-[100px] h-[130px]"
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-30 w-20 object-contain rounded mb-2"
              />
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
