import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent
} from '@dnd-kit/core';

import KanbanColumn from './KanbanColumn';
import NewColumnModal from './NewColumnModal';
import RenameColumnInline from './RenameColumnInline';
import Breadcrumbs from './Breadcrumbs';
import DepthLimitModal from './DepthLimitModal';
import CardModal from './CardModal';
import LoadingScreen from './LoadingScreen';

export interface CardData {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: string;
  pinned: boolean;
  dueDate?: string;
  hasSubBoard: boolean;
  subBoardId?: string;
  color?: string; // pastel color key
}

export interface BoardState {
  id: string;
  title: string;
  parentBoardId?: string;
  depthLevel: number;
}

const dummyBoard: BoardState = { id: 'board-1', title: 'My Test Board', depthLevel: 0 };
const dummyColumns: Array<{ id: string; title: string }> = [
  { id: 'Ideas', title: 'Ideas' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' },
];
const dummyCards: CardData[] = []; // Start with no cards for a fresh Kanban

function KanbanBoard() {
  // Use dummy data instead of Firestore
  const [boardData] = useState<BoardState>(dummyBoard);
  const [columns, setColumns] = useState(dummyColumns);
  const [cards, setCards] = useState<CardData[]>(dummyCards);
  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCard, setIsDraggingCard] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BoardState[]>([dummyBoard]);
  const [showDepthModal, setShowDepthModal] = useState(false);
  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [renamingColumnId, setRenamingColumnId] = useState<string | null>(null);
  const newColumnBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // Override drag sensors (no change)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handlers operate on local dummy state
  const handleMoveCard = (card: CardData, newStatus: string) => {
    setCards(c => c.map(x => x.id === card.id ? { ...x, status: newStatus } : x));
  };
  const handleAddCard = (status: string, title: string) => {
    const id = `card-${Date.now()}`;
    setCards(c => [...c, { id, boardId: dummyBoard.id, title, description: '', status, pinned: false, hasSubBoard: false }]);
  };

  // Handle drag end: update local state
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as string;
    const cardId = active.id as string;
    if (columns.some((c) => c.id === newStatus)) {
      const card = cards.find((c) => c.id === cardId);
      if (card && card.status !== newStatus) {
        handleMoveCard(card, newStatus);
      }
    }
  };

  // No loading guard needed: dummy data is always present
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={event => {
        setIsDragging(true);
        if (event && event.active && event.active.id) {
          setIsDraggingCard(String(event.active.id));
        }
      }}
      onDragEnd={event => {
        setIsDragging(false);
        setIsDraggingCard(null);
        handleDragEnd(event);
      }}
    >
      <div className="bg-background rounded-xl shadow-card p-6">
        <Breadcrumbs path={breadcrumbs} />
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-6 flex-nowrap justify-center mx-auto min-w-fit" style={{scrollbarWidth: 'thin'}}>

            {columns.map((col: { id: string; title: string }, idx: number) => {
              const isRenaming = renamingColumnId === col.id;
              return (
                <div key={col.id} className="flex flex-col items-stretch">
                  <div className="flex items-center gap-1 mb-1">
                    {isRenaming ? (
                      <RenameColumnInline
                        value={col.title}
                        onSave={(name: string) => {
                          if (!name.trim()) return;
                          setColumns(cols => cols.map(c => c.id === col.id ? { ...c, title: name.trim() } : c));
                          setRenamingColumnId(null);
                        }}
                        onCancel={() => setRenamingColumnId(null)}
                      />
                    ) : (
                      <>
                        <button
                          className="text-lg font-semibold text-gray-800 bg-transparent border-none px-0 py-0 cursor-pointer hover:underline focus:outline-accent"
                          onClick={() => setRenamingColumnId(col.id)}
                          tabIndex={0}
                          aria-label={`Rename column ${col.title}`}
                          style={{ background: 'none' }}
                        >
                          {col.title}
                        </button>
                        <button
                          className="ml-1 text-gray-400 hover:text-accent focus:text-accent p-0.5 rounded focus:outline-accent"
                          onClick={() => setRenamingColumnId(col.id)}
                          tabIndex={0}
                          aria-label={`Edit column ${col.title}`}
                          style={{ background: 'none' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5zm10.71-6.29c.19-.19.29-.44.29-.71s-.1-.52-.29-.71l-1.5-1.5a1.003 1.003 0 00-1.42 0l-1.13 1.13 2.5 2.5 1.13-1.13z" fill="currentColor"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                  <KanbanColumn
                    columnId={col.id}
                    title={col.title}
                    cards={cards.filter((c: CardData) => c.status === col.id)}
                    onCardClick={(card: CardData) => {
                      if (card.hasSubBoard && card.subBoardId) {
                        if (boardData && boardData.depthLevel >= 3) {
                          setShowDepthModal(true);
                        } else {
                          // Do nothing for now
                        }
                      } else {
                        setSelectedCard(card);
                      }
                    }}
                    onMoveCard={handleMoveCard}
                    onAddCard={(title: string) => handleAddCard(col.id, title)}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    isDraggingCard={isDraggingCard}
                  />
                </div>
              );
            })}
            {/* New Column Button */}
            <div className="flex flex-col items-center justify-center min-w-[160px]">
              <button
                ref={newColumnBtnRef}
                className="flex items-center gap-2 px-4 py-2 rounded border border-gray-200 bg-gray-50 text-gray-400 hover:text-accent hover:border-accent transition-colors focus:outline-accent focus:ring-2 focus:ring-accent/30 text-base font-medium mt-8 mb-2"
                style={{ minHeight: 44 }}
                onClick={() => setShowNewColumnModal(true)}
                tabIndex={0}
                aria-label="Add new column"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/><path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <span>New Column</span>
              </button>
            </div>
            {/* Modal for new column */}
            <NewColumnModal
              open={showNewColumnModal}
              onClose={() => setShowNewColumnModal(false)}
              onCreate={(name: string) => {
                if (!name.trim()) return;
                // Generate unique id based on name and timestamp
                const id = name.trim().replace(/\s+/g, '-') + '-' + Date.now();
                setColumns(cols => [...cols, { id, title: name.trim() }]);
                setShowNewColumnModal(false);
                setTimeout(() => newColumnBtnRef.current?.focus(), 100);
              }}
            />
          </div>
        </div>
        {selectedCard ? (
          <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        ) : null}
        <DepthLimitModal
          open={showDepthModal}
          onCancel={() => setShowDepthModal(false)}
          onConfirm={() => setShowDepthModal(false)}
        />
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
