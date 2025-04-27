import React, { useRef, useEffect } from 'react';

const COLORS = [
  { name: 'default', label: 'Default', value: '#fff', border: '#e5e7eb' }, // white
  { name: 'blue', label: 'Blue', value: '#e0edfa', border: '#60a5fa' },
  { name: 'green', label: 'Green', value: '#e5f6e7', border: '#34d399' },
  { name: 'yellow', label: 'Yellow', value: '#fffbe5', border: '#fbbf24' },
  { name: 'red', label: 'Red', value: '#fdeaea', border: '#f87171' },
  { name: 'purple', label: 'Purple', value: '#f3e8ff', border: '#a78bfa' },
  { name: 'grey', label: 'Grey', value: '#f3f4f6', border: '#9ca3af' }
];

interface CardColorPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  selected: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const CardColorPopover: React.FC<CardColorPopoverProps> = ({ open, anchorEl, selected, onSelect, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  // Position popover below anchor
  useEffect(() => {
    if (open && anchorEl && popoverRef.current) {
      const rect = anchorEl.getBoundingClientRect();
      popoverRef.current.style.position = 'fixed';
      popoverRef.current.style.top = `${rect.bottom + 6}px`;
      popoverRef.current.style.left = `${rect.left}px`;
      popoverRef.current.style.zIndex = '9999';
      setTimeout(() => firstBtnRef.current?.focus(), 20);
    }
  }, [open, anchorEl]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handle(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, anchorEl, onClose]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;
  return (
    <div ref={popoverRef} onKeyDown={handleKeyDown} className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-2" role="menu" aria-label="Set card color">
      {COLORS.map((color, i) => (
        <button
          key={color.name}
          ref={i === 0 ? firstBtnRef : undefined}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center focus:outline-accent focus:ring-2 focus:ring-accent/50 ${selected === color.name ? 'ring-2 ring-accent' : ''}`}
          style={{ background: color.value, borderColor: color.border }}
          aria-label={color.label}
          tabIndex={0}
          onClick={() => { onSelect(color.name); onClose(); }}
        >
          {selected === color.name && (
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M6 10.5l3 3 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default CardColorPopover;
