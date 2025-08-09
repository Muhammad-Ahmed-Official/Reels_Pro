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
      setTimeout(() => setVisible(false), 300); // matches animation duration
    }
  }, [showAnalytics]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ms-36 
        ${closing ? "backdrop-close" : "backdrop-open"} bg-black/50`}>
      <div
        className={`relative max-h-[90vh] w-[90%] max-w-5xl overflow-y-auto 
          rounded-2xl bg-white shadow-lg 
          ${closing ? "modal-close" : "modal-open"}`}>
        <button
          onClick={() => setShowAnalytics(false)}
          className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 hover:bg-gray-300 cursor-pointer">
          <X />
        </button>

        <div className="p-4">
          <ReelDashboard />
        </div>
      </div>
    </div>
  )
}
