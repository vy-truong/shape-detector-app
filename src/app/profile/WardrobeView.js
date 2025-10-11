"use client";

import { useState, useEffect, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function WardrobeView() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("top");
  const carouselRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wardrobe") || "[]");
    setImages(stored);
  }, []);

  // Save to localStorage whenever images update
  useEffect(() => {
    localStorage.setItem("wardrobe", JSON.stringify(images));
  }, [images]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
      category,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  const grouped = images.reduce((acc, img) => {
    acc[img.category] = acc[img.category] || [];
    acc[img.category].push(img);
    return acc;
  }, {});

  return (
    <section className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-white shadow-sm">
      <h3 className="text-2xl font-fraunces font-medium mb-6 text-center sm:text-left">
        My Wardrobe
      </h3>

      {/* Upload Box */}
      <div className="bg-heading-hd/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <label className="flex flex-col items-center cursor-pointer text-center">
          <IoCloudUploadOutline size={45} className="text-white mb-2" />
          <span className="text-sm text-white/80">
            Click or drag to upload images
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        <div className="flex items-center gap-3">
          <label className="text-white/90 text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-md text-heading bg-white text-sm"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="skirt">Skirt</option>
            <option value="dress">Dress</option>
          </select>
        </div>
      </div>

      {/* Gallery */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-white/70 italic">
          No items uploaded yet.
        </p>
      ) : (
        Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-12 relative">
            <h4 className="text-lg sm:text-xl text-white font-fraunces mb-4 capitalize">
              {cat}
            </h4>
            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
            >
              {grouped[cat].map((img) => (
                <div
                  key={img.id}
                  className="min-w-[220px] sm:min-w-[260px] bg-white rounded-3xl shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-48 sm:h-56 object-contain p-6"
                  />
                  <div className="px-4 pb-4">
                    <p className="font-semibold text-heading text-sm truncate">
                      {img.name}
                    </p>
                    <p className="text-xs text-text/60 capitalize">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
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
        ))
      )}
    </section>
  );
}
