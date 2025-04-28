import React, { useRef, useEffect, useState } from 'react';
import CardColorPopover from './CardColorPopover';

interface CardMenuProps {
  anchorRef: React.RefObject<HTMLDivElement>;
  color: string;
  onSetColor: (color: string) => void;
}

const CardMenu: React.FC<CardMenuProps> = ({ anchorRef, color, onSetColor }) => {
  const [open, setOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div className="relative">
      <button
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 focus:outline-accent"
        aria-label="Card actions"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50" role="menu">
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-accent"
            onClick={() => { setColorPopoverOpen(true); setOpen(false); }}
            tabIndex={0}
            role="menuitem"
          >
            Set Colour
          </button>
          {/* Other menu items (delete, etc) can go here */}
        </div>
      )}
      <CardColorPopover
        open={colorPopoverOpen}
        anchorEl={anchorRef.current}
        selected={color}
        onSelect={(c) => onSetColor(c)}
        onClose={() => setColorPopoverOpen(false)}
      />
    </div>
  );
};

export default CardMenu;
