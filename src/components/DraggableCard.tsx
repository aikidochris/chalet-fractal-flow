import React, { FC, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { CardData } from './KanbanBoard';
import { useCardProgress } from './useCardProgress';
import CardMenu from './CardMenu';

const STATUSES = ['Ideas', 'In Progress', 'Completed'];

interface DraggableCardProps {
  card: CardData;
  columnId: string;
  onCardClick: (card: CardData) => void;
  onMoveCard: (card: CardData, newStatus: string) => void;
  isDragging: boolean;
  snap?: boolean;
  onSetColor?: (color: string) => void;
}

const DraggableCard: FC<DraggableCardProps> = ({ card, columnId, onCardClick, onMoveCard, isDragging, snap }) => {
  const [localColor, setLocalColor] = useState(card.color || 'default');
  const cardRef = useRef<HTMLDivElement>(null);

  // Update color in Firestore and local state
  const handleSetColor = async (color: string) => {
    setLocalColor(color);
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(require('../firebase').db, 'cards', card.id), { color });
    } catch (e) { /* fail silently for now */ }
  };
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id });
  // Card color logic
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    default: { bg: '#fff', border: '#e5e7eb', text: '#222' },
    blue:    { bg: '#e0edfa', border: '#60a5fa', text: '#1e293b' },
    green:   { bg: '#e5f6e7', border: '#34d399', text: '#14532d' },
    yellow:  { bg: '#fffbe5', border: '#fbbf24', text: '#78350f' },
    red:     { bg: '#fdeaea', border: '#f87171', text: '#7f1d1d' },
    purple:  { bg: '#f3e8ff', border: '#a78bfa', text: '#4b006e' },
    grey:    { bg: '#f3f4f6', border: '#9ca3af', text: '#222' },
  };
  const colorKey = localColor || 'default';
  const color = colorMap[colorKey] || colorMap.default;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    background: color.bg,
    borderColor: color.border,
    color: color.text,
    boxShadow: '0 1px 6px 0 rgba(60,60,60,0.08)',
  };
  const idx = STATUSES.indexOf(columnId);

  // live progress per card
  const { progress, tasksCount } = useCardProgress(card.id);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => { if (!isDragging) onCardClick(card); }}
      style={style}
      className={`kanban-card rounded-card shadow-card px-4 py-3 border-l-4 ${card.pinned
        ? 'border-emerald-300 hover:border-emerald-400 transition-colors duration-150'
        : 'border-transparent'
      } max-w-full relative select-none animate-card-entry ${isDragging
        ? (card.pinned
          ? 'opacity-60 border-2 border-emerald-500 transition-none'
          : 'opacity-60 border-2 border-accent transition-none'
        )
        : 'transition-shadow'
      }${snap ? ' snap-in' : ''}`}
    >
      <div className="flex items-start justify-between cursor-pointer group" ref={cardRef}>
        <span className="font-medium text-gray-800 break-words max-w-full line-clamp-3 overflow-hidden text-ellipsis whitespace-pre-line leading-snug" title={card.title}>{card.title}</span>
        {/* Always show menu button, stop propagation to prevent modal open */}
        <div className="absolute top-2 right-2 z-10">
          <CardMenu anchorRef={cardRef} color={localColor} onSetColor={handleSetColor} />
        </div>
        {card.pinned && (
          <span className="absolute top-2 right-8 flex items-center text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded shadow-sm transition-colors duration-150 hover:bg-green-200">
            <span className="mr-1">📌</span>PINNED
          </span>
        )}
      </div>
      {card.dueDate && <div className="text-xs text-gray-500 mt-1">Due: {card.dueDate}</div>}
      <div className="mt-2 flex gap-2">
        {idx > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onMoveCard(card, STATUSES[idx - 1]); }}
            className="btn px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ←
          </button>
        )}
        {idx < STATUSES.length - 1 && (
          <button
            onClick={e => { e.stopPropagation(); onMoveCard(card, STATUSES[idx + 1]); }}
            className="btn px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            →
          </button>
        )}
      </div>
      {/* Progress Bar at bottom */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded h-1.5 overflow-hidden">
          <div
            className={tasksCount > 0 ? "bg-accent h-1.5 rounded transition-all duration-300" : "bg-gray-300 h-1.5 rounded"}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {tasksCount > 0 ? `${Math.round(progress)}% complete` : '0% complete'}
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;
