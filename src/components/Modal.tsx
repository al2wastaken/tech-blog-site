import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-md w-full relative transition-all duration-300 transform translate-y-0 opacity-100">
        <button
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xl"
          onClick={onClose}
          aria-label="Kapat"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
