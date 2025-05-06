import { useEffect, useState } from 'react';
import type { TaskData } from './CardModal';

/**
 * useCardProgress - React hook for live card progress (percent and total tasks)
 * @param tasks TaskData[] - Array of tasks for the card
 * @returns { progress, tasksCount }
 */
export function useCardProgress(tasks: TaskData[]): { progress: number; tasksCount: number } {
  const tasksCount = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;
  const progress = tasksCount > 0 ? Math.round((completedCount / tasksCount) * 100) : 0;

  return { progress, tasksCount };
}
