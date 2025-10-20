"use client";

import { Modal } from "@mui/material";
import { IoClose } from "react-icons/io5";

export default function ModalFrame({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div
        className={`relative bg-heading-hd text-white rounded-3xl shadow-xl p-8 w-[90%] ${maxWidth}`}
      >
        {/* === Close Icon === */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-all"
        >
          <IoClose size={24} />
        </button>

        {/* === Optional Title === */}
        {title && (
          <h2 className="text-2xl font-fraunces mb-6 text-left capitalize tracking-wide">
            {title}
          </h2>
        )}

        {/* === Dynamic Children Content === */}
        <div className="overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </Modal>
  );
}
