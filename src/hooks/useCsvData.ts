import { useState, useEffect } from 'react';
import type { KojiRecord } from '../types/KojiRecord';
import type { FilterOptions } from '../types/FilterTypes';
import { loadCsvFile } from '../utils/csvParser';

interface UseCsvDataReturn {
  data: KojiRecord[];
  filterOptions: FilterOptions;
  loading: boolean;
  error: string | null;
}

export const useCsvData = (): UseCsvDataReturn => {
  const [data, setData] = useState<KojiRecord[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    varieties: [],
    origins: [],
    sheets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const csvData = await loadCsvFile();
        setData(csvData);

        const varieties = [...new Set(csvData.map(record => record.variety).filter(v => v))];
        const origins = [...new Set(csvData.map(record => record.origin).filter(o => o))];
        const sheets = [...new Set(csvData.map(record => record.sheets).filter(s => s > 0))].sort((a, b) => b - a);

        setFilterOptions({
          varieties: varieties.sort(),
          origins: origins.sort(),
          sheets: sheets
        });

        setError(null);
      } catch (err) {
        console.error('データ読み込みエラー:', err);
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, filterOptions, loading, error };
};