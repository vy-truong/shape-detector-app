"use client";

import { useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function WardrobeCarousel({
  groupedImages = {},
  selectedImages = [],
  onSelectImage,
  onEditImage, // optional callback (only used in WardrobeView)
  showEditButton = false,
  onPreview, 
}) {
  const carouselRef = useRef(null);

  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  // If nothing to display
  if (!Object.keys(groupedImages).length)
    return (
      <p className="text-center text-white/70 italic">
        No items uploaded yet.
      </p>
    );

  return (
    <>
      {Object.keys(groupedImages).map((cat) => (
        <div key={cat} className="mb-12 relative">
          <h4 className="text-lg sm:text-xl text-white font-fraunces mb-4 capitalize">
            {cat}
          </h4>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
          >
            {groupedImages[cat].map((img) => {
              const selected = selectedImages.includes(img.id);
              return (
                <div
                  key={img.id}
                  className={`relative min-w-[220px] sm:min-w-[260px] rounded-3xl shadow-md hover:shadow-xl transition-all ${
                    selected ? "bg-white" : "bg-white"
                  }`}
                >
                  {/* selection square */}
                  <div
                    onClick={() => onSelectImage?.(img.id)}
                    className={`absolute top-5 right-5 w-5 h-5 border-2 rounded-sm cursor-pointer transition-all ${
                      selected
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                    title="Select image"
                  ></div>

                  <img
                    src={img.url || img.image_url}
                    alt={img.title || "Wardrobe item"}
                    className="w-full h-48 sm:h-56 object-contain p-6"
                    onClick={() => onPreview?.(img)}
                  />

                  <div className="px-4 pb-4">
                    <p className="font-semibold text-heading text-sm truncate">
                      {img.title || "Untitled"}
                    </p>
                    <p className="text-xs text-text/60 capitalize">
                      {img.category} -{" "}
                      {Array.isArray(img.style)
                        ? img.style.join(", ")
                        : img.style}
                    </p>

                    {showEditButton && (
                      <button
                        onClick={() => onEditImage?.(img)}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* arrows */}
          <button
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
            onClick={scrollLeft}
          >
            <IoIosArrowBack size={24} />
          </button>
          <button
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white text-heading rounded-full shadow-md p-2 hover:bg-gray-100 z-20"
            onClick={scrollRight}
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      ))}
    </>
  );
}
