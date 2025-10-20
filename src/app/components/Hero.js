"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center text-white overflow-hidden
    bg-gradient-to-br from-[#6FA6E8] via-[#5A8BD9] to-[#355CA8]
    ">

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold italic leading-snug mb-3">
          Find What Flatters, Instantly
        </h1>

        <p className="text-base md:text-lg mb-8 text-gray-100">
          Discover your body shape, get outfit recommendations, and build your own digital wardrobe.
          All in one place.
        </p>

        {/* Features row */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm md:text-base text-gray-200">
          <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
            🔍 Find your body shape
          </span>
          <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
            👗 Get outfit recommendations
          </span>
          <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md">
            🧺 Upload your wardrobe
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/shapefinder">
            <button className="bg-white text-[#1E2A38] font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all">
              Start Now
            </button>
          </Link>
          <Link href="/profile/wardrobe">
            <button className="border border-white text-white font-medium text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-[#1E2A38] transition-all">
              My Wardrobe
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
