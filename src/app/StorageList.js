"use client";

import { useState } from "react";

export default function StorageList() {
  const [results, setResults] = useState([]);
     // inputs
  const [shape, setShape] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");


  const saveResult = () => {
    // 1. build object from inputs
    const newResult = {
      id: Date.now(),
      bodyShape: shape,
      bust: Number(bust),
      waist: Number(waist),
      hip: Number(hip),
      date: new Date().toLocaleDateString(),
    };
    // 2. load existing results (parse JSON)
    const existing = JSON.parse(localStorage.getItem("results") || "[]");

    // 3. add new one
    const updated = [...existing, newResult];

    // 4. save back
    localStorage.setItem("results", JSON.stringify(updated));
  };

  const loadResults = () => {
    const stored = JSON.parse(localStorage.getItem("results") || "[]");
    setResults(stored);
  };

  return (
    <div className="p-6 space-y-4">
      <button onClick={saveResult} className="bg-blue-500 text-white px-4 py-2">
        Save Fake Result
      </button>
      <button onClick={loadResults} className="bg-green-500 text-white px-4 py-2">
        Load Results
      </button>

      <ul className="list-disc pl-5">
        {results.map((r) => (
          <li key={r.id}>
            {r.bodyShape} — {r.bust}/{r.waist}/{r.hip} ({r.date})
          </li>
        ))}
      </ul>
    </div>
  );
}
