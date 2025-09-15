import { useState, useMemo, useEffect } from 'react';
import type { KojiRecord } from '../types/KojiRecord';
import type { FilterState } from '../types/FilterTypes';
import { filterRecords } from '../utils/dataFilter';

// デバウンスフック
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const initialFilterState: FilterState = {
  variety: '',
  origin: '',
  polishing_ratio: 0,
  polishing_range: 5,
  weight_min: 0,
  weight_max: 0,
  sheets: 6
};

export const useFilters = (data: KojiRecord[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  
  // 入力遅延（500ms）でフィルター適用
  const debouncedFilters = useDebounce(filters, 500);

  const filteredData = useMemo(() => {
    return filterRecords(data, debouncedFilters);
  }, [data, debouncedFilters]);

  const updateFilter = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  return {
    filters,
    filteredData,
    updateFilter,
    resetFilters
  };
};