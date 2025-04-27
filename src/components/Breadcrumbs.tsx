import React from 'react';
import { BoardState } from './KanbanBoard';

interface BreadcrumbsProps {
  path: BoardState[];
}

function Breadcrumbs({ path }: BreadcrumbsProps) {
  if (!path.length) return null;
  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {path.map((board, idx) => (
          <li key={board.id} className="flex items-center">
            <span className="font-medium text-header">{board.title}</span>
            {idx < path.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
