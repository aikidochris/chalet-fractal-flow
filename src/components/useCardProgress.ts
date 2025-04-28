import { useEffect, useState } from 'react';

export interface CardProgress {
  progress: number;
  tasksCount: number;
}

/**
 * useCardProgress - React hook for live card progress (percent and total tasks)
 * @param cardId string
 * @returns { progress, tasksCount }
 */
export function useCardProgress(cardId: string): { progress: number; tasksCount: number } {
  // Dummy: no tasks yet, progress starts at 0%
  return { progress: 0, tasksCount: 0 };
}
