"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import ConfirmModal from "./ConfirmModal";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setShowDropdown(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileUpdate = () => {
    // Refresh user data after profile update
    fetchCurrentUser();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Responsive sizing */}
          <Link
            href="/"
            className="transition-opacity flex items-center gap-2 md:gap-3"
          >
            <img
              src="/ch.png"
              alt="commentHub logo"
              className="h-8 md:h-12 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-2xl font-bold text-[#1e3a5f]">
                Comment
              </span>
              <span className="text-base md:text-2xl font-bold text-[#3b82f6]">
                Hub
              </span>
            </div>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isLoadingUser ? (
              <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-lg"></div>
            ) : currentUser ? (
              <div className="flex items-center gap-4">
                {/* Desktop: Full User Profile */}
                <div
                  onClick={() => setShowProfileModal(true)}
                  className="hidden md:flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border-2 border-transparent hover:border-blue-400 hover:from-blue-100 hover:to-purple-100 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer active:scale-95 active:shadow-sm"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm hover:border-purple-500 hover:rotate-6 transition-all duration-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                {/* Mobile/Tablet: Avatar Button with Dropdown */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-transparent hover:border-blue-400 hover:scale-110 transition-all duration-300 active:scale-95"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm"
                    />
                  </button>
                  {showDropdown && (
                    <ProfileDropdown
                      user={currentUser}
                      onLogout={handleLogoutClick}
                      onEditProfile={() => setShowProfileModal(true)}
                      onClose={() => setShowDropdown(false)}
                    />
                  )}
                </div>

                {/* Desktop: Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="hidden md:block px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-red-500 hover:bg-red-600 hover:scale-110 hover:shadow-xl rounded-lg active:scale-95 transition-all duration-300 ease-out cursor-pointer shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to log in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        isDangerous={true}
      />

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onUpdate={handleProfileUpdate}
      />
    </header>
  );
}
