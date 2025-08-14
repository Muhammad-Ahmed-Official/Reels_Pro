import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ReelDashboard from './HomeTab';

type AnalyticsProp = {
    showAnalytics: boolean;
    setShowAnalytics: (value:boolean) => void;
}   

export default function AnalyticsModel({ showAnalytics, setShowAnalytics } : AnalyticsProp) {
  const [visible, setVisible] = useState(showAnalytics);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (showAnalytics) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      setTimeout(() => setVisible(false), 300);
    }
  }, [showAnalytics]);

  if (!visible) return null;

  return (
     <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 
        ${closing ? "backdrop-close" : "backdrop-open"} bg-black/50`}>
      <div
        className={`relative w-full lg:w-[75%] mt-10 mb-2 lg:ms-36 max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-lg transition-all duration-300${closing ? "modal-close" : "modal-open"}`}>
        <button
          onClick={() => setShowAnalytics(false)}
          className="absolute right-3 top-3 rounded-full bg-gray-200 p-2 hover:bg-gray-300 cursor-pointer">
          <X />
        </button>

        <div className="p-3 sm:p-4 md:p-6">
          <ReelDashboard />
        </div>
      </div>
    </div>
  )
}
