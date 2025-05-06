import React, { useState, useEffect, useRef } from 'react';
import { CardData } from './KanbanBoard';
import { useCardProgress } from './useCardProgress';
import CardColorPopover from './CardColorPopover';

export interface TaskData {
  id: string;
  title: string;
  completed: boolean;
}

interface CardModalProps {
  card: CardData & { tasks?: TaskData[] };
  onClose: () => void;
  onTogglePin: (cardId: string) => void;
  onUpdateTasks: (cardId: string, tasks: TaskData[]) => void;
  onDelete?: (cardId: string) => void;
  onSetColor?: (color: string) => void;
}

function CardModal({ card, onClose, onTogglePin, onUpdateTasks, onDelete, onSetColor }: CardModalProps) {
  if (!card) {
    return <div className="p-8 text-center text-gray-400">Loading card...</div>;
  }
  const [tasks, setTasks] = useState<TaskData[]>(card.tasks || []);
  const [newTask, setNewTask] = useState('');
  const [fadingTaskIds, setFadingTaskIds] = useState<string[]>([]);
  const [closing, setClosing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(card?.title || '');
  const [dueDate, setDueDate] = useState(card?.dueDate || '');
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  // For click-off-to-close
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

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
    if (onDelete) {
      onDelete(card.id);
    }
    onClose();
  };

  // Delete subtask
  const handleDeleteTask = async (taskId: string) => {
    setFadingTaskIds(ids => [...ids, taskId]);
    setTimeout(() => {
      setTasks(t => t.filter(task => task.id !== taskId));
      setFadingTaskIds(ids => ids.filter(id => id !== taskId));
      onUpdateTasks(card.id, tasks.filter(task => task.id !== taskId));
    }, 300);
  };



  // Dummy-data mode: reset tasks to empty on card change
  useEffect(() => {
    setTasks(card.tasks || []); // No default subtasks
    setTitle(card.title);
    setDueDate(card.dueDate || '');
  }, [card.id]);

  // Progress calculation
  const { progress } = useCardProgress(tasks);

  // Add new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const updatedTasks = [...tasks, { 
      id: `task-${Date.now()}`, 
      title: newTask.trim(), 
      completed: false 
    }];
    setTasks(updatedTasks);
    onUpdateTasks(card.id, updatedTasks);
    setNewTask('');
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    );
    setTasks(updatedTasks);
    onUpdateTasks(card.id, updatedTasks);
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
      onUpdateTasks(card.id, tasks.map(tsk => tsk.id === task.id ? { ...tsk, title: editingTaskTitle.trim() } : tsk));
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

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    default: { bg: '#fff', border: '#e5e7eb', text: '#222' },
    blue:    { bg: '#e0edfa', border: '#60a5fa', text: '#1e293b' },
    green:   { bg: '#e5f6e7', border: '#34d399', text: '#14532d' },
    yellow:  { bg: '#fffbe5', border: '#fbbf24', text: '#78350f' },
    red:     { bg: '#fdeaea', border: '#f87171', text: '#7f1d1d' },
    purple:  { bg: '#f3e8ff', border: '#a78bfa', text: '#4b006e' },
    grey:    { bg: '#f3f4f6', border: '#9ca3af', text: '#222' },
  };
  const colorKey = card.color || 'default';
  const color = colorMap[colorKey] || colorMap.default;

  const modalStyle = {
    background: color.bg,
    borderColor: color.border,
    color: color.text,
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
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8 p-6 transition-all duration-300 ${closing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        style={modalStyle}
        onClick={e => e.stopPropagation()}
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
          <div className="relative" >
            <button 
              ref={menuButtonRef}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setColorPopoverOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Set Colour
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDeleteCard}
                >
                  Delete Card
                </button>
              </div>
            )}
            <CardColorPopover
              open={colorPopoverOpen}
              anchorEl={menuButtonRef.current}
              selected={card.color || 'default'}
              onSelect={(color) => onSetColor?.(color)}
              onClose={() => setColorPopoverOpen(false)}
            />
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
                  onChange={() => handleToggleTask(task.id)}
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
