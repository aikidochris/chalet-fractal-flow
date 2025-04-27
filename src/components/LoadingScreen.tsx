import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-accent text-xl font-semibold animate-pulse">
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
    Loading Kanban Board...
  </div>
);

export default LoadingScreen;
