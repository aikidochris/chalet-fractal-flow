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
  // Dummy: always return 67% (2/3 complete)
  return { progress: 67, tasksCount: 3 };
}
