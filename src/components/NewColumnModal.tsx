import React, { useState, useRef, useEffect } from 'react';

interface NewColumnModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const NewColumnModal: React.FC<NewColumnModalProps> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a column name.');
      return;
    }
    onCreate(name.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" tabIndex={-1} onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-3">Enter column name</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="w-full border px-3 py-2 rounded mb-2 outline-accent"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="Column name"
            aria-label="Column name"
            autoFocus
          />
          {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="text-gray-600 px-3 py-1 rounded hover:bg-gray-100" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-accent text-white px-4 py-1.5 rounded disabled:opacity-50" disabled={!name.trim()}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewColumnModal;
