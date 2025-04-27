import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';


interface SearchItem {
  id: string;
  title: string;
  type: 'board' | 'card';
  boardId?: string;
}

function GlobalSearch() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchItem[]>([]);

  const fuseRef = useRef<Fuse<SearchItem> | null>(null);

  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  useEffect(() => {
    setAllItems([
      { id: '1', title: 'My Test Board', type: 'board' },
      { id: 'col-1', title: 'First Idea', type: 'card', boardId: '1' },
      { id: 'col-2', title: 'Doing This Now', type: 'card', boardId: '1' },
      { id: 'col-3', title: 'Done!', type: 'card', boardId: '1' },
    ]);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (!fuseRef.current) {
      fuseRef.current = new Fuse(allItems, { keys: ['title'] });
    } else {
      fuseRef.current.setCollection(allItems);
    }
    const fuseResults = fuseRef.current.search(query).map(r => r.item);
    setResults(fuseResults);
  }, [query, allItems]);

  const handleSelect = (item: SearchItem) => {
    window.dispatchEvent(new CustomEvent('search-select', { detail: item }));
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="search"
        className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white text-gray-800 w-60"
        placeholder="Search cards, boards..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ color: '#222' }}
      />
      {results.length > 0 && (
        <ul className="absolute bg-white shadow-lg rounded mt-1 w-full max-h-60 overflow-auto z-10">
          {results.map((result, idx) => (
            <li key={result.id} className="p-2 hover:bg-accent/10 cursor-pointer" onClick={() => handleSelect(result)}>
              <span className="font-semibold">{result.title}</span>
              <span className="ml-2 text-xs text-gray-400">[{result.type}]</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GlobalSearch;
