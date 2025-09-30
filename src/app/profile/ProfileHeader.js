"use client";

import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";

export default function ProfileHeader() {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    return () => {
      if (avatar) URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar((current) => {
      if (current) URL.revokeObjectURL(current);
      return previewUrl;
    });
  };

  return (
    <section className="flex flex-col bg-bg p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-center p-5 sm:gap-4">
        <Avatar src={avatar || undefined} sx={{ width: 88, height: 88 }} />
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-text">User Name</h2> 
          <p className=" text-text/70">
            Update your profile information to personalise your plan.
          </p>
          <label className="text-md font-regular text-text/70 underline transition hover:text-text">
            <span>Choose photo</span>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

    </section>
  );
}
