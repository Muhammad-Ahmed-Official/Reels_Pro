import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type PasswordProps = {
  updatePassword: boolean;
  setUpdatePassword: (value: boolean) => void;
};

function PasswordModel({ updatePassword, setUpdatePassword }: PasswordProps) {
  const [closing, setClosing] = useState(false);

  // Handle closing animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setUpdatePassword(false);
    }, 300); // match animation duration
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = updatePassword ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [updatePassword]);

  if (!updatePassword && !closing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0
        ${closing ? "animate-fadeOut" : "animate-fadeIn"}
      `}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}> <X /> </div>

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg p-6 space-y-4
          ${closing ? "animate-modalClose" : "animate-modalOpen"}
        `}>
        <h4 className="text-lg font-semibold text-gray-800">Update Password</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1"> Current Password </label>
          <input
            type="password"
            placeholder="Enter current password"
            className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1"> New Password </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm outline-none"
          />
        </div>


        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-all cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordModel;
