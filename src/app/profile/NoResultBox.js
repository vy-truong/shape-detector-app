"use client";
import React from "react";
import Link from "next/link";

export default function NoResultBox() {
  return (
    <div className="bg-white/50 text-center rounded-2xl py-15 p-6 sm:p-10 sm:py-20 space-y-8 w-max mt-20 mb-20 mx-auto shadow-md">
      <h2 className="text-xl font-semibold mb-2">No result found</h2>
      <p className="text-text mb-8">
        Take the test to see your body shape analysis and recommendations.
      </p>
      <Link href="/shapefinder">
        <button className="bg-heading-hl text-white text-lg px-8 py-3 rounded-md hover:bg-heading-hd">
          Take the Test
        </button>
      </Link>
    </div>
  );
}
