import React, { useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import MindMapPlaceholder from './components/MindMapPlaceholder';
import GlobalSearch from './components/GlobalSearch';


function App() {
  
  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-header text-white px-8 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Chalet Fractal Flow</h1>
        <GlobalSearch />
      </header>
      <main className="p-6 flex flex-col gap-6">
        <KanbanBoard />
        <MindMapPlaceholder />
      </main>
    </div>
  );
}

export default App;
