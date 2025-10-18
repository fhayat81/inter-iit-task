"use client";

import { useEffect, useRef } from "react";

export default function ProfileDropdown({
  user,
  onLogout,
  onEditProfile,
  onClose,
}) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-3 border-white shadow-lg"
          />
          <div className="flex flex-col text-white">
            <span className="font-bold text-sm md:text-base">{user.name}</span>
            <span className="text-xs opacity-90">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            onEditProfile();
            onClose();
          }}
          className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Edit Profile
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
