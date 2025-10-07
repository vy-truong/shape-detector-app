"use client";

import WardrobeUpdate from "./WardrobeUpdate";

export default function WardrobePage() {
  return (
    <section className="mt-10 px-6 sm:px-8 lg:px-12">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading flex items-center gap-2">
          <span className="text-yellow-500">👕</span> My Wardrobe
        </h2>
        <p className="text-muted text-base sm:text-lg">
          Upload and organize your clothing items by category
        </p>
      </div>

      {/* Upload + Wardrobe */}
      <WardrobeUpdate />
    </section>
  );
}
