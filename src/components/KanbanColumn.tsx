import React, { FC, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { CardData } from './KanbanBoard';
import DraggableCard from './DraggableCard';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  cards: CardData[];
  onCardClick: (card: CardData) => void;
  onMoveCard: (card: CardData, destColumnId: string) => void;
  onAddCard: (title: string) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  isDraggingCard: string | null;
}

const STATUSES = ['Ideas', 'In Progress', 'Completed'];

// Threshold in pixels to consider pointer movement a click, not a drag
const CLICK_MOVEMENT_THRESHOLD = 5;

const KanbanColumn: FC<KanbanColumnProps> = ({
  columnId,
  title,
  cards,
  onCardClick,
  onMoveCard,
  onAddCard,
  isDragging,
  setIsDragging,
  isDraggingCard,
}) => {
  // Filter/sort state
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<'due' | 'title' | 'none'>('none');

  // Filter and sort cards
  let safeCards = Array.isArray(cards) ? cards : [];
let filteredCards = showPinnedOnly ? safeCards.filter(c => c?.pinned) : safeCards;
  if (sortMode === 'due') {
    filteredCards = [...filteredCards].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (sortMode === 'title') {
    filteredCards = [...filteredCards].sort((a, b) => a.title.localeCompare(b.title));
  }

  const [newCardTitle, setNewCardTitle] = useState<string>('');

  // droppable area for this column
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: columnId });
  const [justDropped, setJustDropped] = React.useState<string | null>(null);

  // Snap animation: when a card is dropped into this column, animate it
  React.useEffect(() => {
    if (isOver && isDraggingCard && !cards.some(c => c.id === isDraggingCard)) {
      setJustDropped(isDraggingCard);
      setTimeout(() => setJustDropped(null), 160);
    }
  }, [isOver, isDraggingCard, cards]);

  return (
    <div className={`bg-gray-100 rounded-lg px-3 md:px-4 py-4 shadow-md flex flex-col min-h-[400px] max-w-[360px] min-w-[260px] flex-shrink-0 transition-all duration-150 ${isOver ? 'ring-2 ring-accent bg-accent/5' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {/* Filter/Sort Controls */}
      <div className="flex gap-2 mb-3">
        <label className="flex items-center text-xs gap-1">
          <input type="checkbox" checked={showPinnedOnly} onChange={e => setShowPinnedOnly(e.target.checked)} />
          Pinned Only
        </label>
        <select
          className="text-xs px-1 py-0.5 border rounded"
          value={sortMode}
          onChange={e => setSortMode(e.target.value as 'due' | 'title' | 'none')}
        >
          <option value="none">Sort: Default</option>
          <option value="due">Sort: Due Date</option>
          <option value="title">Sort: Title A-Z</option>
        </select>
      </div>
      <div ref={setDroppableRef} className="flex flex-col gap-3">
        {filteredCards.length === 0 ? (
          <div className="text-gray-400 text-xs text-center py-4">No cards yet.</div>
        ) : (
          filteredCards.map(card => (
            <DraggableCard
              key={card.id}
              card={card}
              columnId={columnId}
              onCardClick={onCardClick}
              onMoveCard={onMoveCard}
              isDragging={isDragging && isDraggingCard === card.id}
              snap={justDropped === card.id}
            />
          ))
        )}
      </div>
      <div className="mt-4">
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (newCardTitle.trim()) { onAddCard(newCardTitle.trim()); setNewCardTitle(''); } }}>
          <input
            type="text"
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            placeholder="New card title"
            className="flex-1 px-2 py-1 border rounded"
          />
          <button type="submit" className="px-3 py-1 bg-accent text-white rounded disabled:opacity-50" disabled={!newCardTitle.trim()}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default KanbanColumn;
