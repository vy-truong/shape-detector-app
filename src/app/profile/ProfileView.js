"use client";

import { motion } from "framer-motion";

export default function ProfileView() {
  return (
    <div className="space-y-10">
      {/* ===== BODY SHAPE RESULT ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-center text-white shadow-sm"
      >
        <h3 className="text-3xl font-fraunces font-medium mb-2">
          Your Result: Hourglass
        </h3>
        <p className="text-white/90 max-w-lg mx-auto mb-8">
          Your bust and hips are balanced with a well-defined waist. This
          proportionate shape is versatile and flatters your natural curves.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Bust", value: "36in" },
            { label: "Waist", value: "24in" },
            { label: "Hip", value: "38in" },
            { label: "Bust/Hip", value: "0.95" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/90 text-heading rounded-xl p-4 shadow-sm hover:shadow-md"
            >
              <p className="text-sm text-heading/70">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ===== CURATED STYLE GUIDE ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-heading-hl rounded-3xl p-8 sm:p-12 text-white shadow-sm"
      >
        <h3 className="text-2xl font-fraunces font-medium mb-6">
          Curated Style Guide
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["Top", "Bottom", "Skirt", "Dress"].map((item, i) => (
            <div
              key={i}
              className="bg-white text-heading rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-lg mb-2">{item}</h4>
              <p className="text-sm text-text/80">
                {item === "Top" &&
                  "Choose wrap tops, fitted blouses, or knits that flatter your curves."}
                {item === "Bottom" &&
                  "Opt for high-rise jeans or straight cuts that balance your proportions."}
                {item === "Skirt" &&
                  "Go for A-line or pencil skirts to define your waistline."}
                {item === "Dress" &&
                  "Select fit-and-flare or wrap dresses that hug your frame elegantly."}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
