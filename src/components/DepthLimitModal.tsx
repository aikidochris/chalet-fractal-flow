import React from 'react';

interface DepthLimitModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DepthLimitModal({ open, onCancel, onConfirm }: DepthLimitModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-header">Depth Limit Reached</h2>
        <p className="mb-6">You have reached the default depth limit (3 levels). Are you sure you want to go deeper?</p>
        <div className="flex gap-4 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-accent text-white font-semibold hover:bg-teal-600">Go Deeper</button>
        </div>
      </div>
    </div>
  );
}

export default DepthLimitModal;
