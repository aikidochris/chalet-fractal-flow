import React, { useState, useRef, useEffect } from 'react';

interface RenameColumnInlineProps {
  value: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const RenameColumnInline: React.FC<RenameColumnInlineProps> = ({ value, onSave, onCancel }) => {
  const [name, setName] = useState(value);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(value);
    setError('');
    inputRef.current?.focus();
  }, [value]);

  const handleBlur = () => {
    if (!name.trim()) {
      setError('Please enter a column name.');
      return;
    }
    if (name.trim() !== value) {
      onSave(name.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!name.trim()) {
        setError('Please enter a column name.');
        return;
      }
      onSave(name.trim());
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="inline-block">
      <input
        ref={inputRef}
        className={`text-lg font-semibold px-1 rounded border ${error ? 'border-red-500' : 'border-transparent'} focus:border-accent outline-none bg-white`}
        value={name}
        onChange={e => { setName(e.target.value); setError(''); }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Rename column"
      />
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
};

export default RenameColumnInline;
