import { useMemo } from 'react';
import type { KojiRecord, SummaryStats } from '../types/KojiRecord';
import { calculateSummaryStats } from '../utils/statsCalculator';

export const useStats = (filteredData: KojiRecord[]): SummaryStats => {
  const stats = useMemo(() => {
    return calculateSummaryStats(filteredData);
  }, [filteredData]);

  return stats;
};