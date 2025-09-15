import type { KojiRecord } from '../types/KojiRecord';
import type { FilterState } from '../types/FilterTypes';

export const filterRecords = (records: KojiRecord[], filters: FilterState): KojiRecord[] => {
  return records.filter(record => {
    // 品種フィルター
    if (filters.variety && record.variety !== filters.variety) {
      return false;
    }

    // 産地フィルター
    if (filters.origin && record.origin !== filters.origin) {
      return false;
    }

    // 精米歩合フィルター（範囲指定）
    if (filters.polishing_ratio > 0) {
      const minRatio = filters.polishing_ratio - filters.polishing_range;
      const maxRatio = filters.polishing_ratio + filters.polishing_range;
      if (record.polishing_ratio < minRatio || record.polishing_ratio > maxRatio) {
        return false;
      }
    }

    // 重量フィルター
    if (filters.weight_min > 0 && record.weight < filters.weight_min) {
      return false;
    }
    if (filters.weight_max > 0 && record.weight > filters.weight_max) {
      return false;
    }

    // 枚数フィルター（選択された枚数のみ表示）
    if (filters.sheets.length > 0 && !filters.sheets.includes(record.sheets)) {
      return false;
    }

    return true;
  });
};