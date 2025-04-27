# Chalet Fractal Flow

A proof-of-concept fractal Kanban board app with recursive boards, smooth navigation, and Firestore backend.

## Features
- Kanban columns: Ideas, In Progress, Completed
- Nested sub-boards with zoom and breadcrumbs
- Drag-and-drop (dnd-kit)
- Checklist, progress bar, pin-to-top, due dates, reminders
- Global fuzzy search (fuse.js)
- Firestore backend (Firebase SDK v9+)
- TailwindCSS styling

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your Firebase config in `src/firebase.ts`.
3. Run the app:
   ```bash
   npm start
   ```

## Tech Stack
- React (hooks)
- TailwindCSS
- dnd-kit
- Firebase Firestore
- fuse.js

## Firestore Data Model

### Collection: boards
- Fields:
  - id (document ID)
  - title: string
  - parentBoardId: string | null
  - depthLevel: number
  - createdAt: timestamp
  - updatedAt: timestamp

### Collection: cards
- Fields:
  - id (document ID)
  - boardId: string
  - title: string
  - description: string
  - status: "Ideas" | "In Progress" | "Completed"
  - pinned: boolean
  - hasSubBoard: boolean
  - subBoardId?: string
  - dueDate?: string (YYYY-MM-DD)
  - createdAt: timestamp
  - updatedAt: timestamp

### Subcollection: tasks (under each card)
- Fields:
  - id (document ID)
  - title: string
  - completed: boolean
  - createdAt: timestamp

---

This MVP is cleanly structured for extensibility and future enhancements.
