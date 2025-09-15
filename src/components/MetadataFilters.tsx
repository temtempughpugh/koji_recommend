import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { FilterState, FilterOptions } from '../types/FilterTypes';

interface MetadataFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  updateFilter: (key: keyof FilterState, value: string | number | number[]) => void;
  resetFilters: () => void;
}

export const MetadataFilters: React.FC<MetadataFiltersProps> = ({
  filters,
  filterOptions,
  updateFilter,
  resetFilters
}) => {
  const handleSheetsChange = (sheets: number, checked: boolean) => {
    if (checked) {
      updateFilter('sheets', [...filters.sheets, sheets]);
    } else {
      updateFilter('sheets', filters.sheets.filter(s => s !== sheets));
    }
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="header-content">
          <Search size={24} />
          <h2>メタデータ選択</h2>
        </div>
        <button className="reset-btn" onClick={resetFilters}>
          <RotateCcw size={16} />
          リセット
        </button>
      </div>
      
      <div className="filters-grid">
        {/* 品種選択 */}
        <div className="filter-group">
          <label htmlFor="variety">品種</label>
          <select 
            id="variety"
            value={filters.variety} 
            onChange={(e) => updateFilter('variety', e.target.value)}
          >
            <option value="">すべての品種</option>
            {filterOptions.varieties.map(variety => (
              <option key={variety} value={variety}>{variety}</option>
            ))}
          </select>
        </div>

        {/* 産地選択 */}
        <div className="filter-group">
          <label htmlFor="origin">産地</label>
          <select 
            id="origin"
            value={filters.origin} 
            onChange={(e) => updateFilter('origin', e.target.value)}
          >
            <option value="">すべての産地</option>
            {filterOptions.origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        {/* 精米歩合 */}
        <div className="filter-group">
          <label>精米歩合</label>
          <div className="polishing-controls">
            <input 
              type="number" 
              value={filters.polishing_ratio || ''} 
              onChange={(e) => updateFilter('polishing_ratio', Number(e.target.value))}
              placeholder="70"
              min="0"
              max="100"
            />
            <div className="range-indicator">
              <span>±</span>
              <select 
                value={filters.polishing_range}
                onChange={(e) => updateFilter('polishing_range', Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
          {filters.polishing_ratio > 0 && (
            <div className="range-preview">
              {filters.polishing_ratio - filters.polishing_range}% 〜 {filters.polishing_ratio + filters.polishing_range}%
            </div>
          )}
        </div>

        {/* 重量範囲 */}
        <div className="filter-group">
          <label>重量 (kg)</label>
          <div className="range-controls">
            <input 
              type="number" 
              value={filters.weight_min || ''} 
              onChange={(e) => updateFilter('weight_min', Number(e.target.value))}
              placeholder="最小"
              min="0"
            />
            <span className="separator">〜</span>
            <input 
              type="number" 
              value={filters.weight_max || ''} 
              onChange={(e) => updateFilter('weight_max', Number(e.target.value))}
              placeholder="最大"
              min="0"
            />
          </div>
        </div>

        {/* 枚数（チェックボックス形式） */}
        <div className="filter-group">
          <label>枚数</label>
          <div className="checkbox-group">
            {filterOptions.sheets.map(sheets => (
              <label key={sheets} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={filters.sheets.includes(sheets)}
                  onChange={(e) => handleSheetsChange(sheets, e.target.checked)}
                />
                <span className="checkbox-label">{sheets}枚</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .filters-container {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-content svg {
          color: var(--primary);
        }

        .filters-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 700;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .polishing-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .polishing-controls input {
          flex: 2;
        }

        .range-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .range-indicator span {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .range-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .range-controls input {
          flex: 1;
        }

        .separator {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .range-preview {
          font-size: 12px;
          color: var(--text-muted);
          font-style: italic;
          margin-top: 4px;
        }

        /* チェックボックスグループのスタイル */
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .checkbox-item:hover {
          background: var(--bg-secondary);
        }

        .checkbox-item input[type="checkbox"] {
          margin: 0;
          cursor: pointer;
        }

        .checkbox-label {
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
        }

        input, select {
          padding: 12px 16px;
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 16px;
          transition: all 0.2s ease;
          background: white;
          color: var(--text-primary);
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          background: var(--danger-dark);
          transform: translateY(-1px);
        }

        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-tertiary: #f1f5f9;
          --text-primary: #1e293b;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --primary: #3b82f6;
          --primary-light: rgba(59, 130, 246, 0.1);
          --danger: #ef4444;
          --danger-dark: #dc2626;
          --radius-md: 8px;
          --radius-xl: 16px;
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .filters-container {
            padding: 20px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .polishing-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .range-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .checkbox-group {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};