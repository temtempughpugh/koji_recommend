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
          <Search size={20} />
          <h2>メタデータ選択</h2>
        </div>
        <button className="reset-btn" onClick={resetFilters}>
          <RotateCcw size={14} />
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
          <label htmlFor="polishing_ratio">精米歩合</label>
          <div className="polishing-controls">
            <input
              id="polishing_ratio"
              type="number"
              placeholder="精米歩合"
              value={filters.polishing_ratio || ''}
              onChange={(e) => updateFilter('polishing_ratio', parseInt(e.target.value) || 0)}
            />
            <div className="range-indicator">
              <span>±</span>
            </div>
            <input
              type="number"
              placeholder="範囲"
              value={filters.polishing_range || ''}
              onChange={(e) => updateFilter('polishing_range', parseInt(e.target.value) || 0)}
              step="5"
              min="0"
            />
          </div>
          {filters.polishing_ratio > 0 && (
            <div className="range-preview">
              {filters.polishing_ratio - filters.polishing_range}% ～ {filters.polishing_ratio + filters.polishing_range}%
            </div>
          )}
        </div>

        {/* 重量範囲 */}
        <div className="filter-group">
          <label>重量範囲</label>
          <div className="range-controls">
            <input
              type="number"
              placeholder="最小"
              value={filters.weight_min || ''}
              onChange={(e) => updateFilter('weight_min', parseInt(e.target.value) || 0)}
            />
            <span className="separator">～</span>
            <input
              type="number"
              placeholder="最大"
              value={filters.weight_max || ''}
              onChange={(e) => updateFilter('weight_max', parseInt(e.target.value) || 0)}
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
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-xl: 16px;
        }

        .filters-container {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-content svg {
          color: var(--primary);
        }

        .filters-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 500;
          font-size: 11px;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          background: var(--danger-dark);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .polishing-controls {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .polishing-controls input {
          width: 70px;
        }

        .range-indicator {
          display: flex;
          align-items: center;
          gap: 2px;
          min-width: 20px;
          justify-content: center;
        }

        .range-indicator span {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 11px;
        }

        .range-controls {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .range-controls input {
          width: 60px;
        }

        .separator {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 11px;
          min-width: 20px;
          text-align: center;
        }

        .range-preview {
          font-size: 10px;
          color: var(--text-muted);
          font-style: italic;
          margin-top: 2px;
        }

        /* チェックボックスグループのスタイル */
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .checkbox-item:hover {
          background: var(--bg-secondary);
        }

        .checkbox-item input[type="checkbox"] {
          margin: 0;
          cursor: pointer;
          transform: scale(0.9);
        }

        .checkbox-label {
          color: var(--text-primary);
          font-weight: 400;
          cursor: pointer;
        }

        input, select {
          padding: 6px 8px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 11px;
          transition: all 0.2s ease;
          background: white;
          color: var(--text-primary);
          height: 32px;
        }

        /* 特定の入力欄の幅を値に合わせて最適化 */
        select {
          min-width: 100px;
        }

        input[type="number"] {
          width: 70px;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        input::placeholder {
          color: var(--text-muted);
          opacity: 0.8;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .filters-container {
            padding: 12px;
            margin-bottom: 12px;
          }

          .filters-header {
            margin-bottom: 12px;
          }

          .filters-header h2 {
            font-size: 14px;
          }

          .reset-btn {
            padding: 4px 8px;
            font-size: 10px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .filter-group {
            gap: 4px;
          }

          .filter-group label {
            font-size: 10px;
          }

          .polishing-controls {
            gap: 4px;
          }

          .polishing-controls input {
            width: 60px;
          }

          .range-controls input {
            width: 50px;
          }

          .checkbox-group {
            gap: 4px;
          }

          .checkbox-item {
            padding: 3px 5px;
            font-size: 10px;
          }

          input, select {
            padding: 4px 6px;
            font-size: 10px;
            height: 28px;
          }

          select {
            min-width: 80px;
          }

          input[type="number"] {
            width: 60px;
          }
        }

        @media (max-width: 480px) {
          .filters-container {
            padding: 8px;
          }

          .filters-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            margin-bottom: 10px;
          }

          .header-content {
            justify-content: center;
          }

          .filters-header h2 {
            font-size: 13px;
            text-align: center;
          }

          .reset-btn {
            align-self: center;
            padding: 3px 6px;
            font-size: 9px;
          }

          .filters-grid {
            gap: 8px;
          }

          .filter-group label {
            font-size: 9px;
          }

          .polishing-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
          }

          .polishing-controls input {
            width: 100%;
          }

          .range-indicator {
            justify-content: center;
            padding: 2px 0;
          }

          .range-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
          }

          .range-controls input {
            width: 100%;
          }

          .separator {
            text-align: center;
            padding: 2px 0;
          }

          .checkbox-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 3px;
          }

          .checkbox-item {
            padding: 2px 4px;
            font-size: 9px;
          }

          input, select {
            padding: 3px 4px;
            font-size: 9px;
            height: 24px;
          }

          select {
            min-width: auto;
            width: 100%;
          }

          input[type="number"] {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};