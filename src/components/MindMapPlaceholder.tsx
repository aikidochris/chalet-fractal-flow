import React from 'react';

function MindMapPlaceholder() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-accent rounded-lg py-12">
      <span className="text-accent font-semibold text-lg mb-2">Mind-Map Overview (Coming Soon)</span>
      <span className="text-gray-500">A fractal mind-map view of all boards will appear here in the future.</span>
      <button className="mt-4 px-5 py-2 bg-accent text-white rounded hover:bg-teal-600 transition">Try Mind-Map (Placeholder)</button>
    </div>
  );
}

export default MindMapPlaceholder;
