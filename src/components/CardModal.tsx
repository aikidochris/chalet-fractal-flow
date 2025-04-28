import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, query, onSnapshot, updateDoc, addDoc, doc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { CardData } from './KanbanBoard';

interface TaskData {
  id: string;
  title: string;
  completed: boolean;
}

interface CardModalProps {
  card: CardData;
  onClose: () => void;
  onTogglePin: (cardId: string) => void;
}

function CardModal({ card, onClose, onTogglePin }: CardModalProps) {
  if (!card) {
    return <div className="p-8 text-center text-gray-400">Loading card...</div>;
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [fadingTaskIds, setFadingTaskIds] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(card?.title || '');
  const [dueDate, setDueDate] = useState(card?.dueDate || '');
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  // For click-off-to-close
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  // Handle modal close with animation
  const handleModalClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  }

  // Delete card
  const handleDeleteCard = async () => {
    // Dummy: Just close modal
    onClose();
  };

  // Delete subtask
  const handleDeleteTask = async (taskId: string) => {
    setFadingTaskIds(ids => [...ids, taskId]);
    setTimeout(() => {
      setTasks(t => t.filter(task => task.id !== taskId));
      setFadingTaskIds(ids => ids.filter(id => id !== taskId));
    }, 300);
  };



  // Dummy-data mode: reset tasks to empty on card change
  useEffect(() => {
    setTasks([]); // No default subtasks
    setTitle(card.title);
    setDueDate(card.dueDate || '');
  }, [card.id]);

  // Progress calculation
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: `task-${Date.now()}`, title: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  // Toggle pin
  const handleTogglePin = () => {
    onTogglePin(card.id);
  };

  // Update due date (live update local state, save on Save)
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  // Save all changes
  const handleSave = async () => {
    setSaving(false);
    setEditingTitle(false);
    onClose();
  };

  // Edit subtask title
  const handleEditTaskTitle = (task: TaskData) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTaskTitle(e.target.value);
  };

  const handleTaskTitleBlur = async (task: TaskData) => {
    if (editingTaskTitle.trim() && editingTaskTitle !== task.title) {
      setTasks(t => t.map(tsk => tsk.id === task.id ? { ...tsk, title: editingTaskTitle.trim() } : tsk));
    }
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const handleTaskTitleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, task: TaskData) => {
    if (e.key === 'Enter') {
      await handleTaskTitleBlur(task);
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
      setEditingTaskTitle('');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalContentRef}
        className={`bg-white rounded-lg p-6 w-full max-w-md flex flex-col transition-transform transition-opacity duration-200 ease-in-out ${closing ? 'modal-animate-out' : 'modal-animate-in'}`}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Escape') handleModalClose();
        }}
      >
        <header className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {editingTitle ? (
              <input
                className="text-xl font-semibold border-b border-accent focus:outline-none focus:ring-2 focus:ring-accent px-1 w-full min-w-0"
                value={title}
                autoFocus
                onChange={e => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false); }}
                maxLength={100}
                style={{ wordBreak: 'break-word' }}
              />
            ) : (
              <h2
                className="text-xl font-semibold cursor-pointer truncate break-words max-w-full whitespace-pre-line"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                onClick={() => setEditingTitle(true)}
                title={title}
              >
                {title}
              </h2>
            )}
          </div>
          {/* Three dots menu for close/delete */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)} className="btn w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-accent" aria-haspopup="true" aria-expanded={menuOpen} aria-label="Card options" type="button">
              <span aria-hidden="true" className="text-xl">•••</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50" role="menu">
                <button onClick={() => { setMenuOpen(false); handleModalClose(); }} className="btn w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800" role="menuitem">
                  Close without saving
                </button>
                <button onClick={() => { setMenuOpen(false); if (window.confirm('Delete this card?')) handleDeleteCard(); }} className="btn w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" role="menuitem">
                  Delete Card
                </button>
              </div>
            )}
          </div>
        </header>
        {card.description && <p className="mb-4 text-gray-700">{card.description}</p>}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate || ''}
            onChange={handleDueDateChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div className="bg-accent h-2 rounded transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}% complete</div>
        </div>
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Checklist</h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-auto">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center gap-2 group px-1 py-1 rounded hover:bg-gray-50 transition-all${fadingTaskIds.includes(task.id) ? ' checklist-fade-out' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => setTasks(t => t.map(tsk => tsk.id === task.id ? { ...tsk, completed: !tsk.completed } : tsk))}
                />
                {editingTaskId === task.id ? (
                  <input
                    className="flex-1 px-1 border-b border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    value={editingTaskTitle}
                    autoFocus
                    onChange={handleTaskTitleChange}
                    onBlur={() => handleTaskTitleBlur(task)}
                    onKeyDown={e => handleTaskTitleKeyDown(e, task)}
                  />
                ) : (
                  <span
                    className={`checklist-strike${task.completed ? ' checked line-through text-gray-500' : ''}`}
                    onClick={() => handleEditTaskTitle(task)}
                    style={{ cursor: 'pointer' }}
                  >
                    {task.title}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete subtask"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="New task"
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button onClick={handleAddTask} className="btn px-3 py-1 bg-accent text-white rounded hover:bg-teal-600">Add</button>
        </div>
        <footer className="flex justify-between items-center pt-6 border-t mt-6">
          <button onClick={handleTogglePin} className="btn px-3 py-1 text-accent border border-accent bg-transparent rounded hover:bg-accent hover:text-white transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-accent" tabIndex={0} aria-label={card.pinned ? 'Unpin card' : 'Pin card'} type="button">
            {card.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn px-5 py-2 bg-accent text-white rounded shadow hover:bg-teal-600 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent" tabIndex={0} type="button">
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CardModal;
